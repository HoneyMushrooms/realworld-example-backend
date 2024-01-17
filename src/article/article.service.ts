import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import slugify from 'slugify';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    queryParams: any,
    userId?: number,
  ): Promise<{ articles: ArticleEntity[]; articlesCount: number }> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
      .orderBy('article.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (queryParams.author) {
      const author = await this.userRepository.findOneBy({
        username: queryParams.author,
      });
      queryBuilder.andWhere('article.authorId =:id', { id: author.id });
    }

    if (queryParams.tag) {
      queryBuilder.andWhere('article.tagList like :tag', {
        tag: `%${queryParams.tag}%`,
      });
    }

    if (queryParams.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: queryParams.favorited,
        },
        relations: { favorites: true },
      });

      const ArticleIds = author.favorites.map((e) => e.id);
      queryBuilder.andWhere('article.id IN (:...ArticleIds)', { ArticleIds });
    }

    queryBuilder.limit(queryParams.limit);
    queryBuilder.offset(queryParams.offset);

    let articles = await queryBuilder.getMany();

    if (userId) {
      articles = articles.map((art) => {
        art.favorited = art.favoritedBy.some((user) => user.id === userId);
        return art;
      });
    }

    articles.map((art) => this.serialization(art));

    return { articles, articlesCount };
  }

  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = this.articleRepository.create(createArticleDto);
    newArticle.slug = slugify(newArticle.title, { lower: true });
    newArticle.author = user;

    return this.articleRepository.save(newArticle);
  }

  findArcileBySlag(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOneBy({ slug });
  }

  async deleteArticle(userId: number, slug: string) {
    const article = await this.findArcileBySlag(slug);

    if (!article) {
      throw new NotFoundException();
    }

    if (article.author.id !== userId) {
      throw new ForbiddenException();
    }

    await this.articleRepository.delete({ slug });
  }

  async updateArcile(
    userId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: { favoritedBy: true },
    });

    if (!article) {
      throw new NotFoundException();
    }

    if (article.author.id !== userId) {
      throw new ForbiddenException();
    }

    if (updateArticleDto.title) {
      article.slug = slugify(updateArticleDto.title, { lower: true });
    }

    article.favorited = article.favoritedBy.some((user) => user.id === userId);

    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async addFavoriteArticle(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });

    const IsFavorited = user.favorites.some((art) => art.id === article.id);

    if (!IsFavorited) {
      user.favorites.push(article);
      await this.userRepository.save(user);
      article.favoritesCount++;
      await this.articleRepository.save(article);
    }

    article.favorited = true;

    return article;
  }

  async deleteFavoriteArticle(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });

    const IsFavorited = user.favorites.some((art) => art.id === article.id);

    if (IsFavorited) {
      user.favorites = user.favorites.filter((art) => art.id !== article.id);
      await this.userRepository.save(user);
      article.favoritesCount--;
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    article = this.serialization(article);

    return { article };
  }

  serialization(article: ArticleEntity) {
    delete article.id;
    delete article.author.id;
    delete article.author.email;
    delete article.author.password;
    delete article.favoritedBy;
    return article;
  }
}
