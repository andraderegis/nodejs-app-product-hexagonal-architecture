import { ObjectType, Repository } from 'typeorm';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';

abstract class BaseRepository {
  constructor(private readonly connection: DBConnection = DBConnection.getInstance()) {}

  protected getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity);
  }
}

export default BaseRepository;
