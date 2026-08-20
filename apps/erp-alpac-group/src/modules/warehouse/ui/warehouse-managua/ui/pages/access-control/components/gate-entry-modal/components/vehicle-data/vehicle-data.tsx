import { Dropdown, InputText, RadioButton } from "@alpac/design-system";
import {
  gateEntryInputClassName,
  gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { VehicleDataStepProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data/types/vehicle-data.props";
import {
  validateOnlyLettersWithAccentsAndDiacritics,
  isAlfaNumericValue,
} from "@app/shared/utils/string.utils";
import { useEffect, useMemo, useState } from "react";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { TransportUnitOptions } from "@app/modules/warehouse/domain/enums/warehouse-managua/transport-unit";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import type { CustomBranch } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
export function VehicleDataStep({
  register,
  setValue,
  watch,
  errors,
  documentType,
  onChangeDocumentType,
}: VehicleDataStepProps) {
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType>(documentType);
  const transportUnitId = watch("transportUnitId");
  const customBranchId = watch("customBranchId");

  const { companyId, moduleCode } = useUserStore();

  const { GetCustomBranches } = useWarehouse({
    getCustomBranchesPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const customBranchesOptions = useMemo(() => {
    if (!GetCustomBranches.data) return [];
    return GetCustomBranches.data.map((branch: CustomBranch) => ({
      value: branch.id,
      label: branch.name,
    }));
  }, [GetCustomBranches.data]);

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

  const handleTransportUnitChange = (value: string | number) => {
    const id = String(value);

    setValue("transportUnitId", id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const initialSealEvidence = watch("sealEvidence");
  const [sealEvidenceImages, setSealEvidenceImages] = useState<ImageOutput[]>(() => {
    if (!initialSealEvidence || !Array.isArray(initialSealEvidence)) return [];
    return initialSealEvidence.map((img: any) => ({
      id: typeof crypto !== "undefined" && crypto.randomUUID 
          ? crypto.randomUUID() 
          : Date.now().toString(36) + Math.random().toString(36).substring(2),
      file: img.file,
      base64: img.imageBase64,
      preview: img.file ? URL.createObjectURL(img.file) : "",
    }));
  });

  const handleSealEvidenceSelect = (images: ImageOutput[]) => {
    setSealEvidenceImages(images);
    const mappedImages = images.map((img) => ({
      file: img.file,
      imageBase64: img.base64,
      contentType: img.contentType,
    }));
    setValue("sealEvidence", mappedImages, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2">
      <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 items-start">
        <div className="flex flex-col min-w-0 mb-2">
          <span className={gateEntryLabelClassName}>
            Seleccione Tipo de documento:
          </span>
          <div className="flex flex-row flex-wrap gap-3 sm:gap-4 items-center min-h-12">
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
              checked={selectedDocumentType === DocumentEnum.CustomsDeclaration}
              onChange={() => {
                setSelectedDocumentType(DocumentEnum.CustomsDeclaration);
                onChangeDocumentType(DocumentEnum.CustomsDeclaration);
              }}
            />
          </div>
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-1 min-w-0">
        <Dropdown
          label="Unidad de transporte"
          appearance="dark"
          isRequired
          placeholder="Seleccione una unidad"
          options={TransportUnitOptions}
          value={Number(transportUnitId)}
          onChange={handleTransportUnitChange}
          error={errors.transportUnitId?.message}
          labelClassName={gateEntryLabelClassName}
          className={`${gateEntryInputClassName} h-[42px]! sm:h-[46px]!`}
        />
      </div>

      <InputText
        label="País de origen"
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

      <div className="min-w-0">
        <Dropdown
          label="Aduana de ingreso"
          appearance="dark"
          isRequired
          placeholder={
            customBranchesOptions.length === 0
              ? "Cargando aduanas..."
              : "Seleccione una aduana"
          }
          options={customBranchesOptions}
          value={customBranchId || undefined}
          onChange={(value) => {
            setValue("customBranchId", String(value), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          error={errors.customBranchId?.message}
          labelClassName={gateEntryLabelClassName}
          className={`${gateEntryInputClassName} h-[42px]! sm:h-[46px]!`}
        />
        <input
          type="hidden"
          {...register("customBranchId", {
            required: "La Aduana de ingreso es obligatoria.",
          })}
        />
      </div>

      <InputText
        label="Numero de placa"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("plateNumber", {
          required: "El número de placa es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de placa válido.";
            }
            return true;
          },
        })}
        error={errors.plateNumber?.message}
      />

      <InputText
        label="Chasis de remolque"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("trailerChassis", {
          required: "El número de chasis/remolque es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de chasis/remolque válido.";
            }
            return true;
          },
        })}
        error={errors.trailerChassis?.message}
      />

      <InputText
        label="Número de Contenedor"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("containerNumber", {
          required: "El número de contenedor es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de contenedor válido.";
            }
            return true;
          },
        })}
        error={errors.containerNumber?.message}
      />

      <InputText
        label="Nombre del donductor"
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
        label="Codigo de licencia"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("driverLicense", {
          required: "La licencia del conductor es obligatoria.",
          setValueAs: (value: string) => value?.trim(),
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de licencia válido.";
            }
            return true;
          },
        })}
        error={errors.driverLicense?.message}
      />

      <InputText
        label="Agencia transportista"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        {...register("transportista", {
          required: "La empresa transportista es requerida.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            onlyLetters: (value: string) =>
              validateOnlyLettersWithAccentsAndDiacritics(value || "", true) ||
              ".",
          },
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
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de sello válido.";
            }
            return true;
          },
        })}
        error={errors.sealNumber?.message}
      />

      <div className="sm:col-span-2 lg:col-span-3">
        <ImageUploader
          value={sealEvidenceImages}
          label="Evidencia"
          isRequired
          maxFiles={5}
          maxSizeMB={5}
          description="Arrastre, seleccione una imagen o tome una foto. Se permiten múltiples fotos."        
          onChange={handleSealEvidenceSelect}
          error={errors.sealEvidence?.message}
        />
      </div>
    </div>
  );
}
