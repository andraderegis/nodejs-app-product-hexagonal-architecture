import ProductServicePort from '@application/ports/product-service-port';
import { ProductStatus } from '@application/domain/product';

import {
  ControllerInterface,
  HttpRequest,
  SetProductStatusHttpRequestParams
} from '@adapters/inbound/interfaces';

import {
  HttpResponse,
  BAD_REQUEST,
  OK,
  SERVER_ERROR
} from '@adapters/inbound/helpers/http-response-helpers';

export class SetProductStatusController implements ControllerInterface {
  constructor(private productService: ProductServicePort) {}

  async execute(
    request: HttpRequest<SetProductStatusHttpRequestParams>
  ): Promise<HttpResponse<any>> {
    try {
      const { id, status } = request.data;

      if (this.isInvalidStatus(status)) {
        return BAD_REQUEST(new Error('invalid product status'));
      }

      const updateProduct =
        status === ProductStatus.ENABLED
          ? await this.productService.enable(id)
          : await this.productService.disable(id);

      return OK(updateProduct);
    } catch (error: any) {
      return error.name === 'ProductError' ? BAD_REQUEST(error) : SERVER_ERROR(error);
    }
  }

  private isInvalidStatus(status: string): boolean {
    return status !== ProductStatus.ENABLED && status !== ProductStatus.DISABLED;
  }
}
