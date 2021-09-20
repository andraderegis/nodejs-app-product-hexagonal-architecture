module.exports = [
  {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [`./${process.env.TYPEORM_DIR_ENTITIES}/*.${process.env.TYPEORM_ENTITIES_EXTENSION}`],
    migrations: [
      `./${process.env.TYPEORM_DIR_MIGRATIONS}/*.${process.env.TYPEORM_MIGRATIONS_EXTENSION}`
    ],
    cli: {
      migrationsDir: `./${process.env.TYPEORM_DIR_MIGRATIONS}`,
      entitiesDir: `./${process.env.TYPEORM_DIR_ENTITIES}`
    }
  }
];
