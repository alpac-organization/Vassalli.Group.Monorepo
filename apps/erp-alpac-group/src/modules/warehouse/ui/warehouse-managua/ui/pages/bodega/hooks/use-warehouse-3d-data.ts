import { useMemo } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { RackService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/RackService";
import { LotService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/LotService";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type {
  RackPositionDetailDto,
  GetRackDetailsResponse,
} from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-rack-details-res";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import {
  getEffectiveRackStatus,
  resolveRackStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { resolveSectionStorageType } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";

const rackService = new RackService(warehouseHttpHandler);
const lotService = new LotService(warehouseHttpHandler);

function isRackStorageType(value: string | number | null | undefined): boolean {
  if (value == null || value === "") return false;
  const resolved = resolveSectionStorageType(value);
  if (resolved) {
    return resolved.textValue === SectionStorageTypeEnum.Racks.textValue;
  }
  const str = String(value).toLowerCase();
  return str === "racks" || str === "rack" || str === "1";
}

function isLotStorageType(value: string | number | null | undefined): boolean {
  if (value == null || value === "") return false;
  const resolved = resolveSectionStorageType(value);
  if (resolved) {
    return (
      resolved.textValue === SectionStorageTypeEnum.Lots.textValue ||
      resolved.textValue === SectionStorageTypeEnum.Pallets.textValue
    );
  }
  const str = String(value).toLowerCase();
  return (
    str === "lots" ||
    str === "lot" ||
    str === "tramos" ||
    str === "tramo" ||
    str === "pallets" ||
    str === "polines" ||
    str === "2" ||
    str === "3"
  );
}

export interface ProcessedSection3D {
  sectionId: string;
  code: string;
  color: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  raw: SectionDto;
}

export interface ProcessedRackLevel3D {
  levelNumber: number;
  height: number;
  rackId: string;
  code: string;
  status: string;
  occupiedPositions: number;
  totalPositions: number;
  availablePositions?: number;
  maxPulleys?: number;
  positions?: RackPositionDetailDto[];
  raw: RackDto;
}

export interface ProcessedRack3D {
  rackId: string;
  sectionId: string;
  sectionCode: string;
  code: string;
  rowNumber: number;
  levelNumber: number;
  maxPulleys: number;
  status: string;
  usageProfile: string;
  // Dimensiones 3D renderizadas
  renderWidth: number; // en eje X
  renderDepth: number; // en eje Z
  renderHeight: number; // en eje Y
  tierHeight: number; // altura de separación entre niveles
  // Coordenadas globales Three.js (centro del rack)
  cx: number;
  cy: number;
  cz: number;
  // Rotación en radianes
  rotationY: number;
  isRotated90: boolean;
  aisleSide?: number;
  // Niveles
  levels: ProcessedRackLevel3D[];
  occupiedPositions: number;
  totalPositions: number;
  availablePositions: number;
  raw: RackDto;
}

export interface ProcessedTramo3D {
  tramoId: string;
  sectionId: string;
  sectionCode: string;
  code: string;
  status: string | number | null;
  allowsStacking: boolean;
  width: number; // renderWidth en X
  length: number; // renderDepth en Z
  height: number;
  // Coordenadas globales Three.js (centro del tramo en el suelo)
  cx: number;
  cy: number;
  cz: number;
  rotationY: number;
  isRotated90: boolean;
  area: number;
  raw: LotDto;
}

export interface BuildingDimensions3D {
  width: number;
  depth: number;
  height: number;
}

const SECTION_COLORS = [
  "#2563EB", // Azul
  "#059669", // Verde
  "#D97706", // Ámbar
  "#7C3AED", // Violeta
  "#DB2777", // Rosa
  "#0891B2", // Cian
  "#EA580C", // Naranja
];

export function useWarehouse3DData(warehouseId: string | null) {
  const { companyId, moduleCode } = useUserStore();

  // 1. Obtener detalles del almacén seleccionado
  const { GetWarehouseDetails } = useWarehouse({
    getWarehouseDetailsPayload:
      warehouseId && companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            warehouse_id: warehouseId,
          }
        : undefined,
  });

  // 2. Obtener las secciones del almacén
  const { GetSections } = useSection({
    getSectionsPayload:
      companyId && moduleCode && warehouseId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            warehouse_id: warehouseId,
            page_number: 1,
            page_size: 10,
            is_active: true,
          }
        : undefined,
  });

  const sectionsList: SectionDto[] = useMemo(
    () => GetSections.data?.data ?? [],
    [GetSections.data?.data],
  );

  // 3. Consultar los racks ÚNICAMENTE en secciones de almacenamiento de Racks
  const rackQueries = useQueries({
    queries: sectionsList.map((section) => {
      const isRackSection =
        section.section_storage_type == null
          ? true
          : isRackStorageType(section.section_storage_type);

      return {
        queryKey: [
          "warehouse-3d-racks",
          companyId,
          moduleCode,
          warehouseId,
          section.section_id,
        ],
        queryFn: () =>
          rackService.GetRacksBySection({
            company_id: companyId!,
            module_code: moduleCode!,
            warehouse_id: warehouseId!,
            section_id: section.section_id,
            page_number: 1,
            page_size: 100,
          }),
        enabled: Boolean(
          companyId &&
            moduleCode &&
            warehouseId &&
            section.section_id &&
            isRackSection,
        ),
        refetchOnWindowFocus: false,
        staleTime: 60_000,
      };
    }),
  });

  // 4. Consultar los tramos (Lots) ÚNICAMENTE en secciones de almacenamiento de Tramos/Lots
  const lotQueries = useQueries({
    queries: sectionsList.map((section) => {
      const isLotSection =
        section.section_storage_type == null
          ? true
          : isLotStorageType(section.section_storage_type);

      return {
        queryKey: [
          "warehouse-3d-lots",
          companyId,
          moduleCode,
          warehouseId,
          section.section_id,
        ],
        queryFn: () =>
          lotService.GetLots({
            company_id: companyId!,
            module_code: moduleCode!,
            warehouse_id: warehouseId!,
            section_id: section.section_id,
            page_number: 1,
            page_size: 100,
          }),
        enabled: Boolean(
          companyId &&
            moduleCode &&
            warehouseId &&
            section.section_id &&
            isLotSection,
        ),
        refetchOnWindowFocus: false,
        staleTime: 60_000,
      };
    }),
  });

  // 4b. Consultar detalles de racks ÚNICAMENTE bajo demanda (cuando un rack es enfocado/seleccionado)
  const queryClient = useQueryClient();
  const focusedRack = useBodegaViewerStore((s) => s.focusedRack);
  const focusedSectionId = focusedRack?.sectionId;
  const focusedLevels = focusedRack?.levels;

  const focusedRackQueries = useQueries({
    queries: (focusedLevels ?? []).map((lvl) => ({
      queryKey: [
        "rack-level-details",
        companyId,
        moduleCode,
        warehouseId,
        focusedSectionId,
        lvl.rackId,
      ],
      queryFn: () =>
        rackService.GetRackDetails({
          company_id: companyId!,
          module_code: moduleCode!,
          warehouse_id: warehouseId!,
          section_id: focusedSectionId!,
          rack_id: lvl.rackId,
        }),
      enabled: Boolean(
        companyId &&
          moduleCode &&
          warehouseId &&
          focusedSectionId &&
          lvl.rackId,
      ),
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    })),
  });

  const rackDetailsMap = useMemo(() => {
    const map = new Map<string, GetRackDetailsResponse>();
    focusedRackQueries.forEach((q) => {
      if (q.data?.rack_id) {
        map.set(q.data.rack_id, q.data);
      }
    });
    return map;
  }, [focusedRackQueries]);

  // 5. Procesar dimensiones del edificio (Warehouse building)
  const building: BuildingDimensions3D = useMemo(() => {
    const cap = GetWarehouseDetails.data?.capacity;
    const w = Number(cap?.width) || 0;
    const l = Number(cap?.length) || 0;
    const h = Number(cap?.maximum_height) || Number(cap?.minimum_height) || 0;

    // Si la BD tiene dimensiones reales, usarlas
    if (w > 0 && l > 0) {
      return {
        width: w,
        depth: l,
        height: h > 0 ? h : 8,
      };
    }

    // Si no, calcular en base a las secciones
    let maxSectionX = 20;
    let maxSectionZ = 30;

    sectionsList.forEach((s) => {
      const sx = (s.position_x ?? 0) + (s.width ?? 10);
      const sz = (s.position_y ?? 0) + (s.length ?? 10);
      if (sx > maxSectionX) maxSectionX = sx;
      if (sz > maxSectionZ) maxSectionZ = sz;
    });

    return {
      width: Math.max(maxSectionX + 5, 25),
      depth: Math.max(maxSectionZ + 5, 35),
      height: h > 0 ? h : 8,
    };
  }, [GetWarehouseDetails.data?.capacity, sectionsList]);

  // 6. Procesar Secciones
  const processedSections: ProcessedSection3D[] = useMemo(() => {
    return sectionsList.map((sec, idx) => {
      const width = Number(sec.width) || 8;
      const depth = Number(sec.length) || 12;
      const x = Number(sec.position_x) || 0;
      const z = Number(sec.position_y) || 0;
      const height = 0.05;
      const color =
        SECTION_COLORS[idx % SECTION_COLORS.length] || "#2563EB";

      return {
        sectionId: sec.section_id,
        code: sec.section_code || `SEC-${idx + 1}`,
        color,
        x,
        z,
        width,
        depth,
        height,
        raw: sec,
      };
    });
  }, [sectionsList]);

  // 7. Procesar Racks
  const processedRacks: ProcessedRack3D[] = useMemo(() => {
    const racks: ProcessedRack3D[] = [];

    sectionsList.forEach((sec, sIdx) => {
      const sectionQuery = rackQueries[sIdx];
      const sectionRacks: RackDto[] = sectionQuery?.data?.data ?? [];
      const secX = Number(sec.position_x) || 0;
      const secZ = Number(sec.position_y) || 0;
      const secCode = sec.section_code || `SEC-${sIdx + 1}`;

      // Agrupar registros de racks que pertenecen a la misma bahía física
      const bayGroups = new Map<string, RackDto[]>();

      sectionRacks.forEach((rack) => {
        const posX = Math.round((Number(rack.position_x) || 0) * 100);
        const posY = Math.round((Number(rack.position_y) || 0) * 100);
        const key = `${sec.section_id}__${posX}_${posY}`;

        if (!bayGroups.has(key)) {
          bayGroups.set(key, []);
        }
        bayGroups.get(key)!.push(rack);
      });

      bayGroups.forEach((bayRacks) => {
        bayRacks.sort((a, b) => {
          const lA = Number(a.level_number) || 0;
          const lB = Number(b.level_number) || 0;
          if (lA !== lB) return lA - lB;
          return (a.code || "").localeCompare(b.code || "");
        });
        const baseRack = bayRacks[0];

        const rotY = Number(baseRack.rotation_y) || 0;
        const radY = (rotY * Math.PI) / 180;
        const isRotated90 =
          Math.abs(rotY - 90) < 0.1 || Math.abs(rotY - 270) < 0.1;

        const rawWidth = Number(baseRack.width) || 1.1;
        const rawLength = Number(baseRack.length) || 2.5;
        const rawHeight = Number(baseRack.height) || 1.6;

        const numPhysicalLevels = Math.max(bayRacks.length, 1);

        // Si rawHeight <= 2.5m, representa la altura de separación de cada nivel útil (ej. 1.52m o 1.60m)
        // Si es mayor a 2.5m, representa la altura total de la columna metálica (ej. 4.50m o 5.00m)
        const tierHeight =
          rawHeight <= 2.5
            ? Math.max(rawHeight, 1.4)
            : rawHeight / (numPhysicalLevels + 1);

        // Altura total de los bastidores azules (incluyendo esperas superiores)
        const renderHeight =
          rawHeight <= 2.5
            ? tierHeight * (numPhysicalLevels + 0.8)
            : rawHeight;

        const renderWidth = isRotated90 ? rawWidth : rawLength;
        const renderDepth = isRotated90 ? rawLength : rawWidth;

        const localX = Number(baseRack.position_x) || 0;
        const localZ = Number(baseRack.position_y) || 0;
        const localY = Number(baseRack.position_z) || 0;

        const globalOriginX = secX + localX;
        const globalOriginZ = secZ + localZ;

        const cx = globalOriginX + renderWidth / 2;
        const cz = globalOriginZ + renderDepth / 2;
        // Base del rack a nivel de piso (0), sin flotar sobre el suelo ni sobre los tramos
        const cy = localY;

        let totalOccupied = 0;
        let totalPositions = 0;

        const levels: ProcessedRackLevel3D[] = bayRacks.map((tierRack, tierIdx) => {
          const cachedDetail = queryClient.getQueryData<GetRackDetailsResponse>([
            "rack-level-details",
            companyId,
            moduleCode,
            warehouseId,
            sec.section_id,
            tierRack.rack_id,
          ]);
          const detail = rackDetailsMap.get(tierRack.rack_id) ?? cachedDetail;
          const detailPositions = detail?.positions
            ? [...detail.positions].sort((a, b) => (a.column ?? 0) - (b.column ?? 0))
            : [];

          const occFromDetail = detailPositions.filter(
            (p) =>
              resolveRackStatus(p.status)?.textValue === "Occupied" ||
              Boolean(p.current_stock?.product_name),
          ).length;

          const occ =
            detailPositions.length > 0
              ? occFromDetail
              : Number(tierRack.occupied_positions) || 0;

          const tot =
            detailPositions.length > 0
              ? detailPositions.length
              : Number(tierRack.total_positions) || Number(tierRack.max_pulleys) || 2;

          const maxP = Number(tierRack.max_pulleys) || tot;
          const avail =
            tierRack.available_positions != null
              ? Number(tierRack.available_positions)
              : Math.max(tot - occ, 0);

          totalOccupied += occ;
          totalPositions += tot;

          const effective = getEffectiveRackStatus(
            detail?.status || tierRack.status,
            occ,
            detailPositions,
          );

          return {
            levelNumber: tierIdx + 1,
            height: tierHeight * (tierIdx + 1),
            rackId: tierRack.rack_id,
            code: tierRack.code || `${baseRack.code}-N${tierIdx + 1}`,
            status: effective.statusKey,
            occupiedPositions: occ,
            totalPositions: tot,
            availablePositions: avail,
            maxPulleys: maxP,
            positions: detailPositions,
            raw: tierRack,
          };
        });

        const totalAvailable = Math.max(totalPositions - totalOccupied, 0);

        const bayEffective = getEffectiveRackStatus(
          baseRack.status,
          totalOccupied,
          levels.flatMap((l) => l.positions ?? []),
        );

        const codeNumMatch = secCode.match(/\d+/);
        const sectionNum = codeNumMatch ? parseInt(codeNumMatch[0], 10) : sIdx + 1;
        // Baterías espalda con espalda: SR-01 (-1 hacia su pasillo), SR-02 (+1 hacia su pasillo)
        let aisleSide = sectionNum % 2 === 1 ? -1 : 1;
        if (Math.abs(rotY - 180) < 15 || Math.abs(rotY - 270) < 15) {
          aisleSide = -aisleSide;
        }

        racks.push({
          rackId: baseRack.rack_id,
          sectionId: sec.section_id,
          sectionCode: secCode,
          code: baseRack.code || "RACK",
          rowNumber: Number(baseRack.row_number) || 1,
          levelNumber: numPhysicalLevels,
          maxPulleys: Number(baseRack.max_pulleys) || 4,
          status: bayEffective.statusKey,
          usageProfile: String(baseRack.usage_profile || "heavy"),
          renderWidth,
          renderDepth,
          renderHeight,
          tierHeight,
          cx,
          cy,
          cz,
          rotationY: radY,
          isRotated90,
          aisleSide,
          levels,
          occupiedPositions: totalOccupied,
          totalPositions,
          availablePositions: totalAvailable,
          raw: baseRack,
        });
      });
    });

    return racks;
  }, [
    sectionsList,
    rackQueries,
    rackDetailsMap,
    queryClient,
    companyId,
    moduleCode,
    warehouseId,
  ]);

  // 8. Procesar Tramos (Lots) en el suelo
  const processedTramos: ProcessedTramo3D[] = useMemo(() => {
    const tramos: ProcessedTramo3D[] = [];

    sectionsList.forEach((sec, sIdx) => {
      const lotQuery = lotQueries[sIdx];
      const sectionLots: LotDto[] = lotQuery?.data?.data ?? [];
      const secX = Number(sec.position_x) || 0;
      const secZ = Number(sec.position_y) || 0;
      const secCode = sec.section_code || `SEC-${sIdx + 1}`;

      sectionLots.forEach((lot) => {
        const localX = Number(lot.position_x) || 0;
        const localZ = Number(lot.position_y) || 0;
        const rotY = Number(lot.rotation_y) || 0;
        const radY = (rotY * Math.PI) / 180;
        const isRotated90 =
          Math.abs(rotY - 90) < 0.1 || Math.abs(rotY - 270) < 0.1;

        const rawW = Number(lot.width) || 2.5;
        const rawL = Number(lot.length) || 1.2;

        const renderWidth = isRotated90 ? rawL : rawW;
        const renderDepth = isRotated90 ? rawW : rawL;

        const cx = secX + localX + renderWidth / 2;
        const cz = secZ + localZ + renderDepth / 2;
        const cy = 0.025;

        tramos.push({
          tramoId: lot.id,
          sectionId: sec.section_id,
          sectionCode: secCode,
          code: lot.code || "TRAMO",
          status: lot.status,
          allowsStacking: Boolean(lot.allows_stacking),
          width: renderWidth,
          length: renderDepth,
          height: 0.1,
          cx,
          cy,
          cz,
          rotationY: radY,
          isRotated90,
          area: Number(lot.area) || renderWidth * renderDepth,
          raw: lot,
        });
      });
    });

    return tramos;
  }, [sectionsList, lotQueries]);

  return {
    building,
    sections: processedSections,
    racks: processedRacks,
    tramos: processedTramos,
  };
}
