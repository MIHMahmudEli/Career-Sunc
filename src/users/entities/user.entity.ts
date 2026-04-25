import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';

export enum UserRole {
  STUDENT = 'student',
  COMPANY = 'company',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true, type: 'timestamp' })
  lastLoginAt: Date;

  @Column({ nullable: true })
  adminNotes: string;

  @Column({ default: false })
  isSuspended: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Internship', 'createdBy')
  internships: any[];

  @OneToMany('Application', 'student')
  applications: any[];

  @OneToMany('RefreshToken', 'user')
  refreshTokens: any[];
}