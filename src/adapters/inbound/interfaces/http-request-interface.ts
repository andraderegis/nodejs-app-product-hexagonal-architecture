import { HttpRequestParams } from './http-request-params-interface';

export interface HttpRequest<T extends HttpRequestParams> {
  data: T;
}
