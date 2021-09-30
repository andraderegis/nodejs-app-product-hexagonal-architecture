import { ServerError } from '../errors/http';

export type HttpResponse<T = any> = {
  statusCode: number;
  data: T;
  error?: Error;
};
export class HttpResponseHelper {
  private constructor() {}

  static makeReponse(statusCode: number, data: any, error?: Error): HttpResponse {
    return {
      statusCode,
      data,
      error
    };
  }
}

export const OK = (data: any): HttpResponse => HttpResponseHelper.makeReponse(200, data);

export const CREATED = (data: any): HttpResponse => HttpResponseHelper.makeReponse(201, data);

export const BAD_REQUEST = (error: Error): HttpResponse =>
  HttpResponseHelper.makeReponse(400, {}, error);

export const NOT_FOUND = (): HttpResponse => HttpResponseHelper.makeReponse(404, {});

export const SERVER_ERROR = (error: Error): HttpResponse =>
  HttpResponseHelper.makeReponse(500, undefined, new ServerError(error));
