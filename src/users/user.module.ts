import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from './auth.guard';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [TypeOrmModule, UsersService]
})
export class UserModule {}