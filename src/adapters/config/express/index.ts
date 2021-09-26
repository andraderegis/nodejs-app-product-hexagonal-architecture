import { ExpressSettings } from '@adapters/config/express/app';
import { MiddlewareSettings } from '@adapters/config/express/middlewares';
import { RouteSettings } from '@adapters/config/express/routes';

const expressSettings = new ExpressSettings();
const { app } = expressSettings;

expressSettings.addSettings(new MiddlewareSettings(app));
expressSettings.addSettings(new RouteSettings(app));

(async () => {
  await expressSettings.setup();
})();

export { app };
