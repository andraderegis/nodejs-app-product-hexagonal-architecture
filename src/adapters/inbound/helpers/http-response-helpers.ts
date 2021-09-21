import { ServerError } from '../errors/http';

export type HttpResponse<T = unknown> = {
  statusCode: number;
  data: T;
  error?: Error;
};

class HttpResponseHelper {
  static makeReponse(statusCode: number, data: unknown, error?: Error): HttpResponse {
    return {
      statusCode,
      data,
      error
    };
  }
}

const OK = (data: unknown): HttpResponse => HttpResponseHelper.makeReponse(200, data);

const CREATED = (data: unknown): HttpResponse => HttpResponseHelper.makeReponse(201, data);

const BAD_REQUEST = (error: Error): HttpResponse =>
  HttpResponseHelper.makeReponse(400, undefined, error);

const NOT_FOUND = (): HttpResponse => HttpResponseHelper.makeReponse(404, undefined);

const SERVER_ERROR = (error: Error): HttpResponse =>
  HttpResponseHelper.makeReponse(500, undefined, new ServerError(error));

export { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR };
