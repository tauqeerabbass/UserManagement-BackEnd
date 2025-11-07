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
    return this.userRepository.findOne({ where: { email } });
  }

  async search(query: string): Promise<User[]> {
    const isId = /^\d+$/.test(query);

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
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    // 1. Hash the password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 2. Create the user entity with the hashed password
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // 👈 Store the hashed password
    });

    return this.userRepository.save(user);
  }

  // create(user: Partial<User>): Promise<User> {
  //   const newUser = this.userRepository.create(user);
  //   return this.userRepository.save(newUser);
  // }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }
    const updated = Object.assign(existingUser, updateData);
    return this.userRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found.');
    }
  }
}
