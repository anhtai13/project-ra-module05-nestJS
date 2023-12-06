import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UserPassword } from './user-password.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  first_name?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  last_name?: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt?: Date;

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'role', type: 'varchar', length: 255, nullable: true })
  role: string;

  @OneToOne(() => UserProfile, (profile: UserProfile) => profile.user)
  profile: UserProfile;

  @OneToMany(
    () => UserPassword,
    (userPassword: UserPassword) => userPassword.user,
  )
  passwords: UserPassword[];

  @ManyToMany(() => Role, (role: Role) => role.users)
  roles: Role[];
}
