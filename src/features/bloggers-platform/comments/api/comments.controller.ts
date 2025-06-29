import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Put,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Headers,
  HttpCode,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
import { LikeStatusEntity } from '../../../likes/domain/like.entity';
import { UpdateLikeStatusCommentCommand } from '../application/usecases/update-likeStatus.usecase';
import { InputCommentModel } from './models/input/update-comment.model';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { CommentsService } from '../application/comments.service';
import { jwtService } from '../../../../common/services/jwt.service';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { HTTP_STATUSES } from '../../../../settings/http.status';
import { UpdateLikeStatusForSpecialCommentApiResponse } from '../../../../common/services/swagger/comments/update-like-status-for-special-comment.api-response';
import { UpdateCommentApiResponse } from '../../../../common/services/swagger/comments/update-comment.api-response';
import { DeleteCommentApiResponse } from '../../../../common/services/swagger/comments/delete-comment.api-resposne';
import { GetCommentApiResponse } from '../../../../common/services/swagger/comments/get-comment.api-response';
import { CommentsTypeOrmQueryRepository } from '../infrastructure/comments.typeorm.query-repository';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsTypeOrmQueryRepository: CommentsTypeOrmQueryRepository,
  ) {}

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBearerAuth()
  @UseGuards(AuthJwtGuard)
  @Put(':commentId/like-status')
  @UpdateLikeStatusForSpecialCommentApiResponse()
  async updateLikeStatusForSpecialComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Body() data: LikeStatusEntity,
    @Req() req: Request,
  ) {
    const userId = req.userId!;

    await this.commandBus.execute(
      new UpdateLikeStatusCommentCommand(commentId, userId, data.likeStatus),
    );

    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBearerAuth()
  @UseGuards(AuthJwtGuard)
  @Put(':commentId')
  @UpdateCommentApiResponse()
  async updateComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Body() content: InputCommentModel,
    @Req() req: Request,
  ) {
    const userId = req.userId!;

    const result = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, content, userId),
    );

    if (!result)
      throw new BadRequestException([
        { message: 'If the inputModel has incorrect values', field: 'value' },
      ]);

    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBearerAuth()
  @UseGuards(AuthJwtGuard)
  @Delete(':commentId')
  @DeleteCommentApiResponse()
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ) {
    const userId = req.userId!;
    await this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
    return;
  }

  @HttpCode(HTTP_STATUSES.Success)
  @Get(':commentId')
  @GetCommentApiResponse()
  async getComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const foundComment =
      await this.commentsTypeOrmQueryRepository.isCommentDoesExist(commentId);

    if (!foundComment) {
      throw new NotFoundException([
        {
          message: `If comment with specified postId doesn\'t exists`,
          field: 'commentId',
        },
      ]);
    }

    const token = authHeader?.split(' ')[1] || '';

    const userId = await jwtService.getUserIdByToken(token);

    return await this.commentsService.getOneComment(userId, commentId);
  }
}
