import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'NewPass456' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}