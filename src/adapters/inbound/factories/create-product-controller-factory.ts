import { ProductService } from '@application/services';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import { CreateProductController } from '@adapters/inbound/controllers';
import { Factory } from '@adapters/inbound/interfaces';

export class CreateProductControllerFactory implements Factory<CreateProductController> {
  create(): CreateProductController {
    const service = new ProductService(new ProductRepository());

    return new CreateProductController(service);
  }
}
