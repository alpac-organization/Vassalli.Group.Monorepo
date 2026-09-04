import { Button, Dropdown, Alert } from "@alpac/design-system";
import { useForm, Controller } from "react-hook-form";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { SelectedAssignmentTarget } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";

export type StepBodegaFormValues = {
  warehouse_id: string;
  warehouse_chief_user_id: string;
};

type StepBodegaProps = {
  target: SelectedAssignmentTarget;
  warehousesData?: GetWarehousesResponse;
  collaboratorsOptions: { value: string; label: string }[];
  isSubmitting: boolean;
  onSubmit: (values: StepBodegaFormValues) => void;
  onCancel: () => void;
};

const inputClassName =
  "h-[42px]! sm:h-[46px]! text-sm! rounded-md! border-slate-300! dark:border-slate-600!";
const labelClassName =
  "text-xs! sm:text-sm! font-medium! text-slate-600! dark:text-slate-300!";

export function StepBodega({
  target,
  warehousesData,
  collaboratorsOptions,
  isSubmitting,
  onSubmit,
  onCancel,
}: StepBodegaProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepBodegaFormValues>({
    defaultValues: { warehouse_id: "", warehouse_chief_user_id: "" },
  });

  const warehouseOptions =
    warehousesData?.data?.map((w) => {
      const occupied = w.capacity?.occupied_area_m2 || 0;
      const total = w.capacity?.total_area_m2 || 1; 
      let percentage = w.capacity?.occupancy_percentage;
      if (!percentage || percentage === 0) {
        percentage = w.capacity?.total_area_m2 ? (occupied / total) * 100 : 0;
      }
      
      const name = w.warehouse_name ?? "Sin nombre";
      return {
        value: w.warehouse_id,
        label: `${name} (${Math.round(percentage)}%)`,
      };
    }) ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Alert
        type="success"
        title="Información de Asignación"
        message={
          <>
            <strong>Tipo de Doc.:</strong> {target.document_type || "N/A"}<br/>
            <strong>No. Documento:</strong> {target.ducat_number || "N/A"}<br/>
            <strong>Orden de Servicio:</strong> {target.service_order_code || "N/A"}
          </> as unknown as string
        }
      />

      {/* Selector de Bodega */}
      <div className="flex flex-col gap-1">
        <Controller
          name="warehouse_id"
          control={control}
          rules={{ required: "Seleccione una bodega" }}
          render={({ field }) => (
            <Dropdown
              appearance="dark"
              label="Bodega *"
              placeholder="Seleccionar bodega..."
              options={warehouseOptions}
              value={field.value || undefined}
              onChange={(value) => field.onChange(String(value ?? ""))}
              labelClassName={labelClassName}
              className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
            />
          )}
        />
        {errors.warehouse_id && (
          <small className="text-red-500 text-xs">
            {errors.warehouse_id.message}
          </small>
        )}
      </div>

      {/* Selector de Jefe de Bodega */}
      <div className="flex flex-col gap-1">
        <Controller
          name="warehouse_chief_user_id"
          control={control}
          rules={{ required: "Seleccione un jefe de bodega" }}
          render={({ field }) => (
            <Dropdown
              appearance="dark"
              label="Jefe de Bodega *"
              placeholder="Seleccionar jefe..."
              options={collaboratorsOptions}
              value={field.value || undefined}
              onChange={(value) => field.onChange(String(value ?? ""))}
              labelClassName={labelClassName}
              className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
            />
          )}
        />
        {errors.warehouse_chief_user_id && (
          <small className="text-red-500 text-xs">
            {errors.warehouse_chief_user_id.message}
          </small>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          label="Cancelar"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-transparent! border! border-slate-300! text-slate-700! hover:bg-slate-50! dark:border-slate-600! dark:text-slate-300!"
        />
        <Button
          type="submit"
          label={isSubmitting ? "Guardando..." : "Continuar →"}
          disabled={isSubmitting}
          className="bg-alpac-primary-500! hover:bg-alpac-primary-600! text-white! dark:bg-alpac-primary-700!"
        />
      </div>
    </form>
  );
}

