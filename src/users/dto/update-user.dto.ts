import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Updated' })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ example: 'STU-2024-002' })
  @IsOptional()
  @IsString()
  studentId: string;

  @ApiPropertyOptional({ example: 'Software Engineering' })
  @IsOptional()
  @IsString()
  department: string;

  @ApiPropertyOptional({ example: 'Microsoft' })
  @IsOptional()
  @IsString()
  companyName: string;
}