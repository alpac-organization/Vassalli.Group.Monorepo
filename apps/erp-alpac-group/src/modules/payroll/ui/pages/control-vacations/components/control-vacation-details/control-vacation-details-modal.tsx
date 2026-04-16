import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { PermitTypeBadge } from "@app/modules/payroll/ui/pages/control-vacations/utils/vacations.mapper";
import {
  dashOrText,
  EM_DASH,
  formatDateOrDash,
  formatTimeOrDash,
} from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/utils/validate.details-content";
import type { ControlVacationDetailsModalProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/type/vacation-details.type";
import { useUserStore } from "@app/shared/stores/useUserStore";

const FIELD_GRID =
  "grid min-w-0 grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-y-4";

function mapRecipientProfile(
  data: GetCollaboratorProfileDetailsResponse | undefined,
): {
  fullName: string;
  workPosition: string;
  workArea: string;
  email: string;
  phone: string;
} {
  if (!data) {
    return {
      fullName: EM_DASH,
      workPosition: EM_DASH,
      workArea: EM_DASH,
      email: EM_DASH,
      phone: EM_DASH,
    };
  }
  return {
    fullName: dashOrText(data.full_name),
    workPosition: dashOrText(
      data.work_position ?? data.working_information?.work_position,
    ),
    workArea: dashOrText(data.working_information?.work_area),
    email: dashOrText(data.personal_information?.personal_email),
    phone: dashOrText(data.personal_information?.personal_phone_number),
  };
}

function RecipientCollaboratorSection({
  profileQuery,
  shouldFetch,
}: {
  profileQuery: UseQueryResult<GetCollaboratorProfileDetailsResponse, Error>;
  shouldFetch: boolean;
}) {
  const { data, isPending, isError, isFetching } = profileQuery;

  if (!shouldFetch) {
    const empty = mapRecipientProfile(undefined);
    return (
      <RecipientCollaboratorFields values={empty} />
    );
  }

  const showLoading = isPending || isFetching;

  if (showLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3 dark:border-neutral-600 dark:bg-neutral-800/40">
        <p className="m-0 text-[13px] text-slate-500 dark:text-slate-400">
          Cargando información del colaborador…
        </p>
      </div>
    );
  }

  const values = isError ? mapRecipientProfile(undefined) : mapRecipientProfile(data);
  return <RecipientCollaboratorFields values={values} />;
}

function RecipientCollaboratorFields({
  values,
}: {
  values: ReturnType<typeof mapRecipientProfile>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-4 dark:border-neutral-600 dark:bg-neutral-800/40">
      <p className="mb-3 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
        Información del colaborador a recibir
      </p>
      <div className={FIELD_GRID}>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Nombre completo
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {values.fullName}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Puesto de trabajo
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {values.workPosition}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Área de trabajo
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {values.workArea}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Correo personal
          </p>
          <p className="mt-1 wrap-break-word text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {values.email}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Teléfono personal
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {values.phone}
          </p>
        </div>
      </div>
    </div>
  );
}

