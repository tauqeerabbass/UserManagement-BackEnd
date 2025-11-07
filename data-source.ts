import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Posts } from './src/posts/post.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'usermanag',
  synchronize: false,
  logging: true,
  entities: [User, Posts],
  migrations: ['src/migrations/*.ts'],
});
