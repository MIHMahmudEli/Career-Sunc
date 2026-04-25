import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InternshipStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DELETED = 'deleted',
}

@Entity('internships')
export class Internship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ nullable: true, type: 'text' })
  requirements: string;

  @Column({ nullable: true })
  stipend: string;

  @Column({ nullable: true, type: 'int' })
  totalSlots: number;

  @Column({
    type: 'enum',
    enum: InternshipStatus,
    default: InternshipStatus.OPEN,
  })
  status: InternshipStatus;

  @ManyToOne(() => User, (user) => user.internships)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Application', 'internship')
  applications: any[];
}