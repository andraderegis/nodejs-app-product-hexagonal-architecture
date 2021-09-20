export type HttpResponse<T = unknown> = {
  statusCode: number;
  data: T;
};

class HttpResponseHelper {
  static makeReponse(statusCode: number, data: unknown): HttpResponse {
    return {
      statusCode,
      data
    };
  }
}

const OK = (data: unknown): HttpResponse => HttpResponseHelper.makeReponse(200, data);

const NOT_FOUND = (): HttpResponse => HttpResponseHelper.makeReponse(404, undefined);

const SERVER_ERROR = (error: unknown): HttpResponse => HttpResponseHelper.makeReponse(500, error);

export { OK, NOT_FOUND, SERVER_ERROR };
