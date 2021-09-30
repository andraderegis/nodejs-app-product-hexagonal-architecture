import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import { ProductService } from '@application/services';
import { GetProductController } from '@adapters/inbound/controllers';
import { Factory } from '@adapters/inbound/interfaces';

export class GetProductControllerFactory implements Factory<GetProductController> {
  create(): GetProductController {
    const service = new ProductService(new ProductRepository());

    return new GetProductController(service);
  }
}
