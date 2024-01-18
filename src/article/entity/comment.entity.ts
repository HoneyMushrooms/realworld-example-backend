import { ArticleEntity } from 'src/article/entity/article.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, { nullable: true })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  author: UserEntity;
}
