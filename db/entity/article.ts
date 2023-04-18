import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import { Tag } from "./tag";


@Entity({ name: "articles" })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  views!: number;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: number;

  // 设置外键，
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  public user!: User;

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true
  })
  public tags!: Tag[]

  // OneToMany 约定的关系
  @OneToMany(() => Comment, (comment) => comment.article)
  @JoinColumn({ name: "comment_id" })
  public comments!: Comment[];
}