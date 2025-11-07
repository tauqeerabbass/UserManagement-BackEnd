import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { postService } from "./post.service";
import { Posts } from "./post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Posts]), UserModule],
    controllers: [PostController],
    providers: [postService]
})

export class PostsModule{}