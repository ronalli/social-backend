import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ErrorModel {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  field: string;
}

export class OutputModelErrors {
  @ApiProperty({
    type: [ErrorModel],
  })
  @ValidateNested({ each: true })
  @Type(() => ErrorModel)
  errorsMessages: ErrorModel[];
}
