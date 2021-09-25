import { RequestHandler, Request, Response } from 'express';
import { ControllerInterface } from '../interfaces';

const requestHandler = (controller: ControllerInterface): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      data: {
        ...req.body
      }
    };

    const { statusCode, data, error } = await controller.execute(httpRequest);

    const json = [200, 201, 204].includes(statusCode) ? data : { error: error?.message };

    res.status(statusCode).json(json);
  };
};

export { requestHandler };
