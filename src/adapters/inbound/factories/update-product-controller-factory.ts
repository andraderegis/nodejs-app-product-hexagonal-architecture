import { UpdateProductController } from '@adapters/inbound/controllers';
import { Factory } from '@adapters/inbound/interfaces';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import { ProductService } from '@application/services';

export class UpdateProductControllerFactory implements Factory<UpdateProductController> {
  create(): UpdateProductController {
    const service = new ProductService(new ProductRepository());

    return new UpdateProductController(service);
  }
}
