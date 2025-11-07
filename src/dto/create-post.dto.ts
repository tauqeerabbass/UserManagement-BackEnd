import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @IsOptional()
  @IsString()
  description?: string;
}