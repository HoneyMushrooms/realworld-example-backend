import { CommentEntity } from '../entity/comment.entity';

export interface ICommentResponse {
  comment: Omit<CommentEntity, 'id'>;
}
