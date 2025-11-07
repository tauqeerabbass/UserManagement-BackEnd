import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user: User | null = await this.usersService.findByEmail(email); 

        if (user) {
            const isPasswordValid = await bcrypt.compare(pass, user.password); 

            if (isPasswordValid) {
                const { password, ...result } = user; 
                return result; 
            }
        }
        return null;
    }
}