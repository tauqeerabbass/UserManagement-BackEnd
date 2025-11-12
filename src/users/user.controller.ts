import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO } from 'src/dto/CreateUserDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from 'src/JwtAuthGuard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
  
  @Get(':id')
  getOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('search/:query')
  async search(@Param('query') query: string): Promise<User[]> {
    return this.usersService.search(query);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDTO,
  ): Promise<User> {
    console.log('Received file:', file);
    const photoPath = file
      ? `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/users/${file.filename}`
      : undefined;

    return this.usersService.create({
      ...createUserDto,
      photo: photoPath,
    });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
