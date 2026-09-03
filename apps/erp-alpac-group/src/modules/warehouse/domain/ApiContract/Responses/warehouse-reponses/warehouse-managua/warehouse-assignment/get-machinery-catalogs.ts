export interface MachineryDto {
  id: string;
  code: string;
  name: string;
  machinery_type: string;
  status: string;
}

export type GetMachineryCatalogsResponse = MachineryDto[];

