import ProductServicePort from '@application/ports/product-service-port';
import {
  ControllerInterface,
  GetProductsHttpRequestParams,
  HttpRequest
} from '@adapters/inbound/interfaces';
import { HttpResponse } from '../helpers/http-response-helpers';

export class GetProductController implements ControllerInterface {
  constructor(private readonly productService: ProductServicePort) {}

  async execute(
    request: HttpRequest<GetProductsHttpRequestParams>
  ): Promise<HttpResponse<unknown>> {
    try {
      const products = await this.productService.get(request.data.id);
      return {
        statusCode: products ? 200 : 404,
        data: products
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      };
    }
  }
}
