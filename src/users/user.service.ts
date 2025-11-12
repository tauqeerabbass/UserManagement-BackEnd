import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from 'src/dto/CreateUserDto.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async search(query: string): Promise<User[]> {
    const isId = /^\d+$/.test(query);

    try {
      if (isId) {
        const user = await this.userRepository.find({
          where: { id: Number(query) },
        });
        return user;
      }
      return this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${query}%` })
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const emailToAdd = createUserDto.email.toLowerCase();

      const existingUser = await this.userRepository.findOne({
        where: { email: emailToAdd },
      });
      if (existingUser) {
        throw new Error('Email already exists.');
      }

      const photoToAdd =
        createUserDto.photo ??
        'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg';

      const user = this.userRepository.create({
        ...createUserDto,
        email: emailToAdd,
        password: hashedPassword,
        photo: photoToAdd,
      });

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  // create(user: Partial<User>): Promise<User> {
  //   const newUser = this.userRepository.create(user);
  //   return this.userRepository.save(newUser);
  // }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        throw new NotFoundException('User not found.');
      }
      const updated = Object.assign(existingUser, updateData);
      return this.userRepository.save(updated);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found.');
    }
  }
}
