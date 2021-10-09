import { ProductService } from '@application/services';
import { SetProductStatusController } from '@adapters/inbound/controllers';
import { Factory } from '@adapters/inbound/interfaces';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';

export class SetProductStatusControllerFactory implements Factory<SetProductStatusController> {
  create(): SetProductStatusController {
    const service = new ProductService(new ProductRepository());

    return new SetProductStatusController(service);
  }
}
