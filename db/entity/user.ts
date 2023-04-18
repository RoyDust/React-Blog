import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  nickname!: string;

  @Column()
  avatar!: string;

  @Column({
    nullable: true,
  })
  job?: string;

  @Column({
    nullable: true,
  })
  introduce?: string;

}