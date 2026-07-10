import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@alpac/design-system';

export interface DucaPayload {
  recordEntranceId: string;
  ducatNumber: string;
  categoryProductId: string;
  totalBultos: number;
  totalWeight: number;
  productDescription: string;
  remitente: string;
  destinationAreaObservation: string;
}

interface DucaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: DucaPayload) => void;
  recordEntranceId: string | null;
}

export const DucaDetailModal: React.FC<DucaDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  recordEntranceId 
}) => {
  const [ducatNumber, setDucatNumber] = useState('');
  const [categoryProductId, setCategoryProductId] = useState('');
  const [totalBultos, setTotalBultos] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [productDescription, setProductDescription] = useState('');
  const [remitente, setRemitente] = useState('');
  const [destinationAreaObservation, setDestinationAreaObservation] = useState('');

  // Limpieza y reinicio del formulario al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setDucatNumber('');
      setCategoryProductId('');
      setTotalBultos(0);
      setTotalWeight(0);
      setProductDescription('');
      setRemitente('');
      setDestinationAreaObservation('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    
    // Validación estricta del contexto de negocio antes de despachar
    if (!recordEntranceId || !ducatNumber.trim()) return;

    onSave({
      recordEntranceId,
      ducatNumber: ducatNumber.trim(),
      categoryProductId,
      totalBultos,
      totalWeight,
      productDescription: productDescription.trim(),
      remitente: remitente.trim(),
      destinationAreaObservation: destinationAreaObservation.trim()
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vincular Registro de Mercancía (DUCA)">
      <form onSubmit={handleSubmit} className="space-y-4 p-2 text-slate-900 dark:text-white">
        
        {/* Banner de Contexto de Vinculación */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
            Asociando documentación al registro de entrada:
          </p>
          <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
            {recordEntranceId || "No especificado"}
          </span>
        </div>

        {/* Input: Número de DUCA */}
        <div>
          <label className="block text-sm font-medium mb-1">Número de DUCA / DUCAT *</label>
          <input 
            type="text" 
            required
            placeholder="Ej: DUCA-MGA-2026-X992"
            value={ducatNumber}
            onChange={(e) => setDucatNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid: Bultos y Peso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Total de Bultos</label>
            <input 
              type="number" 
              min="0"
              value={totalBultos}
              onChange={(e) => setTotalBultos(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Peso Total (Kg)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              value={totalWeight}
              onChange={(e) => setTotalWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Grid: Remitente y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Remitente</label>
            <input 
              type="text" 
              placeholder="Empresa Exportadora S.A."
              value={remitente}
              onChange={(e) => setRemitente(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría de Producto (Id)</label>
            <select 
              value={categoryProductId}
              onChange={(e) => setCategoryProductId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione Categoría</option>
              <option value="cat-01">Materia Prima</option>
              <option value="cat-02">Producto Terminado</option>
              <option value="cat-03">Carga Peligrosa</option>
            </select>
          </div>
        </div>

        {/* Textarea: Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción de la Mercancía</label>
          <textarea 
            rows={2}
            placeholder="Detalle de los productos manifestados..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Input: Observaciones */}
        <div>
          <label className="block text-sm font-medium mb-1">Observaciones de Área de Destino</label>
          <input 
            type="text" 
            placeholder="Ej: Ubicar en Zona Fiscal - Ala Sur"
            value={destinationAreaObservation}
            onChange={(e) => setDestinationAreaObservation(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Acciones del Modal */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <Button 
            type="button"
            label="Cancelar" 
            onClick={onClose} 
            className="min-w-0 shrink-0 rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30!"
          />
          <Button 
            type="submit"
            label="Vincular Documento" 
          />
        </div>
      </form>
    </Modal>
  );
};