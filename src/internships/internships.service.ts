import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Internship, InternshipStatus } from './entities/internship.entity';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { FilterInternshipDto } from './dto/filter-internship.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class InternshipsService {
  constructor(
    @InjectRepository(Internship)
    private internshipRepo: Repository<Internship>,
  ) {}

  // CREATE 
  async create(dto: CreateInternshipDto, user: User) {
    const internship = this.internshipRepo.create({
      ...dto,
      createdById: user.id,
    });
    return this.internshipRepo.save(internship);
  }

  // LIST WITH FILTER & PAGINATION
  async findAll(filter: FilterInternshipDto) {
    const { q, location, status, deadline_before, deadline_after,
      page, limit, sortBy, order } = filter;

    const qb = this.internshipRepo.createQueryBuilder('internship')
      .leftJoinAndSelect('internship.createdBy', 'company')
      .where('internship.status != :deleted', { deleted: InternshipStatus.DELETED });

    if (q) {
      qb.andWhere(
        '(internship.title ILIKE :q OR internship.description ILIKE :q)',
        { q: `%${q}%` }
      );
    }

    if (location) {
      qb.andWhere('internship.location ILIKE :location', { location: `%${location}%` });
    }

    if (status) {
      qb.andWhere('internship.status = :status', { status });
    }

    if (deadline_before) {
      qb.andWhere('internship.deadline <= :deadline_before', { deadline_before });
    }

    if (deadline_after) {
      qb.andWhere('internship.deadline >= :deadline_after', { deadline_after });
    }

    const allowedSortFields = ['createdAt', 'deadline', 'title'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    qb.orderBy(`internship.${safeSortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET ONE
  async findOne(id: string) {
    const internship = await this.internshipRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!internship || internship.status === InternshipStatus.DELETED) {
      throw new NotFoundException('Internship not found');
    }
    return internship;
  }

  // MY INTERNSHIPS (company)
  async findMine(userId: string) {
    return this.internshipRepo.find({
      where: { createdById: userId },
      order: { createdAt: 'DESC' },
    });
  }

  // UPDATE
  async update(id: string, dto: UpdateInternshipDto, user: User) {
    const internship = await this.findOne(id);
    this.checkOwnership(internship, user);

    Object.assign(internship, dto);
    return this.internshipRepo.save(internship);
  }

  // CLOSE
  async close(id: string, user: User) {
    const internship = await this.findOne(id);
    this.checkOwnership(internship, user);

    internship.status = InternshipStatus.CLOSED;
    await this.internshipRepo.save(internship);
    return { message: 'Internship closed successfully' };
  }

  // SOFT DELETE
  async remove(id: string, user: User) {
    const internship = await this.findOne(id);
    this.checkOwnership(internship, user);

    internship.status = InternshipStatus.DELETED;
    await this.internshipRepo.save(internship);
    return { message: 'Internship deleted successfully' };
  }

  // OWNERSHIP CHECK
  private checkOwnership(internship: Internship, user: User) {
    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = internship.createdById === user.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You do not own this internship');
    }
  }
}