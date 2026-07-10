export interface WarehouseManaguaEntry {
  id: string;
  plateNumber: string; // Entidad clave: Relación con el sistema de transporte
  driverName: string;
  provider: string; // Relación con Customer/Provider base
  entryDate: Date;
  productCount: number;
}