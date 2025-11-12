// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { sign } from 'crypto';

@Module({
  imports: [UserModule,
    JwtModule.register({
      secret: process.env.NESTAUTH_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}