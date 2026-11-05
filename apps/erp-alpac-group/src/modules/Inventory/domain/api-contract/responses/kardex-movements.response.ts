import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";

export interface KardexMovementsData
{
   /**
    * Identificador único del registro de Kardex (GUID).
    */
   kardex_id: string;

   /**
    * Tipo de Kardex al que pertenece el registro.
    */
   kardex_type: KardexTypeEnum;

   /**
    * Tipo de movimiento registrado (por ejemplo: entrada, salida, ajuste).
    */
   movement_type: KardexMovementTypeEnum;

   /**
    * Unidades involucradas en el movimiento.
    */
   units: number;

   /**
    * Total acumulado de unidades en existencia después del movimiento.
    */
   total_units: number;

   /**
    * Costo unitario del producto en el movimiento.
    */
   unit_cost: number;

   /**
    * Monto total de entrada (valor monetario) del movimiento.
    */
   total_input: number;

   /**
    * Monto total de salida (valor monetario) del movimiento.
    */
   total_output: number;

   /**
    * Costo promedio ponderado del producto tras el movimiento.
    */
   average_cost: number;

   /**
    * Valor total del Kardex (saldo valorizado) tras el movimiento.
    */
   total_kardex: number;

   /**
    * Información del producto asociado al movimiento.
    */
   product_information: KardexProductInformation;
}

export interface KardexProductInformation
{
   /**
    * Identificador único del producto (GUID).
    */
   product_id: string;

   /**
    * Código del producto (por ejemplo: ALP-MGA-02-001).
    */
   product_code: string;

   /**
    * Nombre del producto.
    */
   product_name: string;

   /**
    * Descripción del producto.
    */
   description: string;

   /**
    * Tipo de uso del producto (por ejemplo: Administrative).
    */
   product_usage_type: string;

   /**
    * Información de la categoría a la que pertenece el producto.
    */
   category_information: KardexCategoryInformation;
}

export interface KardexCategoryInformation
{
   /**
    * Código de la categoría (por ejemplo: "02").
    */
   code: string;

   /**
    * Nombre de la categoría.
    */
   name: string;

   /**
    * Identificador único de la categoría (GUID).
    */
   category_id: string;
}