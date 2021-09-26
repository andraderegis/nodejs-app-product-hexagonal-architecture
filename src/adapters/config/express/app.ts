import { Settings } from '@adapters/inbound/interfaces';
import Express from 'express';

export class ExpressSettings implements Settings {
  private settings: Set<Settings> = new Set();

  constructor(private readonly _app = Express()) {}

  get app() {
    return this._app;
  }

  async setup(): Promise<void> {
    const setupsPromises: Promise<void>[] = [];

    this.settings.forEach(setting => setupsPromises.push(setting.setup()));

    await Promise.all(setupsPromises);
  }

  addSettings(setting: Settings) {
    this.settings.add(setting);
  }
}
