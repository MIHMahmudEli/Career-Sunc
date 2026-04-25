import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipsService } from './internships.service';
import { InternshipsController } from './internships.controller';
import { Internship } from './entities/internship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Internship])],
  controllers: [InternshipsController],
  providers: [InternshipsService],
  exports: [InternshipsService],
})
export class InternshipsModule {}