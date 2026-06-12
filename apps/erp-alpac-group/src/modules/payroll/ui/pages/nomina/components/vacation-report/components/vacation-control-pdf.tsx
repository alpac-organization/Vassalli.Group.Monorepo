import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/utils/styles.accumulated";
import type { VacationControlPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-control.types";
import {
  formatBalanceValue,
  formatPermissionPeriod,
  formatPermissionStartTime,
  formatPermissionEndTime,
  formatPermissionDaysForTable,
  formatPermissionType,
  formatPermissionStatus,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control.utils";

function CollaboratorPage({
  page,
  startDate,
  endDate,
  companyName,
  urlImage,
}: {
  page: VacationControlPdfProps["pages"][number];
  startDate?: string;
  endDate?: string;
  companyName: string;
  urlImage?: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View
        style={{
          position: "relative" as const,
          width: "100%",
          minHeight: 52,
          justifyContent: "center" as const,
          marginBottom: 8,
        }}
      >
        {urlImage ? (
          <Image
            src={urlImage}
            style={{
              position: "absolute" as const,
              left: 0,
              top: 0,
              width: 52,
              height: 52,
              objectFit: "contain" as const,
            }}
          />
        ) : null}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold" as const,
            textAlign: "center" as const,
            width: "100%",
          }}
        >
          {companyName}
        </Text>
      </View>

      <Text style={styles.subtitle}>Control de Vacaciones</Text>
      <Text style={styles.period}>
        Período: {formatDateToSpanishWords(startDate?.trim() ?? "—")} al{" "}
        {formatDateToSpanishWords(endDate?.trim() ?? "—")}
      </Text>
      <Text
        style={{
          textAlign: "center" as const,
          fontSize: 11,
          marginBottom: 14,
        }}
      >
        Colaborador: {page.collaborator_fullname} ({page.collaborator_code})
      </Text>

      <Text
        style={{
          fontSize: 11,
          fontWeight: "bold" as const,
          marginBottom: 6,
        }}
      >
        Saldos de vacaciones
      </Text>
      <View style={[styles.tableRow, styles.headerRow]} wrap={false}>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "50%" }]}>
          Saldo Inicial
        </Text>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "50%" }]}>
          Saldo Final
        </Text>
      </View>
      <View style={[styles.tableRow, styles.bodyRow]} wrap={false}>
        <Text style={[styles.cellAmount, { width: "50%" }]}>
          {formatBalanceValue(page.beginning_balance)}
        </Text>
        <Text style={[styles.cellAmount, { width: "50%" }]}>
          {formatBalanceValue(page.final_balance)}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 11,
          fontWeight: "bold" as const,
          marginTop: 20,
          marginBottom: 6,
        }}
      >
        Permisos
      </Text>
      <View style={[styles.tableRow, styles.headerRow]} wrap={false}>
        <Text style={[styles.cellCode, styles.headerCell, { width: "18%" }]}>
          Tipo
        </Text>
        <Text style={[styles.cellName, styles.headerCell, { width: "26%" }]}>
          Fecha de Permiso
        </Text>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "12%" }]}>
          Hora inicio
        </Text>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "12%" }]}>
          Hora fin
        </Text>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "14%" }]}>
          Días
        </Text>
        <Text style={[styles.cellAmount, styles.headerCell, { width: "18%" }]}>
          Estado
        </Text>
      </View>
      {page.permissions.length === 0 ? (
        <View style={[styles.tableRow, styles.bodyRow]} wrap={false}>
          <Text style={[styles.cellName, { width: "100%" }]}>
            Sin permisos registrados
          </Text>
        </View>
      ) : (
        page.permissions.map((permission) => (
          <View
            style={[styles.tableRow, styles.bodyRow]}
            key={permission.permit_apllication_id}
            wrap={false}
          >
            <Text style={[styles.cellCode, { width: "18%" }]}>
              {formatPermissionType(permission.type)}
            </Text>
            <Text style={[styles.cellName, { width: "26%" }]}>
              {formatPermissionPeriod(
                permission.start_date,
                permission.end_date,
              )}
            </Text>
            <Text style={[styles.cellAmount, { width: "12%" }]}>
              {formatPermissionStartTime(permission)}
            </Text>
            <Text style={[styles.cellAmount, { width: "12%" }]}>
              {formatPermissionEndTime(permission)}
            </Text>
            <Text style={[styles.cellAmount, { width: "14%" }]}>
              {formatPermissionDaysForTable(permission)}
            </Text>
            <Text style={[styles.cellAmount, { width: "18%" }]}>
              {formatPermissionStatus(permission.status)}
            </Text>
          </View>
        ))
      )}
    </Page>
  );
}

export function VacationControlPdfDocument({
  pages,
  startDate,
  endDate,
}: VacationControlPdfProps) {
  const companyName = useUserStore.getState().companyName || "Vasalli Group";
  const { urlImage } = useCompanyStore();

  return (
    <Document>
      {pages.map((page, index) => (
        <CollaboratorPage
          key={`${page.collaborator_code}-${index}`}
          page={page}
          startDate={startDate}
          endDate={endDate}
          companyName={companyName}
          urlImage={urlImage || undefined}
        />
      ))}
    </Document>
  );
}
