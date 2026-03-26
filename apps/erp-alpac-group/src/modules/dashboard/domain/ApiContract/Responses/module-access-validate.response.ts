export interface ModuleAccessValidateResponse {
  //flag para verificar si tiene acceso a dicho modulo
  hasAccess: boolean;
  //mensaje descriptivo de la accion al intentar entrar al modulo
  message: string;
}
