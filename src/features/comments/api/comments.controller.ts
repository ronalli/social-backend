import {Request, Response} from "express";
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  Put,
  NotFoundException,
  UseGuards, BadRequestException,
} from '@nestjs/common';

import { CommentsService } from '../application/comments.service';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';
import { AuthJwtGuard } from '../../../common/guards/auth.jwt.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly commentsQueryRepository: CommentsQueryRepository, @InjectModel(Like.name) private LikeModel: LikeModelType, private readonly commandBus: CommandBus) {
  }

  @Get(':commentId')
  async getComment(@Param('commentId') commentId: string,  @Req() req: Request, @Res() res: Response) {

    const token = req.headers.cookie.split('=')[1] || ''

    const currentStatus = await serviceInfoLike.initializeStatusLike(token, commentId, this.LikeModel)

    const result = await this.commentsQueryRepository.getComment(commentId, currentStatus)

    if(!result) {
      throw new NotFoundException([{message: 'Not found comment', field: 'commentId'}])
    }

    res.status(200).send(result);
  }

  @UseGuards(AuthJwtGuard)
  @Put(':commentId')
  async updateComment(@Param('commentId') commentId: string, @Body('content') content: string,  @Req() req: Request, @Res() res: Response) {
    const userId = req.userId!;

    const result = await this.commandBus.execute(new UpdateCommentCommand(commentId, content, userId))

    if(!result) throw new BadRequestException([{message: 'If the inputModel has incorrect values', field: 'value'}])

    res.status(204).send({});
  }

  // @Delete(':commentId')
  // async deleteComment(@Param() commentId: string, @Req() req: Request, @Res() res: Response) {
  //   const userId = req.userId!;
  //
  //   const result = await this.commentsService.delete(commentId, userId)
  //
  //   if (result.errorMessage) {
  //     res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
  //     return
  //   }
  //
  //   res.status(HTTP_STATUSES[result.status]).send({})
  //   return;
  // }

  // async updateLikeStatusForSpecialComment(req: Request, res: Response) {
  //   const {commentId} = req.params;
  //   const userId = req.userId!;
  //   const login = req.login!;
  //
  //   const dataBody: { likeStatus: LikeStatus } = req.body;
  //
  //   const objLike: Omit<ILikeTypeDB, 'addedAt'> = {
  //     parentId: commentId,
  //     userId: userId,
  //     status: dataBody.likeStatus,
  //     login: login
  //   }
  //
  //   const response = await this.commentsServices.updateLikeStatus(objLike)
  //
  //   if(response.errorsMessages) {
  //     res.status(HTTP_STATUSES[response.status]).send({errorsMessages: response.errorsMessages})
  //     return;
  //   }
  //
  //   res.status(HTTP_STATUSES[response.status]).send({})
  //   return
  // }
}