import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./utils/employee-receivables.styles";

export interface EmployeeReceivableItem {
  codigo: string;
  nombre: string;
  cargo: string;
  monto: number;
  monedaOriginal: string;
  noCuotasQuincenal: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  dolares: {
    cuotasPagadas: number;
    montoCuotas: number;
    cuotasPendientes: number;
  };
  cordobas: {
    cuotasPagadas: number;
    montoCuotas: number;
    cuotasPendientes: number;
  };
}

interface EmployeeReceivablesPdfDocumentProps {
  data: EmployeeReceivableItem[];
  companyName: string;
  preparedBy?: {
    name: string;
    role?: string;
  };
  preparedSignatureImageSrc?: string;
  logoUrl?: string;
}

export const EmployeeReceivablesPdfDocument: React.FC<
  EmployeeReceivablesPdfDocumentProps
> = ({
  data,
  companyName,
  preparedBy,
  preparedSignatureImageSrc,
  logoUrl,
}) => {
  const formatNumber = (value: number) => {
    if (!value || value === 0) return "";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalDolaresCuotasPagadas = data.reduce(
    (sum, item) => sum + (item.dolares.cuotasPagadas || 0),
    0,
  );
  const totalDolaresMontoCuotas = data.reduce(
    (sum, item) => sum + (item.dolares.montoCuotas || 0),
    0,
  );
  const totalDolaresCuotasPendientes = data.reduce(
    (sum, item) => sum + (item.dolares.cuotasPendientes || 0),
    0,
  );

  const totalCordobasCuotasPagadas = data.reduce(
    (sum, item) => sum + (item.cordobas.cuotasPagadas || 0),
    0,
  );
  const totalCordobasMontoCuotas = data.reduce(
    (sum, item) => sum + (item.cordobas.montoCuotas || 0),
    0,
  );
  const totalCordobasCuotasPendientes = data.reduce(
    (sum, item) => sum + (item.cordobas.cuotasPendientes || 0),
    0,
  );

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer}>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>{companyName}</Text>
            <Text style={styles.title}>Saldos por Cobrar a Empleados</Text>
          </View>
        </View>

        <View style={styles.headerGroupRow}>
          <View style={styles.colEmptyGroup}></View>
          <View style={styles.colGroupDolares}>
            <Text style={styles.cellHeader}>DOLARES</Text>
          </View>
          <View style={styles.colGroupCordobas}>
            <Text style={styles.cellHeader}>CORDOBAS</Text>
          </View>
        </View>

        <View style={styles.tableHeaderRow}>
          <View style={styles.colCode}>
            <Text style={styles.cellHeader}>Codigo</Text>
          </View>
          <View style={styles.colLarge}>
            <Text style={styles.cellHeader}>Nombre del Empleado</Text>
          </View>
          <View style={styles.colLarge}>
            <Text style={styles.cellHeader}>Cargo</Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Monto</Text>
          </View>
          <View style={styles.colSmall}>
            <Text style={styles.cellHeader}>Moneda Original</Text>
          </View>
          <View style={styles.colSmall}>
            <Text style={styles.cellHeader}>No Cuotas Quincenal</Text>
          </View>
          <View style={styles.colSmall}>
            <Text style={styles.cellHeader}>Cuotas Pagadas</Text>
          </View>
          <View style={styles.colSmall}>
            <Text style={styles.cellHeader}>Cuotas Pendientes</Text>
          </View>

          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Cuotas Pagadas</Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Monto Cuotas</Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Cuotas Pendientes</Text>
          </View>

          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Cuotas Pagadas</Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Monto Cuotas</Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.cellHeader}>Cuotas Pendientes</Text>
          </View>
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.colCode}>
              <Text style={styles.cellCenter}>{item.codigo}</Text>
            </View>
            <View style={styles.colLarge}>
              <Text style={styles.cellLeft}>{item.nombre}</Text>
            </View>
            <View style={styles.colLarge}>
              <Text style={styles.cellLeft}>{item.cargo}</Text>
            </View>
            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>{formatNumber(item.monto)}</Text>
            </View>
            <View style={styles.colSmall}>
              <Text style={styles.cellCenter}>{item.monedaOriginal}</Text>
            </View>
            <View style={styles.colSmall}>
              <Text style={styles.cellCenter}>{item.noCuotasQuincenal}</Text>
            </View>
            <View style={styles.colSmall}>
              <Text style={styles.cellCenter}>{item.cuotasPagadas}</Text>
            </View>
            <View style={styles.colSmall}>
              <Text style={styles.cellCenter}>{item.cuotasPendientes}</Text>
            </View>

            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.dolares.cuotasPagadas)}
              </Text>
            </View>
            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.dolares.montoCuotas)}
              </Text>
            </View>
            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.dolares.cuotasPendientes)}
              </Text>
            </View>

            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.cordobas.cuotasPagadas)}
              </Text>
            </View>
            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.cordobas.montoCuotas)}
              </Text>
            </View>
            <View style={styles.colMedium}>
              <Text style={styles.cellRight}>
                {formatNumber(item.cordobas.cuotasPendientes)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.globalTotalRow}>
          <View style={styles.colEmptyGroup}>
            <Text style={[styles.cellHeader, { textAlign: "left" }]}>
              Totales
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalDolaresCuotasPagadas)}
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalDolaresMontoCuotas)}
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalDolaresCuotasPendientes)}
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalCordobasCuotasPagadas)}
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalCordobasMontoCuotas)}
            </Text>
          </View>
          <View style={styles.colMedium}>
            <Text style={styles.globalTotalCellRight}>
              {formatNumber(totalCordobasCuotasPendientes)}
            </Text>
          </View>
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            {preparedSignatureImageSrc && (
              <Image
                src={preparedSignatureImageSrc}
                style={styles.signatureImage}
              />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              Elaborado por : {preparedBy?.name || "Lic Aracelly Guillen"}
            </Text>
            <Text style={styles.signatureRole}>
              {preparedBy?.role || "Responsable de Talento Humano"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
