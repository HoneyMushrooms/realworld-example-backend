import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { User } from 'src/user/decorator/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { ICommentResponse } from './types/commentResponse.inteface';

@Controller('articles')
export class ArticleController {
  constructor(private articleServise: ArticleService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  async findAllArticle(@Query() queryParams: any, @User('id') userId?: number) {
    const articlesData = await this.articleServise.findAllArticle(
      queryParams,
      userId,
    );
    return articlesData;
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleServise.createArticle(
      user,
      createArticleDto,
    );
    return this.articleServise.buildArticleResponse(article);
  }

  @Get(':slug')
  async getArcile(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleServise.findArcileBySlag(slug);
    return this.articleServise.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<void> {
    await this.articleServise.deleteArticle(userId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleServise.updateArcile(
      userId,
      slug,
      updateArticleDto,
    );
    return this.articleServise.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addFavoriteArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleServise.addFavoriteArticle(userId, slug);
    return this.articleServise.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteFavoriteArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleServise.deleteFavoriteArticle(
      userId,
      slug,
    );
    return this.articleServise.buildArticleResponse(article);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @User() user: UserEntity,
    @Body('comment') createCommentDto: CreateCommentDto,
    @Param('slug') slug: string,
  ): Promise<ICommentResponse> {
    const comment = await this.articleServise.createComment(
      createCommentDto,
      user,
      slug,
    );
    return this.articleServise.buildCommentResponse(comment);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteComment(
    @User('id') userId: number,
    @Param('id') commentId: number,
  ): Promise<void> {
    await this.articleServise.deleteComment(userId, commentId);
  }
  
  @Get(':slug/comments')
  async findAllComments(@Param('slug') slug: string) {
    return this.articleServise.findAllComment(slug);
  }
}
