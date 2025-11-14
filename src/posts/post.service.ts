import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './post.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class postService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Posts[]> {
    try {
      return await this.postRepository.find({
        relations: ['user'],
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Posts> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!post) throw new NotFoundException('Post not found.');
      return post;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<Posts[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      return this.postRepository.find({
        where: { user: { id: userId } } as any,
        relations: ['user'],
      });
    } catch (error) {
      throw error;
    }
  }

  async search(query: string): Promise<Posts[]> {
    try {
      const isId = /^\d+$/.test(query);

      const qb = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user');

      if (isId) {
        // Search by post ID or by user ID if query is numeric
        qb.where('post.id = :id', { id: Number(query) }).orWhere(
          'user.id = :userId',
          { userId: Number(query) },
        );
      } else {
        // Text-based search (case-insensitive)
        qb.where('LOWER(post.title) LIKE LOWER(:search)', {
          search: `%${query}%`,
        })
          .orWhere('LOWER(post.content) LIKE LOWER(:search)', {
            search: `%${query}%`,
          })
          .orWhere('LOWER(post.description) LIKE LOWER(:search)', {
            search: `%${query}%`,
          })
          .orWhere('LOWER(user.name) LIKE LOWER(:search)', {
            search: `%${query}%`,
          });
      }

      const results = await qb.getMany();
      return results;
    } catch (error) {
      console.error('Error in postService.search():', error);
      throw error;
    }
  }

  async createForUser(
    postData: Partial<Posts>,
    userId: number,
  ): Promise<Posts> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newPost = this.postRepository.create({
        title: postData.title,
        content: postData.content,
        description: postData.description || '',
        postPhoto: postData.postPhoto,
        user: user,
      });

      return await this.postRepository.save(newPost);
    } catch (error) {
      console.error('Error in createForUser:', error);
      throw error;
    }
  }

  create(post: Partial<Posts>): Promise<Posts> {
    try {
      const newPost = this.postRepository.create(post);
      return this.postRepository.save(newPost);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    update: Partial<Posts> & { user_Id?: number },
  ): Promise<Posts> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!post) throw new NotFoundException('Post not found.');

      if (update.user_Id) {
        const user = await this.userRepository.findOne({
          where: { id: update.user_Id },
        });
        if (!user) throw new NotFoundException('User not found.');
        post.user = user;
      }

      if (update.title !== undefined) post.title = update.title;
      if (update.content !== undefined) post.content = update.content;
      if (update.description !== undefined)
        post.description = update.description;
      if (update.postPhoto !== undefined) post.postPhoto = update.postPhoto;

      return this.postRepository.save(post);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }
}
