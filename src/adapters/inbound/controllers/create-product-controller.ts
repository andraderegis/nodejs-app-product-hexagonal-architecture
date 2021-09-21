import ProductServicePort from '@application/ports/product-service-port';
import {
  HttpResponse,
  CREATED,
  BAD_REQUEST,
  SERVER_ERROR
} from '@adapters/inbound/helpers/http-response-helpers';
import { ControllerInterface, CreateProductHttpRequestParams } from '@adapters/inbound/interfaces';
import { QueryFailedError } from 'typeorm';
import { HttpRequest } from '../helpers/http-request-helpers';

export class CreateProductController implements ControllerInterface {
  constructor(private productService: ProductServicePort) {}

  async execute(
    request: HttpRequest<CreateProductHttpRequestParams>
  ): Promise<HttpResponse<unknown>> {
    try {
      const { name, price } = request.data;

      const product = await this.productService.create({ name, price });

      return CREATED(product);
    } catch (error: any) {
      return error instanceof QueryFailedError ? BAD_REQUEST(error) : SERVER_ERROR(error);
    }
  }
}
