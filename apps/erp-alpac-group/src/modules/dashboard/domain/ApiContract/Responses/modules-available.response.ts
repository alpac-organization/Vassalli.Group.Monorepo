/**
 * Respuesta del servidor que detalla los módulos disponibles para una empresa.
 * @interface ModulesAvailableResponse
 */
export interface ModulesAvailableResponse {
    /**
     * Identificador único del módulo en el sistema.
     * @example 101
     */
    module_id: number;

    /**
     * Nombre descriptivo del módulo (ej. "Nómina", "Contabilidad").
     * @example "Payroll"
     */
    module_name: string;

    /**
     * Identificador de la empresa a la que pertenece el módulo. 
     * Se maneja como string para soportar identificadores UUID o alfanuméricos del multi-tenant.
     * @example "ERP-ALPAC-01"
     */
    company_id: string;

    /**
     * Explicación detallada de las funcionalidades o el propósito del módulo.
     * Útil para mostrar tooltips o descripciones extendidas en el panel de control.
     * @example "Gestión integral de salarios, prestaciones y seguridad social."
     */
    description: string;
}