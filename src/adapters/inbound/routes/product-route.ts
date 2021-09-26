import { Router } from 'express';
import { CreateProductControllerFactory } from '@adapters/inbound/factories';
import { requestHandler } from '@adapters/inbound/helpers/http-express-helpers';

export default (router: Router): void => {
  router.post('/v1/products', requestHandler(new CreateProductControllerFactory().create()));
};
