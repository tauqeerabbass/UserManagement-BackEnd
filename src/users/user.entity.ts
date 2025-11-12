import { Posts } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    default: process.env.DEFAULT_AVATAR_URL,
  })
  photo: string;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
