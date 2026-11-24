import {
  Badges,
  Breadcrumb,
  Button,
  DatePicker,
  Dropdown,
  InputText,
  Modal,
  SectionHeader,
  useTheme,
  type DatePickerValue,
} from "@alpac/design-system";
import { m, LazyMotion } from "framer-motion";
import { useState } from "react";
import {
  Calculator,
  FileText,
  HandCoins,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { LiquidacionCalculationDetails } from "./components/liquidacion-calculation-details";
import { CollaboratorSummaryCard } from "./components/collaborator-summary-card";
import { LiquidacionStepper } from "./components/liquidacion-stepper";
import { LiquidacionSummaryCards } from "./components/liquidacion-summary-cards";
import {
  CONTADOR_REVIEW_OPTIONS,
  LIQUIDACION_TYPE_OPTIONS,
  MOCK_COLLABORATOR,
  MOCK_LIQUIDACION_CALCULATION_DETAILS,
  MOCK_LIQUIDACION_CONCEPTS,
} from "./constants/liquidacion-mock.constants";
import type {
  LiquidacionCalculationDetail,
  LiquidacionConcept,
  LiquidacionType,
} from "./types/liquidacion.types";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const primaryButtonClassName =
  "w-full! min-h-[48px]! px-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!";
const secondaryButtonClassName =
  "w-full! min-h-[48px]! px-4! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!";

type RevisionContadorStatus = "pendiente" | "correcto" | "incorrecto";

const revisionBadgeConfig: Record<
  RevisionContadorStatus,
  { label: string; color: string }
> = {
  pendiente: {
    label: "Pendiente de revisión",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
  correcto: {
    label: "Cálculos correctos",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  incorrecto: {
    label: "Cálculos incorrectos",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  },
};

export function LiquidacionPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { baseUrl } = useBaseUrl();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [identification, setIdentification] = useState("");
  const [collaboratorName, setCollaboratorName] = useState("");
  const [liquidacionType, setLiquidacionType] = useState<
    LiquidacionType | ""
  >("");
  const [liquidationDate, setLiquidationDate] = useState<DatePickerValue>(null);
  const [cutoffDate, setCutoffDate] = useState<DatePickerValue>(null);
  const [lastPaidFortnightDate, setLastPaidFortnightDate] =
    useState<DatePickerValue>(null);
  const [aguinaldoStartDate, setAguinaldoStartDate] =
    useState<DatePickerValue>(null);
  const [reason, setReason] = useState("");
  const [concepts, setConcepts] = useState<LiquidacionConcept[]>([]);
  const [calculationDetails, setCalculationDetails] = useState<
    LiquidacionCalculationDetail[]
  >([]);
  const [activeStep, setActiveStep] = useState(0);
  const [revisionContador, setRevisionContador] =
    useState<RevisionContadorStatus>("pendiente");
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [isReviewEmailModalOpen, setIsReviewEmailModalOpen] = useState(false);
  const [isGenerateEmailModalOpen, setIsGenerateEmailModalOpen] =
    useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const handleCalculate = () => {
    setConcepts([...MOCK_LIQUIDACION_CONCEPTS]);
    setCalculationDetails([...MOCK_LIQUIDACION_CALCULATION_DETAILS]);
  };

  const handleOpenCloseModal = () => {
    setActiveStep(3);
    setIsCloseModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCloseModalOpen(false);
  };

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                url: `${baseUrl}/`,
                onClick: (url) => navigate(url),
              },
              {
                label: "Proceso de liquidación",
                url: `${baseUrl}/payroll/liquidacion`,
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <SectionHeader
          title="Proceso de Liquidación"
          subtitle="Gestiona la liquidación de prestaciones y conceptos finales del colaborador"
          logoImage={activeLogo}
          hasBorder
        >
          <Badges
            label="Borrador"
            color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          />
        </SectionHeader>

        <LiquidacionStepper currentStep={activeStep} />

        <SectionHeader
          title="Accesos directos"
          subtitle="Acciones disponibles dentro del proceso de liquidación"
          hasBorder
        >
          <Button
            type="button"
            size="giant"
            label="Generar liquidación"
            icon={<HandCoins size={20} />}
            onClick={() => {
              setActiveStep(1);
              setIsGenerateEmailModalOpen(true);
            }}
            className={primaryButtonClassName}
          />
          <Button
            type="button"
            size="giant"
            label="Revisado por Contador"
            icon={<FileText size={20} />}
            onClick={() => {
              setActiveStep(2);
              setIsReviewPanelOpen((open) => !open);
            }}
            className={secondaryButtonClassName}
          />
          <Button
            type="button"
            size="giant"
            label="Cerrar liquidación"
            icon={<ShieldCheck size={20} />}
            onClick={handleOpenCloseModal}
            className={secondaryButtonClassName}
          />
        </SectionHeader>

        {isReviewPanelOpen && (
          <div className="flex flex-col gap-3 rounded-lg border border-slate-600 bg-white p-4 dark:border-neutral-600 dark:bg-[#272b34] sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="m-0 p-0 text-sm font-medium text-gray-500 dark:text-gray-300">
                Resultado de la revisión contable
              </p>
              <Badges
                label={revisionBadgeConfig[revisionContador].label}
                color={revisionBadgeConfig[revisionContador].color}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Dropdown
                label="Revisión del contador"
                labelClassName={labelClassName}
                className="w-full! sm:w-80!"
                placeholder="Seleccione el resultado"
                options={CONTADOR_REVIEW_OPTIONS}
                value={revisionContador}
                onChange={(value) =>
                  setRevisionContador(value as RevisionContadorStatus)
                }
              />
              <Button
                type="button"
                size="giant"
                label="Revisar información"
                icon={<Mail size={20} />}
                disabled={revisionContador === "pendiente"}
                onClick={() => setIsReviewEmailModalOpen(true)}
                className={secondaryButtonClassName}
              />
            </div>
          </div>
        )}

        <SectionHeader
          title="Selección del colaborador"
          subtitle="Ingrese la identificación o el nombre del colaborador a liquidar"
          hasBorder
        >
          <div className="grid w-full grid-cols-2 gap-4">
            <InputText
              label="Nombre del Colaborador"
              labelClassName={labelClassName}
              className="w-full!"
              placeholder="Ej. María Elena Pérez"
              value={collaboratorName}
              onChange={(event) => setCollaboratorName(event.target.value)}
            />
            <InputText
              label="Identificación"
              labelClassName={labelClassName}
              className="w-full!"
              placeholder="000-000000-0000A"
              value={identification}
              onChange={(event) => setIdentification(event.target.value)}
            />
          </div>
          <Button
            type="button"
            size="giant"
            label="Buscar colaborador"
            icon={<Search size={20} />}
            onClick={() => setActiveStep(0)}
            className={primaryButtonClassName}
          />
        </SectionHeader>

        <CollaboratorSummaryCard collaborator={MOCK_COLLABORATOR} />

        <SectionHeader
          title="Parámetros de liquidación"
          subtitle="Defina las fechas, el tipo de liquidación y el motivo de la baja"
          hasBorder
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DatePicker
            label="Fecha de liquidación"
            labelAbove
            fieldWidth="large"
            labelClassName={labelClassName}
            className={inputClassName}
            value={liquidationDate}
            onChange={(value) => setLiquidationDate(value)}
          />
          <DatePicker
            label="Fecha de corte"
            labelAbove
            fieldWidth="large"
            labelClassName={labelClassName}
            className={inputClassName}
            value={cutoffDate}
            onChange={(value) => setCutoffDate(value)}
          />
          <DatePicker
            label="Fecha última quincena pagada"
            labelAbove
            fieldWidth="large"
            labelClassName={labelClassName}
            className={inputClassName}
            value={lastPaidFortnightDate}
            onChange={(value) => setLastPaidFortnightDate(value)}
          />
          <DatePicker
            label="Fecha de inicio de aguinaldo"
            labelAbove
            fieldWidth="large"
            labelClassName={labelClassName}
            className={inputClassName}
            value={aguinaldoStartDate}
            onChange={(value) => setAguinaldoStartDate(value)}
          />
          <Dropdown
            label="Tipo de liquidación"
            labelClassName={labelClassName}
            className={inputClassName}
            placeholder="Seleccione un tipo"
            options={LIQUIDACION_TYPE_OPTIONS}
            value={liquidacionType}
            onChange={(value) => setLiquidacionType(value as LiquidacionType)}
          />
          <InputText
            label="Motivo"
            labelClassName={labelClassName}
            className={inputClassName}
            placeholder="Detalle del motivo de la liquidación"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="giant"
            label="Calcular"
            icon={<Calculator size={20} />}
            onClick={handleCalculate}
            className={primaryButtonClassName}
          />
        </div>

        <SectionHeader
          title="Resumen de liquidación"
          subtitle="Totales calculados con los conceptos de ejemplo"
          hasBorder
        />

        <LiquidacionSummaryCards concepts={concepts} />

        <LiquidacionCalculationDetails details={calculationDetails} />

        <Modal
          isOpen={isGenerateEmailModalOpen}
          onClose={() => setIsGenerateEmailModalOpen(false)}
          variant="success"
          size="md"
          title="Correo enviado al contador"
          description="Se envió un correo al contador para que revise la nómina de la liquidación."
        >
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              size="giant"
              label="Aceptar"
              onClick={() => setIsGenerateEmailModalOpen(false)}
              className={primaryButtonClassName}
            />
          </div>
        </Modal>

        <Modal
          isOpen={isReviewEmailModalOpen}
          onClose={() => setIsReviewEmailModalOpen(false)}
          variant={revisionContador === "correcto" ? "success" : "error"}
          size="md"
          title="Revisión enviada por correo"
          description={
            revisionContador === "correcto"
              ? "Se envió un correo indicando que los cálculos de la liquidación son correctos."
              : "Se envió un correo indicando que los cálculos de la liquidación son incorrectos."
          }
        >
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              size="giant"
              label="Aceptar"
              onClick={() => setIsReviewEmailModalOpen(false)}
              className={primaryButtonClassName}
            />
          </div>
        </Modal>

        <Modal
          isOpen={isCloseModalOpen}
          onClose={handleCloseModal}
          variant="warning"
          size="md"
          title="Confirmar cierre y baja del colaborador"
          description="Esta acción simulada confirma el cierre de la liquidación y la baja del colaborador. No se guardará ni modificará información real. ¿Desea continuar?"
        >
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={handleCloseModal}
              className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
            />
            <Button
              type="button"
              size="giant"
              label="Simular cierre"
              onClick={handleCloseModal}
              className={primaryButtonClassName}
            />
          </div>
        </Modal>
      </m.div>
    </LazyMotion>
  );
}
