import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE = 'products';

export default class CreateProducts1631658737573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE);
  }
}
