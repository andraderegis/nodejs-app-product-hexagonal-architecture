import { ProductStatus } from '@application/domain/product';
import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
class ProductEntity {
  @PrimaryColumn({
    type: 'uuid'
  })
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal'
  })
  price: number;

  @Column({
    enum: ProductStatus
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ProductEntity;
