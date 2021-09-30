import { Router } from 'express';
import { CreateProductControllerFactory } from '@adapters/inbound/factories';
import { requestHandler } from '@adapters/inbound/helpers/http-express-helpers';
import { GetProductControllerFactory } from '../factories/get-product-controller-factory';

export default (router: Router): void => {
  router.post('/v1/products', requestHandler(new CreateProductControllerFactory().create()));
  router.get('/v1/products/:id', requestHandler(new GetProductControllerFactory().create()));
};
