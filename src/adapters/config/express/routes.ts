import { readdir } from 'fs/promises';
import { join } from 'path';
import { Express, Router } from 'express';
import { Settings } from '@adapters/inbound/interfaces';

export class RouteSettings implements Settings {
  constructor(private app: Express) {}

  async setup(): Promise<void> {
    const router = Router();

    const files = await readdir(join(__dirname, '../../inbound/routes'));

    files
      .filter(file => file.endsWith('.ts'))
      .map(async file => {
        (await import(`../../inbound/routes/${file}`)).default(router);
      });

    this.app.use('/api', router);
  }
}
