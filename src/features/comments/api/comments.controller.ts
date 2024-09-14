import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
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
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikeModelType,
} from '../../likes/domain/like.entity';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';
import { AuthJwtGuard } from '../../../common/guards/auth.jwt.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { ValidateObjectIdPipe } from '../../../common/pipes/validateObjectIdPipe';
import { UpdateLikeStatusCommand } from '../application/usecases/update-likeStatus.usecase';
import { LikeStatusModel } from '../../likes/api/models/create-like.input.model';
import { UpdateCommentModel } from './models/input/update-comment.model';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':commentId')
  async getComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.headers?.authorization?.split(' ')[1] || '';

    const currentStatus = await serviceInfoLike.initializeStatusLike(
      token,
      commentId,
      this.LikeModel,
    );

    const result = await this.commentsQueryRepository.getComment(
      commentId,
      currentStatus,
    );

    if (!result) {
      throw new NotFoundException([
        { message: 'Not found comment', field: 'commentId' },
      ]);
    }

    return res.status(200).send(result);
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

  @UseGuards(AuthJwtGuard)
  @Put(':commentId/like-status')
  async updateLikeStatusForSpecialComment(
    @Param('commentId', ValidateObjectIdPipe) commentId: string,
    @Body() status: LikeStatusModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {

    const userId = req.userId!;
    const login = req.login!;

    // const dataBody: { likeStatus: LikeStatus } = req.body;

    // const objLike: any = {
    //   parentId: commentId,
    //   userId: userId,
    //   status: likeStatus,
    //   login: login,
    // };

    await this.commandBus.execute(
      new UpdateLikeStatusCommand(commentId, userId, status, login),
    );

    return res.status(204).send({});

    // console.log(objLike);

    // const response = await this.commentsServices.updateLikeStatus(objLike)

    // if(response.errorsMessages) {
    //   res.status(HTTP_STATUSES[response.status]).send({errorsMessages: response.errorsMessages})
    //   return;
    // }
    //
    // res.status(HTTP_STATUSES[response.status]).send({})
    // return
  }
}
