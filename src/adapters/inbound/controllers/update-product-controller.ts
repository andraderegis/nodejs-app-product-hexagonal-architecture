import ProductServicePort from '@application/ports/product-service-port';
import {
  ControllerInterface,
  HttpRequest,
  UpdateProductHttpRequestParams
} from '@adapters/inbound/interfaces';
import {
  HttpResponse,
  BAD_REQUEST,
  SERVER_ERROR,
  OK
} from '@adapters/inbound/helpers/http-response-helpers';
import Product from '@application/domain/product';

export class UpdateProductController implements ControllerInterface {
  constructor(private productService: ProductServicePort) {}

  async execute(request: HttpRequest<UpdateProductHttpRequestParams>): Promise<HttpResponse<any>> {
    try {
      const { id, name, price } = request.data;

      const product = new Product(name, price, id);

      const updatedProduct = await this.productService.update(product);

      return OK(updatedProduct);
    } catch (error: any) {
      return error.name === 'QueryFailedError' || error.name === 'ProductError'
        ? BAD_REQUEST(error)
        : SERVER_ERROR(error);
    }
  }
}
