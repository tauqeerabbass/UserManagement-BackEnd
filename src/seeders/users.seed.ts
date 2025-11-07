import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export default class createUserSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users = [
        {
            name: "user 1",
            email: "user1@gmail.com",
            password: "12345678"
        },
        {
            name: "user 2",
            email: "user2@gmail.com",
            password: "12345678"
        },
        {
            name: "user 3",
            email: "user3@gmail.com",
            password: "12345678"
        },
    ];

    await userRepository.save(users);
    console.log("Seeders added!");
  }
}
