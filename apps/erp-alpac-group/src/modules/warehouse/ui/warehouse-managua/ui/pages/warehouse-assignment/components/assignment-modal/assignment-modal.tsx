import { useState, useMemo } from "react";
import { Modal, Stepper } from "@alpac/design-system";
import type { AssignmentModalProps, AssignmentWizardStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/assignment-modal.types";
import { StepBodega, type StepBodegaFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/steps/step-warehouse";
import { StepCuadrilla, type StepCuadrillaFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/steps/step-crew";
import { StepMaquinaria, type StepMaquinariaFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/steps/step-machinery";
import { StepConfirmar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/steps/step-resume";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useWarehouseAssignment";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-machinery";

const STEPS: AssignmentWizardStep[] = ["bodega", "cuadrilla", "maquinaria", "confirmar"];
const STEP_LABELS: string[] = ["BODEGA", "CUADRILLA", "MAQUINARIA", "CONFIRMAR"];

export type AssignmentSummaryData = {
  bodega?: { warehouseName: string; chiefName?: string };
  cuadrilla?: { text: string };
  maquinaria?: { text: string };
};

type AssignmentModalInternalProps = AssignmentModalProps & {
  collaboratorsOptions: { value: string; label: string }[];
  onSuccess: () => void;
  onError: (msg: string) => void;
};

export function AssignmentModal({
  isOpen,
  onClose,
  target,
  companyId,
  moduleCode,
  collaboratorsOptions,
  onSuccess,
  onError,
}: AssignmentModalInternalProps) {
  const [currentStep, setCurrentStep] = useState<AssignmentWizardStep>("bodega");
  const [summaryData, setSummaryData] = useState<AssignmentSummaryData>({});

  const payloadMachinery = useMemo(
    () => ({ company_id: companyId, module_code: moduleCode }),
    [companyId, moduleCode],
  );

  const payloadWarehouses = useMemo(
    () => ({ company_id: companyId, module_code: moduleCode }),
    [companyId, moduleCode],
  );

  const {
    CreateWarehouseAssignment,
    CreateUnloadingCrew,
    CreateUnloadingMachinery,
    CompleteAssignment,
    GetMachineryCatalogs,
  } = useWarehouseAssignment({ payloadMachineryCatalogs: payloadMachinery });

  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload: {
      ...payloadWarehouses,
      page_size: 10,
      page_number: 1,
    },
  });

  const machineryCatalog = GetMachineryCatalogs.data ?? [];

  const goTo = (step: AssignmentWizardStep) => setCurrentStep(step);

  const handleClose = () => {
    setCurrentStep("bodega");
    setSummaryData({});
    onClose();
  };

  // ── PASO 1: Crear asignación base ────────────────────────────────────────
  const handleBodegaSubmit = async (values: StepBodegaFormValues) => {
    if (!target) return;
    try {
      await CreateWarehouseAssignment.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        reception_id: target.reception_id,
        entrance_ducat_id: target.entrance_ducat_id,
        warehouse_id: values.warehouse_id,
        warehouse_chief_user_id: values.warehouse_chief_user_id,
      });

      const wh = GetWarehouses.data?.data.find((w) => w.warehouse_id === values.warehouse_id);
      const chief = collaboratorsOptions.find((c) => c.value === values.warehouse_chief_user_id);

      setSummaryData((prev) => ({
        ...prev,
        bodega: {
          warehouseName: wh?.warehouse_name || "N/A",
          chiefName: chief?.label || "N/A",
        },
      }));

      goTo("cuadrilla");
    } catch {
      onError("Error al guardar la asignación de bodega");
    }
  };

  // ── PASO 2: Cuadrilla ────────────────────────────────────────────────────
  const handleCrewSubmit = async (values: StepCuadrillaFormValues) => {
    if (!target) return;
    try {
      await CreateUnloadingCrew.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        reception_id: target.reception_id,
        entrance_ducat_id: target.entrance_ducat_id,
        ...values,
      } as CreateUnloadingCrewRequest);

      let crewText = "";
      if (values.is_outsourced) {
        crewText = `Tercerizada (${values.provider_name} - ${values.person_count} personas)`;
      } else {
        crewText = `Interna (${values.collaborator_ids.length} colaboradores)`;
      }

      setSummaryData((prev) => ({
        ...prev,
        cuadrilla: { text: crewText },
      }));

      goTo("maquinaria");
    } catch {
      onError("Error al guardar la cuadrilla");
    }
  };

  // ── PASO 3: Maquinaria ───────────────────────────────────────────────────
  const handleMachinerySubmit = async (values: StepMaquinariaFormValues) => {
    if (!target) return;
    try {
      await CreateUnloadingMachinery.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        reception_id: target.reception_id,
        entrance_ducat_id: target.entrance_ducat_id,
        ...values,
      } as CreateUnloadingMachineryRequest);

      let machText = "";
      if (values.is_outsourced) {
        machText = `Tercerizada (${values.provider_name})`;
      } else {
        const mach = machineryCatalog.find((m) => m.id === values.machinery_id);
        const op = collaboratorsOptions.find((c) => c.value === values.operator_collaborator_id);
        machText = `Interna (${mach?.name || "N/A"}) - Operador: ${op?.label || "N/A"}`;
      }

      setSummaryData((prev) => ({
        ...prev,
        maquinaria: { text: machText },
      }));

      goTo("confirmar");
    } catch {
      onError("Error al guardar la maquinaria");
    }
  };

  // ── PASO 4: Completar ────────────────────────────────────────────────────
  const handleComplete = async () => {
    if (!target) return;
    try {
      await CompleteAssignment.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        reception_id: target.reception_id,
        entrance_ducat_id: target.entrance_ducat_id,
      });
      onSuccess();
      handleClose();
    } catch {
      onError("Error al finalizar la asignación");
    }
  };

  const stepIndex = STEPS.indexOf(currentStep);

  return (
    <Modal
      isOpen={isOpen && Boolean(target)}
      onClose={handleClose}
      size="lg"
      title="Asignación"
      panelClassName="overflow-visible"
    >
      <div className="flex flex-col gap-6 p-1">
        {/* Indicador de pasos con Stepper */}
        <div className="shrink-0 px-1 mb-2">
          <Stepper steps={STEP_LABELS} currentStep={stepIndex} />
        </div>

        {/* Contenido del step activo */}
        {currentStep === "bodega" && target && (
          <StepBodega
            target={target}
            warehousesData={GetWarehouses.data}
            collaboratorsOptions={collaboratorsOptions}
            isSubmitting={CreateWarehouseAssignment.isPending}
            onSubmit={handleBodegaSubmit}
            onCancel={handleClose}
          />
        )}

        {currentStep === "cuadrilla" && (
          <StepCuadrilla
            collaboratorsOptions={collaboratorsOptions}
            isSubmitting={CreateUnloadingCrew.isPending}
            onSubmit={handleCrewSubmit}
            onBack={() => goTo("bodega")}
          />
        )}

        {currentStep === "maquinaria" && (
          <StepMaquinaria
            machineryCatalog={machineryCatalog}
            collaboratorsOptions={collaboratorsOptions}
            isSubmitting={CreateUnloadingMachinery.isPending}
            onSubmit={handleMachinerySubmit}
            onBack={() => goTo("cuadrilla")}
          />
        )}

        {currentStep === "confirmar" && target && (
          <StepConfirmar
            target={target}
            summaryData={summaryData}
            isSubmitting={CompleteAssignment.isPending}
            onConfirm={handleComplete}
            onBack={() => goTo("maquinaria")}
          />
        )}
      </div>
    </Modal>
  );
}