function DonatedVacationDetails({
  item,
  profileQuery,
  shouldFetchRecipientProfile,
}: {
  item: VacationControlItemResponse;
  profileQuery: UseQueryResult<GetCollaboratorProfileDetailsResponse, Error>;
  shouldFetchRecipientProfile: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className={FIELD_GRID}>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Puesto de trabajo
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {dashOrText(item.work_position)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Aprobado por
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {dashOrText(item.approved_by)}
          </p>
        </div>
      </div>

      <RecipientCollaboratorSection
        profileQuery={profileQuery}
        shouldFetch={shouldFetchRecipientProfile}
      />

      <div className="min-w-0">
        <p className="mb-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
          Descripción
        </p>
        <div className="rounded-md text-[14px] leading-relaxed text-slate-900 dark:text-white">
          {dashOrText(item.description)}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 dark:border-neutral-600">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">Registrado el:</span>{" "}
          {formatDateOrDash(item.created_at)}
        </p>
      </div>
    </div>
  );
}

function StandardVacationDetails({ item }: { item: VacationControlItemResponse }) {
  const days = item.amount_days == null || Number.isNaN(item.amount_days) ? "—" : item.amount_days;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className={FIELD_GRID}>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Fecha de inicio
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {formatDateOrDash(item.start_date)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Fecha de fin
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {formatDateOrDash(item.end_date)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Días de vacaciones
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              typeof item.amount_days === "number" && item.amount_days > 0
                ? "text-slate-900 dark:text-white"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {days}
          </p>
        </div>
      </div>

      <div className={FIELD_GRID}>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Puesto de trabajo
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {dashOrText(item.work_position)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Aprobado por
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {dashOrText(item.approved_by)}
          </p>
        </div>
      </div>

      <div className={FIELD_GRID}>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Hora de inicio
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {formatTimeOrDash(item.start_time)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Hora de fin
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {formatTimeOrDash(item.end_time)}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
          Descripción
        </p>
        <div className="rounded-md text-[14px] leading-relaxed text-slate-900 dark:text-white">
          {dashOrText(item.description)}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 dark:border-neutral-600">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">Registrado el:</span>{" "}
          {formatDateOrDash(item.created_at)}
        </p>
      </div>
    </div>
  );
}

function DetailsBody({
  item,
  profileQuery,
  shouldFetchRecipientProfile,
}: {
  item: VacationControlItemResponse;
  profileQuery: UseQueryResult<GetCollaboratorProfileDetailsResponse, Error>;
  shouldFetchRecipientProfile: boolean;
}) {
  const isDonated = item.permit_application_type === "DonatedVacations";

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mt-1.5 wrap-break-word text-[13px] text-white">
            <span className="font-medium text-slate-500 dark:text-slate-400 ">ID de solicitud:</span>{" "}
             {dashOrText(item.permit_application_id)}
          </p>
          <p className="mt-0.5 text-[13px] text-white  ">
            <span className="font-medium text-slate-500 dark:text-slate-400">Codigo de Colaborador:</span>{" "}
             {dashOrText(item.collaborator_code)}
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          <PermitTypeBadge type={item.permit_application_type} />
        </div>
      </div>

      {isDonated ? (
        <DonatedVacationDetails
          item={item}
          profileQuery={profileQuery}
          shouldFetchRecipientProfile={shouldFetchRecipientProfile}
        />
      ) : (
        <StandardVacationDetails item={item} />
      )}
    </div>
  );
}

export function ControlVacationDetailsModal({
  isOpen,
  onClose,
  item,
}: ControlVacationDetailsModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const recipientIdentificationClean = useMemo(() => {
    const raw = item?.identification_collaborator_to_receive?.trim() ?? "";
    if (!raw) return "";
    return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }, [item?.identification_collaborator_to_receive]);

  const collaboratorDetailsPayload = useMemo<CollaboratorProfileDetailsRequest>(
    () => ({
      company_id: companyId ?? "",
      module_code: moduleCode ?? "",
      identification_number: recipientIdentificationClean,
      QueryEnabled:
        Boolean(isOpen) &&
        item?.permit_application_type === "DonatedVacations" &&
        Boolean(recipientIdentificationClean) &&
        Boolean(companyId?.trim()) &&
        Boolean(moduleCode?.trim()),
    }),
    [
      isOpen,
      item?.permit_application_type,
      recipientIdentificationClean,
      companyId,
      moduleCode,
    ],
  );

  const { GetProfileDetails } = useCollaborators({
    CollaboratorDetailsPayload: collaboratorDetailsPayload,
  });

  const shouldFetchRecipientProfile = Boolean(
    collaboratorDetailsPayload.QueryEnabled,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la Vacación"
      panelClassName="!max-w-2xl w-full min-w-0 overflow-x-hidden !mx-4 !my-4 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !px-5 !py-5 sm:!p-6"
    >
      {item ? (
        <DetailsBody
          item={item}
          profileQuery={GetProfileDetails}
          shouldFetchRecipientProfile={shouldFetchRecipientProfile}
        />
      ) : null}
    </Modal>
  );
}
