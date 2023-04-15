import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Article } from "./article";


@Entity({ name: "comments" })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  content!: string;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  // 设置外键，
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  public user!: User;

  // 设置外键，
  @ManyToOne(() => Article)
  @JoinColumn({ name: "article_id" })
  public article!: Article;
}