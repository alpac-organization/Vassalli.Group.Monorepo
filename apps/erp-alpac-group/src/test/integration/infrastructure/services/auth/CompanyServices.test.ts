import type { IHttpHandler } from "@app/core/ports";
import type { GetCompaniesResponse } from "@app/modules/auth/domain/ApiContract/Responses/get-companies.response";
import { CompanyServices } from "@app/modules/auth/infrastructure/services/CompanyServices";


describe('authentication_services_infrastructure', () => {
   let service: CompanyServices;
   let http_handler_mock: IHttpHandler;

   const mock_companies: GetCompaniesResponse[] = [
      { company_id: 1, company_name: 'ALPAC_PROD', alias: "ALPAC" },
      { company_id: 2, company_name: 'ALPAC_DEV',  alias: "ALPAC" }
   ];

   beforeEach(() => {
      http_handler_mock = {
         post: vi.fn(),
         get:  vi.fn().mockResolvedValue(mock_companies),
      } as unknown as IHttpHandler;

      service = new CompanyServices(http_handler_mock);
   });

   it('should_call_the_correct_endpoint_with_get_method', async () => {
      const result = await service.GetCompaniesAvailable();

      //El path de url donde debemos llamar debe verese de esta manera
      expect(http_handler_mock.get)
         .toHaveBeenCalledWith('/companies');
      
      expect(result)
         .toEqual(mock_companies);
      
      expect(result)
         .toHaveLength(2);
   });
});