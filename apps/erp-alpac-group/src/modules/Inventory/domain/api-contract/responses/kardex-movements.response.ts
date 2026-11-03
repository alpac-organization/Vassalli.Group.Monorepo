import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";

export interface KardexMovementsResponse
{
   /**
    * Identificador único del registro de Kardex (GUID).
    */
   kardexId: string;

   /**
    * Tipo de Kardex al que pertenece el registro.
    */
   kardexType: KardexTypeEnum;

   /**
    * Tipo de movimiento registrado (por ejemplo: entrada, salida, ajuste).
    */
   movementType: KardexMovementTypeEnum;

   /**
    * Unidades involucradas en el movimiento.
    */
   units: number;

   /**
    * Total acumulado de unidades en existencia después del movimiento.
    */
   totalUnits: number;

   /**
    * Costo unitario del producto en el movimiento.
    */
   unitCost: number;

   /**
    * Monto total de entrada (valor monetario) del movimiento.
    */
   totalInput: number;

   /**
    * Monto total de salida (valor monetario) del movimiento.
    */
   totalOutput: number;

   /**
    * Costo promedio ponderado del producto tras el movimiento.
    */
   averageCost: number;

   /**
    * Valor total del Kardex (saldo valorizado) tras el movimiento.
    */
   totalKardex: number;
}