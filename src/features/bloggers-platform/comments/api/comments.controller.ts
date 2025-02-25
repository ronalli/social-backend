import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  Put,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
import { LikeStatusEntity } from '../../../likes/domain/like.entity';
import { UpdateLikeStatusCommentCommand } from '../application/usecases/update-likeStatus.usecase';
import { UpdateCommentModel } from './models/input/update-comment.model';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { serviceInfoLike } from '../../../../common/services/initialization.status.like';
import { LikesService } from '../../../likes/application/likes.service';
import { jwtService } from '../../../../common/services/jwt.service';
import { CommentsService } from '../application/comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}

  @UseGuards(AuthJwtGuard)
  @Put(':commentId/like-status')
  async updateLikeStatusForSpecialComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Body() data: LikeStatusEntity,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.userId!;

    await this.commandBus.execute(
      new UpdateLikeStatusCommentCommand(commentId, userId, data.likeStatus),
    );

    return res.status(204).send({});
  }

  @UseGuards(AuthJwtGuard)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() content: UpdateCommentModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.userId!;

    const result = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, content, userId),
    );

    if (!result)
      throw new BadRequestException([
        { message: 'If the inputModel has incorrect values', field: 'value' },
      ]);

    return res.status(204).send({});
  }

  @UseGuards(AuthJwtGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.userId!;

    await this.commandBus.execute(new DeleteCommentCommand(commentId, userId));

    return res.status(204).send({});
  }

  @Get(':commentId')
  async getComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.headers?.authorization?.split(' ')[1] || '';

    const response = await this.commentService.getOneComment(token, commentId)

    return res.status(200).send(response);
  }

}



