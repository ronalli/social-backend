import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {}
