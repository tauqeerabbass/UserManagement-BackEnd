import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from './auth.guard';
import { User } from './user.entity';
import { CreateUserDTO } from 'src/dto/CreateUserDto.dto';

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
  create(@Body() CreateUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(CreateUserDTO);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
    return this.usersService.update(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
