import {Request, Response} from "express";
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, Put } from '@nestjs/common';

import { CommentsService } from '../application/comments.service';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../likes/domain/like.entity';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly commentsQueryRepository: CommentsQueryRepository, @InjectModel(Like.name) private LikeModel: LikeModelType) {
  }

  @Get('commentId')
  async getComment(@Param() commentId: string,  @Req() req: Request, @Res() res: Response) {
    const token = req.cookies.refreshToken || ''

    const currentStatus = await serviceInfoLike.initializeStatusLike(token, commentId, this.LikeModel)

    const result = await this.commentsQueryRepository.getComment(commentId, currentStatus)

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).json(result.data)
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
    return
  }

  // @Put(':commentId')
  // async updateComment(@Param() commentId: string, @Body() content: string,  @Req() req: Request, @Res() res: Response) {
  //   const userId = req.userId!;
  //
  //   const result = await this.commentsService.update(commentId, content, userId)
  //
  //   if (result.errorMessage) {
  //     res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
  //     return
  //   }
  //   res.status(HTTP_STATUSES[result.status]).send({})
  //   return
  // }

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