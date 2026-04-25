import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInternshipDto {
  @ApiProperty({ example: 'Frontend Developer Intern' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'We are looking for a passionate frontend intern...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2026-06-30' })
  @IsDateString()
  deadline: string;

  @ApiPropertyOptional({ example: 'React, TypeScript, CSS' })
  @IsOptional()
  @IsString()
  requirements: string;

  @ApiPropertyOptional({ example: '$500/month' })
  @IsOptional()
  @IsString()
  stipend: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalSlots: number;
}