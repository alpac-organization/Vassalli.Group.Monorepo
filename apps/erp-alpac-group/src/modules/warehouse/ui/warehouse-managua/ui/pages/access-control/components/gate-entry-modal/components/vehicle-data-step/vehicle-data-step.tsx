import { InputText } from "@alpac/design-system";
import {
  gateEntryInputClassName,
  gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { VehicleDataStepProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data-step/types/vehicle-data.props";

export function VehicleDataStep({ register }: VehicleDataStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2">
      <InputText
        label="País de Origen"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("countryOfOrigin")}
      />
      <InputText
        label="Aduana"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("aduana")}
      />
      <InputText
        label="Placa del Cabezal"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("plateNumber", { required: true })}
      />
      <InputText
        label="Trailer / Chasis"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("trailerChassis")}
      />
      <InputText
        label="Conductor"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("driverName", { required: true })}
      />
      <InputText
        label="Licencia"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("driverLicense")}
      />
      <InputText
        label="Transportista"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("transportista")}
      />
      <InputText
        label="Consignatario"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("consignee")}
      />
      <InputText
        label="Marchamo"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("sealNumber")}
      />
      <InputText
        label="Medio"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        {...register("medio")}
      />
    </div>
  );
}
