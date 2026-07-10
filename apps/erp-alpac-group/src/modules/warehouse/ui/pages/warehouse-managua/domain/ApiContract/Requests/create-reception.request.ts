export interface CreateReceptionRequest {
  paisDeOrigen: string;
  aduana: string;
  placaCabezal: string;
  placaRastra?: string;
  conductor: string;
  licencia: string;
  transportista: string;
  consignatario: string;
  marchamo: string;
  ducas: string[]; // N cantidad de DUCAs
}