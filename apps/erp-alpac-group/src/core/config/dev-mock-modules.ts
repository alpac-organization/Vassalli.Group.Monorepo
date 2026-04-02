import { ModuleEnum } from "@app/core/enums/module.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { ModulesAvailableResponse } from "@app/modules/dashboard/domain/ApiContract/Responses/modules-available.response";

const placeholderImage =
  "https://ui-avatars.com/api/?name=M&background=2962ff&color=fff&size=128";

/**
 * Módulos mostrados en el home cuando la sesión es mock (sin API).
 */
export function getDevMockModulesList(
  _companyId: string,
): ModulesAvailableResponse[] {
  return [
    {
      module_id: 1,
      module_name: "Nómina",
      company_id: 1,
      description:
        "Gestión de colaboradores y nómina (mock local).",
      module_code: ModuleEnum.PAYROLL,
      path_redirect: "payroll/collaborators",
      image_url: placeholderImage,
      role_type: RoleEnum.ADMINISTRATOR,
    },
    {
      module_id: 2,
      module_name: "Gestión de trabajo",
      company_id: 1,
      description:
        "Perfil de colaborador y tareas (mock local).",
      module_code: ModuleEnum.WORK_MANAGEMENT,
      path_redirect: "work-management",
      image_url: placeholderImage,
      role_type: RoleEnum.OPERATOR,
    },
  ];
}
