import {
  Button,
  InputText,
  Modal,
  Stepper,
} from "@alpac/design-system";
import React, { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { SaveIcon, ArrowRightIcon, XIcon, ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";

// 1. Interfaz del formulario para cumplir con la arquitectura del sistema
interface ReceptionFormValues {
  countryOfOrigin: string;
  aduana: string;
  plateNumber: string;
  trailerChassis: string;
  driverName: string;
  driverLicense: string;
  transportista: string;
  consignee: string;
  sealNumber: string;
  medio: string;
  ducas: { value: string }[];
}

interface GateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateEntryModal: React.FC<GateEntryModalProps> = ({ isOpen, onClose }) => {
  // Inicialización con FieldArray para manejar N DUCAs dinámicas
  const { register, handleSubmit, control } = useForm<ReceptionFormValues>({
    defaultValues: {
      ducas: [{ value: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ducas"
  });

  const labelStyle = "text-slate-150 font-semibold text-sm";

  const [currentStep, setCurrentStep] = useState(0);

  const onSubmit: SubmitHandler<ReceptionFormValues> = (data) => {
    console.log("Guardando registro final en Warehouse Managua:", data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registro de Entrada de Vehículo" size="3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        
        {/* Stepper corporativo */}
        <Stepper currentStep={currentStep} steps={["Datos Vehículo", "Documentos (DUCAs)"]} />

        <div className="mt-8 space-y-6">
          {currentStep === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <InputText label="País de Origen" {...register("countryOfOrigin")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Aduana" {...register("aduana")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Placa Cabezal" {...register("plateNumber")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Trailer / Chasis" {...register("trailerChassis")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Conductor" {...register("driverName")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Licencia" {...register("driverLicense")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Transportista" {...register("transportista")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Consignatario" {...register("consignee")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Marchamo" {...register("sealNumber")} labelClassName={labelStyle} className="bg-transparent!" />
              <InputText label="Medio" {...register("medio")} labelClassName={labelStyle} className="bg-transparent!" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Detalle de DUCAs</h4>
                <Button 
                  type="button" 
                  label="Agregar" 
                  onClick={() => append({ value: "" })} 
                  icon={<PlusIcon size={16} />}
                  className="text-alpac-primary-600! bg-transparent!"
                />
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <InputText 
                    label={`Documento DUCA #${index + 1}`} 
                    {...register(`ducas.${index}.value` as const)} 
                   labelClassName={labelStyle} className="bg-transparent! flex-1" 
                  />
                  <Button 
                    type="button" 
                    onClick={() => remove(index)} 
                    className="text-red-500 hover:bg-red-50"
                    icon={<Trash2Icon size={18} />} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botonera estandarizada "Giant" estilo Alpac */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <Button
            type="button"
            label="Cancelar"
            size="giant"
            onClick={onClose}
            className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-100! bg-transparent!"
            icon={<XIcon size={20} />}
          />
          
          {currentStep === 0 ? (
            <Button
              type="button"
              label="Siguiente"
              size="giant"
              onClick={() => setCurrentStep(1)}
              className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500!"
              icon={<ArrowRightIcon size={20} />}
            />
          ) : (
            <div className="flex gap-3">
              <Button
                type="button"
                label="Atrás"
                size="giant"
                onClick={() => setCurrentStep(0)}
                className="text-[15px]! rounded-md! bg-slate-100! bg-transparent!"
                icon={<ArrowLeftIcon size={20} />}
              />
              <Button
                type="submit"
                label="Finalizar y Guardar"
                size="giant"
                className="text-[15px]! rounded-md! bg-emerald-600! hover:bg-emerald-700! text-white!"
                icon={<SaveIcon size={20} />}
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};