import { ArticleEntity } from '../entity/article.entity';

export interface IArticleResponse {
  article: Omit<ArticleEntity, 'id'>;
}
