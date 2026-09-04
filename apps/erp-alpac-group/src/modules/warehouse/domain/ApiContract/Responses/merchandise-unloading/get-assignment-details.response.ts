import type { UnloadingStatus } from "@app/modules/warehouse/domain/enums/warehouse-managua/unloading-status";

/**
 * Detalle de una asignación de descarga de mercancía.
 */
export interface GetAssignmentDetailsResponse {
   
   assignment_id: string;
   record_entrance_id: string;   
   entrance_ducat_id: string | null;
   warehouse_name: string | null;
   unloading_status: UnloadingStatus["value"];
   assigned_at: string;
   warehouse_keeper_user_id: string | null;
   warehouse_keeper_user_name: string | null;
   machinery: MachineryAssignment[];
   crew: CrewSummary;
}

/**
 * Maquinaria asignada a una descarga.
 */
export interface MachineryAssignment {   
   code: string | null;
}

/**
 * Resumen de la cuadrilla asignada a la descarga.
 */
export interface CrewSummary {
   /**
    * Indica si la cuadrilla es de personal externo (tercerizado).
    */
   is_outsourced: boolean;

   /**
    * Cantidad de personas en la cuadrilla.
    */
   person_count: number;

   /**
    * Nombres de los integrantes de la cuadrilla.
    */
   member_names: string[];
}