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
// import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
// import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
// import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
// import { UpdateCommentModel } from './models/input/update-comment.model';
// import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
// import { Like, LikeModelType } from '../../../likes/domain/like.entity';
// import { serviceInfoLike } from '../../../../common/services/initialization.status.like';
// import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
// import { LikeStatusModel } from '../../../likes/api/models/create-like.input.model';
// import { UpdateLikeStatusCommand } from '../application/usecases/update-likeStatus.usecase';
//
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
import { LikeStatusEntity } from '../../../likes/domain/like.entity';
import { UpdateLikeStatusCommentCommand } from '../application/usecases/update-likeStatus.usecase';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
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


}

//
//   @Get(':commentId')
//   async getComment(
//     @Param('commentId', ValidateObjectIdPipe) commentId: string,
//     @Req() req: Request,
//     @Res() res: Response,
//   ) {
//     const token = req.headers?.authorization?.split(' ')[1] || '';
//
//     const currentStatus = await serviceInfoLike.initializeStatusLike(
//       token,
//       commentId,
//       this.LikeModel,
//     );
//
//     const result = await this.commentsQueryRepository.getComment(
//       commentId,
//       currentStatus,
//     );
//
//     if (!result) {
//       throw new NotFoundException([
//         { message: 'Not found comment', field: 'commentId' },
//       ]);
//     }
//
//     return res.status(200).send(result);
//   }
//
//   @UseGuards(AuthJwtGuard)
//   @Put(':commentId')
//   async updateComment(
//     @Param('commentId') commentId: string,
//     @Body() content: UpdateCommentModel,
//     @Req() req: Request,
//     @Res() res: Response,
//   ) {
//     const userId = req.userId!;
//
//     const result = await this.commandBus.execute(
//       new UpdateCommentCommand(commentId, content, userId),
//     );
//
//     if (!result)
//       throw new BadRequestException([
//         { message: 'If the inputModel has incorrect values', field: 'value' },
//       ]);
//
//     return res.status(204).send({});
//   }
//
//   @UseGuards(AuthJwtGuard)
//   @Delete(':commentId')
//   async deleteComment(
//     @Param('commentId') commentId: string,
//     @Req() req: Request,
//     @Res() res: Response,
//   ) {
//     const userId = req.userId!;
//
//     await this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
//
//     return res.status(204).send({});
//   }
//