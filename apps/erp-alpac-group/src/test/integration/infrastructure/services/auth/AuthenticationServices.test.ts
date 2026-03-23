import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IHttpHandler } from '@app/core/ports';
import { AuthenticationServices } from '@app/modules/auth/infrastructure/services/AuthenticationServices';
import type { LoginResponse } from '@app/modules/auth/domain/ApiContract/Responses/login.response';

//#region Testing Login
describe('authentication_services_infrastructure', () => {
   let service: AuthenticationServices;
   let http_handler_mock: IHttpHandler;

   const mock_login_resonse: LoginResponse = {
      access_token: "accesst_token",
      company_information: {
         company_id: 1,
         company_name: "almacenadora",
         image_url: "https://"
      },
      refresh_token: "refresh_token",
      user_id: "0000-0000-0001",
      user_name: "mockname"
   }

   beforeEach(() => {
      http_handler_mock = {
         post: vi.fn().mockResolvedValue(mock_login_resonse),
         get:  vi.fn(),
      } as unknown as IHttpHandler;

      service = new AuthenticationServices(http_handler_mock);
   });

   it('should_call_the_correct_endpoint_including_company_id', async () => {
      const login_payload = { 
         username: 'test_user', 
         password: 'password123', 
         company_id: 101 
      };

      const result = await service.StartLoginProcess(login_payload);

      expect(http_handler_mock.post)
         .toHaveBeenCalledWith('/companies/101/auth/login', login_payload);

      expect(result)
         .toEqual(mock_login_resonse);
   });
});

//#endregion Testing Login