import { RoleEnum } from "@app/core/enums/role.enum";
import { ModuleEnum } from "@app/core/enums/module.enum";
import { getPayrollRoutes } from "@app/routers/routes/payroll/payroll-routes";
import { getAdminRoutes } from "@app/routers/routes/admin/admin-routes";
import { getWorkManagementRoutes } from "@app/routers/routes/work-management/work-managment-routes";
import { getCorintoWarehouseRoutes } from "@app/routers/routes/warehouse/corinto/corinto-routes";
import { getManaguaWarehouseRoutes } from "@app/routers/routes/warehouse/managua/managua-routes";
import { getPurchasingRoutes } from "./purchasing/purchasing-routes";
import { getFinanceRoutes } from "./finance/finance-routes";

const {
  collboratorSection,
  gestionPayrollSection,
  payrollPeriodsHistorySection,
  applicationFromPayrollSection,
  activeDeductionSection,
  liquidacionSection,
  attendanceControlSection,
  subsidyHistorialSection,
} = getPayrollRoutes();

const {
  administrationUsersSection,
  administrationCostCentersSection,
  administrationAreasSection,
  administrationJobPositionsSection,
} = getAdminRoutes();

const { collaboratorProfileSection, permissionManagementSection } =
  getWorkManagementRoutes();

const {
  administrativeSection,
  warehouseCorintoSection,
  accessControlSection,
  scaleSection,
  inboundSection,
  warehouseReportSection,
} = getCorintoWarehouseRoutes();

const {
  warehouseManaguaSection,
  DucaPanel,
  warehouseSection12,
  BodegaSection,
} = getManaguaWarehouseRoutes();

const {
  supplierSection,
  purchaseRequestSection,
  quotesSection,
  purchaseOrderSection,
} = getPurchasingRoutes();

const { quoteAnalisysSection } = getFinanceRoutes();

export const routeConfig = {
  [ModuleEnum.PAYROLL]: {
    [RoleEnum.ADMINISTRATOR]: [
      collboratorSection,
      gestionPayrollSection,
      payrollPeriodsHistorySection,
      applicationFromPayrollSection,
      activeDeductionSection,
      liquidacionSection,
      attendanceControlSection,
      subsidyHistorialSection,
    ],
  },
  [ModuleEnum.ADMINISTRATION]: {
    [RoleEnum.ADMINISTRATOR]: [
      administrationUsersSection,
      administrationCostCentersSection,
      administrationAreasSection,
      administrationJobPositionsSection,
    ],
  },
  [ModuleEnum.WORK_MANAGEMENT]: {
    [RoleEnum.OPERATOR]: [
      collaboratorProfileSection,
      permissionManagementSection,
    ],
    [RoleEnum.MANAGER]: [
      collaboratorProfileSection,
      permissionManagementSection,
    ],
  },
  [ModuleEnum.WAREHOUSE_CORINTO]: {
    [RoleEnum.OPERATOR]: [
      administrativeSection,
      warehouseCorintoSection,
      accessControlSection,
      scaleSection,
      inboundSection,
      warehouseReportSection,
    ],
  },
  [ModuleEnum.WAREHOUSE_MANAGUA]: {
    [RoleEnum.OPERATOR]: [
      warehouseManaguaSection,
      DucaPanel,
      BodegaSection,
      warehouseSection12,
      warehouseReportSection,
    ],
  },
  [ModuleEnum.PURCHASING]: {
    [RoleEnum.ADMINISTRATOR]: [
      supplierSection,
      purchaseRequestSection,
      quotesSection,
      purchaseOrderSection,
    ],
    [RoleEnum.MANAGER]: [purchaseRequestSection],
    [RoleEnum.OPERATOR]: [purchaseRequestSection],
  },
  [ModuleEnum.FINANCE]: {
    [RoleEnum.ADMINISTRATOR]: [quoteAnalisysSection],
  },
};
