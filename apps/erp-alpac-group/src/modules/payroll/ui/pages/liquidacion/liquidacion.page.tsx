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
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { CollaboratorSummaryCard } from "./components/collaborator-summary-card";
import { LiquidacionConceptsTable } from "./components/liquidacion-concepts-table";
import { LiquidacionStepper } from "./components/liquidacion-stepper";
import { LiquidacionSummaryCards } from "./components/liquidacion-summary-cards";
import {
  LIQUIDACION_TYPE_OPTIONS,
  MOCK_COLLABORATOR,
  MOCK_LIQUIDACION_CONCEPTS,
} from "./constants/liquidacion-mock.constants";
import type {
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

export function LiquidacionPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { baseUrl } = useBaseUrl();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [identification, setIdentification] = useState("");
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
  const [activeStep, setActiveStep] = useState(0);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const handleCalculate = () => {
    setConcepts([...MOCK_LIQUIDACION_CONCEPTS]);
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
            onClick={() => setActiveStep(1)}
            className={primaryButtonClassName}
          />
          <Button
            type="button"
            size="giant"
            label="Revisar conceptos"
            icon={<FileText size={20} />}
            onClick={() => setActiveStep(2)}
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

        <SectionHeader
          title="Selección del colaborador"
          subtitle="Ingrese la identificación del colaborador a liquidar"
          hasBorder
        >
          <InputText
            label="Identificación"
            labelClassName={labelClassName}
            className="w-full! sm:w-80!"
            placeholder="000-000000-0000A"
            value={identification}
            onChange={(event) => setIdentification(event.target.value)}
          />
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

        <LiquidacionConceptsTable concepts={concepts} />

        <Modal
          isOpen={isCloseModalOpen}
          onClose={handleCloseModal}
          variant="warning"
          size="md"
          title="Confirmación de cierre"
          description="Esta es una vista de ejemplo: la liquidación no será cerrada ni guardada. ¿Desea continuar con la simulación?"
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
