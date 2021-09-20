import { HttpResponse } from '@adapters/inbound/helpers/http-response-helpers';
import { HttpRequest } from './http-request-interface';
import { HttpRequestParams } from './http-request-params-interface';

export interface ControllerInterface {
  execute(request: HttpRequest<HttpRequestParams>): Promise<HttpResponse>;
}
