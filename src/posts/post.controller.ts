import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Posts } from './post.entity';
import { postService } from './post.service';
import { PostWithUserDTO } from 'src/dto/postWithUser.dto';
import { userDataDTO } from 'src/dto/userData.dto';
import { CreatePostDTO } from 'src/dto/create-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: postService) {}

  @Get()
  async getAll(): Promise<PostWithUserDTO[]> {
    const posts = await this.postService.findAll();

    if (!posts || posts.length == 0) {
      throw new NotFoundException('No posts found for user ID');
    }

    return posts.map((post) => {
      const userData = new userDataDTO();
      userData.id = post?.user?.id;
      userData.name = post?.user?.name;
      userData.photo = post?.user?.photo;

      const postDTO = new PostWithUserDTO();
      postDTO.id = post.id;
      postDTO.title = post.title;
      postDTO.content = post.content;
      postDTO.description = post.description;
      postDTO.user = userData;

      return postDTO;
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<PostWithUserDTO> {
    const post = await this.postService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userData = new userDataDTO();
    userData.id = post.user?.id ?? null;
    userData.name = post.user?.name ?? 'Unknown User';
    userData.photo = post.user?.photo;

    const postDTO = new PostWithUserDTO();
    postDTO.id = post.id;
    postDTO.title = post.title;
    postDTO.content = post.content;
    postDTO.description = post.description;
    postDTO.user = userData;

    return postDTO;
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: number): Promise<PostWithUserDTO[]> {
    const posts = await this.postService.findByUserId(userId);

    if (!posts || posts.length == 0) {
      throw new NotFoundException('No posts found for user ID');
    }

    return posts.map((post) => {
      const userData = new userDataDTO();
      userData.id = post.user.id;
      userData.name = post.user.name;
      userData.photo = post.user.photo;

      const postDTO = new PostWithUserDTO();
      postDTO.id = post.id;
      postDTO.title = post.title;
      postDTO.content = post.content;
      postDTO.description = post.description;
      postDTO.user = userData;

      return postDTO;
    });
  }

  @Get('search/:query')
  async search(@Param('query') query: string) {
    const posts = await this.postService.search(query);
    // return posts;
    if (!posts.length) {
      throw new NotFoundException('No posts found for this search term');
    }

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.description,
      user: post.user
        ? { id: post.user.id, name: post.user.name, photo: post.user.photo }
        : {
            id: null,
            name: 'Unknown User',
            photo:
              'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlzc2FuJTIwcjM1JTIwZ3RyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
          },
    }));
  }

  @Post('user/:userId')
  async createForUser(
    @Param('userId') userId: number,
    @Body() CreatePostDTO: CreatePostDTO,
  ): Promise<Posts> {
    return await this.postService.createForUser(CreatePostDTO, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() post: Partial<Posts>,
  ): Promise<Posts> {
    return this.postService.update(id, post);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.postService.delete(id);
  }
}
