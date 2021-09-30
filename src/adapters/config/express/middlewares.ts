import { Express, Response, json } from 'express';
import cors from 'cors';
import { Settings } from '@adapters/inbound/interfaces';

export class MiddlewareSettings implements Settings {
  constructor(private app: Express) {}

  async setup(): Promise<void> {
    this.app.use(cors());

    this.app.use(json());

    this.app.use((_, res: Response, next) => {
      res.type('json');
      next();
    });
  }
}
