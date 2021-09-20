import ProductServicePort from '@application/ports/product-service-port';

import {
  ControllerInterface,
  GetProductsHttpRequestParams,
  HttpRequest
} from '@adapters/inbound/interfaces';

import {
  HttpResponse,
  OK,
  NOT_FOUND,
  SERVER_ERROR
} from '@adapters/inbound/helpers/http-response-helpers';

export class GetProductController implements ControllerInterface {
  constructor(private readonly productService: ProductServicePort) {}

  async execute(
    request: HttpRequest<GetProductsHttpRequestParams>
  ): Promise<HttpResponse<unknown>> {
    try {
      const products = await this.productService.get(request.data.id);

      return products ? OK(products) : NOT_FOUND();
    } catch (error) {
      return SERVER_ERROR(error);
    }
  }
}
