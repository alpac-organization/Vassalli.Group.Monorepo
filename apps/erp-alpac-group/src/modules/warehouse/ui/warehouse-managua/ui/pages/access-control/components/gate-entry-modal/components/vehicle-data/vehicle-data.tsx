import { Dropdown, InputText, RadioButton } from "@alpac/design-system";
import {
  gateEntryInputClassName,
  gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { VehicleDataStepProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data/types/vehicle-data.props";
import {
  formatCodeAduana,
  validateOnlyLettersWithAccentsAndDiacritics,
} from "@app/shared/utils/string.utils";
import { useEffect, useMemo, useState } from "react";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";

export function VehicleDataStep({
  register,
  setValue,
  watch,
  errors,
  documentType,
  onChangeDocumentType,
  vehicleOptions = [],
}: VehicleDataStepProps) {
  const [selectedModality, setSelectedModality] = useState<
    "reception" | "dispatch"
  >("reception");
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType>(documentType);
  const transportUnitId = watch("transportUnitId");

  const vehicleDropdownOptions = useMemo(
    () =>
      vehicleOptions.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.name,
      })),
    [vehicleOptions],
  );

  useEffect(() => {
    setSelectedDocumentType(documentType);
  }, [documentType]);

  useEffect(() => {
    register("transportUnitId", {
      required: "Debe seleccionar una unidad de transporte.",
      validate: (value: string) =>
        Boolean(value?.trim()) || "Debe seleccionar una unidad de transporte.",
    });
  }, [register]);

  const handleModalityChange = (modality: "reception" | "dispatch") => {
    setSelectedModality(modality);
  };

  const handleTransportUnitChange = (value: string | number) => {
    const id = String(value);
    const selected = vehicleOptions.find((vehicle) => vehicle.id === id);

    setValue("transportUnitId", id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (selected?.name) {
      setValue("medio", selected.name, {
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2">
      <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3">
        <div className="flex flex-col">
          <span className={gateEntryLabelClassName}>Modalidad de acceso</span>
          <div className="flex flex-row gap-4 items-center h-12">
            <RadioButton
              label="Para Recepción"
              value="reception"
              checked={selectedModality === "reception"}
              onChange={() => handleModalityChange("reception")}
            />
          </div>
        </div>

        {selectedModality === "reception" && (
          <div className="flex flex-col sm:col-span-2">
            <span className={gateEntryLabelClassName}>Tipo de documento</span>
            <div className="flex flex-row flex-wrap gap-4 items-center min-h-12">
              <RadioButton
                label="DUCA"
                value={DocumentEnum.DUCA.value}
                checked={selectedDocumentType === DocumentEnum.DUCA}
                onChange={() => {
                  setSelectedDocumentType(DocumentEnum.DUCA);
                  onChangeDocumentType(DocumentEnum.DUCA);
                }}
              />

              <RadioButton
                label="Declaración Aduanera"
                value={DocumentEnum.CustomsDeclaration.value}
                checked={
                  selectedDocumentType === DocumentEnum.CustomsDeclaration
                }
                onChange={() => {
                  setSelectedDocumentType(DocumentEnum.CustomsDeclaration);
                  onChangeDocumentType(DocumentEnum.CustomsDeclaration);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="sm:col-span-2 lg:col-span-1 min-w-0">
        <Dropdown
          label="Unidad de transporte"
          appearance="dark"
          isRequired
          placeholder={
            vehicleDropdownOptions.length === 0
              ? "No hay unidades disponibles"
              : "Seleccione una unidad"
          }
          options={vehicleDropdownOptions}
          value={transportUnitId || undefined}
          onChange={handleTransportUnitChange}
          error={errors.transportUnitId?.message}
          labelClassName={gateEntryLabelClassName}
          className={`${gateEntryInputClassName} h-[42px]! sm:h-[46px]!`}
        />
      </div>

      <InputText
        label="País de Origen"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("countryOfOrigin", {
          required: "El país de procedencia es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            onlyLetters: (value: string) =>
              validateOnlyLettersWithAccentsAndDiacritics(value || "", true),
          },
        })}
        error={errors.countryOfOrigin?.message}
      />

      <InputText
        label="Aduana de Ingreso"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("aduana", {
          required: "La Aduana de ingreso es obligatoria.",
          setValueAs: (value: string) => value?.trim(),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const formatted = formatCodeAduana(e.target.value);
            setValue("aduana", formatted, {
              shouldValidate: true,
              shouldDirty: true,
            });
          },
        })}
        error={errors.aduana?.message}
      />

      <InputText
        label="Numero de Placa"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("plateNumber", {
          required: "El número de placa es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
        })}
        error={errors.plateNumber?.message}
      />

      <InputText
        label="Chasis de Remolque"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("trailerChassis", {
          required: "El número de chasis/remolque es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
        })}
        error={errors.trailerChassis?.message}
      />

      <InputText
        label="Conductor"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("driverName", {
          required: "El nombre del conductor es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            onlyLetters: (value: string) =>
              validateOnlyLettersWithAccentsAndDiacritics(value || "", true),
          },
        })}
        error={errors.driverName?.message}
      />

      <InputText
        label="Licencia"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("driverLicense", {
          required: "La licencia del conductor es obligatoria.",
          setValueAs: (value: string) => value?.trim(),
        })}
        error={errors.driverLicense?.message}
      />

      <InputText
        label="Transportista"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("transportista", {
          required: "La empresa transportista es requerida.",
          setValueAs: (value: string) => value?.trim(),
        })}
        error={errors.transportista?.message}
      />

      <InputText
        label="Numero de sello"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("sealNumber", {
          required: "El número de marchamo es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
        })}
        error={errors.sealNumber?.message}
      />
    </div>
  );
}
