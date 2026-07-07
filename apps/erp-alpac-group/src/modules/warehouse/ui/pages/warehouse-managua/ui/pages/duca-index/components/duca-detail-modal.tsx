import React from 'react';
import { Modal, Button } from '@alpac/design-system';

interface DucaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (duca: string) => void; // Definición explícita aquí
}

export const DucaDetailModal: React.FC<DucaDetailModalProps> = ({ isOpen, onClose, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar DUCA">
       {/* ... contenido ... */}
       <Button label="Guardar" onClick={() => onSave("DUCA-001")} />
    </Modal>
  );
};