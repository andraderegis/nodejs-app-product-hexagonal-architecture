import { Router } from 'express';
import {
  CreateProductControllerFactory,
  UpdateProductControllerFactory,
  GetProductControllerFactory
} from '@adapters/inbound/factories';
import { requestHandler } from '@adapters/inbound/helpers/http-express-helpers';

export default (router: Router): void => {
  router.post('/v1/products', requestHandler(new CreateProductControllerFactory().create()));
  router.patch('/v1/products', requestHandler(new UpdateProductControllerFactory().create()));
  router.get('/v1/products/:id', requestHandler(new GetProductControllerFactory().create()));
};
