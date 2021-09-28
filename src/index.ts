import '@adapters/config/environment';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';

(async () => {
  try {
    await DBConnection.getInstance().connect();

    const { app } = await import('@adapters/config/express');

    app.listen(process.env.APPLICATION_PORT, () =>
      console.log(`Server running at http://localhost:${process.env.APPLICATION_PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
})();
