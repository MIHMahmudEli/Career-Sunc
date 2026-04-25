import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { FilterInternshipDto } from './dto/filter-internship.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Internships')
@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  @ApiOperation({ summary: 'Create internship (Company only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post()
  create(@Body() dto: CreateInternshipDto, @CurrentUser() user: User) {
    return this.internshipsService.create(dto, user);
  }

  @ApiOperation({ summary: 'List all internships (public)' })
  @Get()
  findAll(@Query() filter: FilterInternshipDto) {
    return this.internshipsService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get my internships (Company only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Get('my')
  findMine(@CurrentUser() user: User) {
    return this.internshipsService.findMine(user.id);
  }

  @ApiOperation({ summary: 'Get single internship (public)' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internshipsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update internship (Company/Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInternshipDto, @CurrentUser() user: User) {
    return this.internshipsService.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Close internship (Company only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch(':id/close')
  close(@Param('id') id: string, @CurrentUser() user: User) {
    return this.internshipsService.close(id, user);
  }

  @ApiOperation({ summary: 'Delete internship (Company/Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.internshipsService.remove(id, user);
  }
}