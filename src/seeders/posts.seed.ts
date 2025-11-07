import { Posts } from 'src/posts/post.entity';
import { DataSource } from 'typeorm';

export default class createPostSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(Posts);

    const post = [
        {
            title: "Post 1",
            content: "bsdfsfafsssssssdsafqwdasa",
            description: "bsdfsfafsssssssdsafqwdasa"
        },
        {
            title: "Post 2",
            content: "bsdfsfafsssssssdsafqwdasa",
            description: "bsdfsfafsssssssdsafqwdasa"
        },
        {
            title: "Post 3",
            content: "bsdfsfafsssssssdsafqwdasa",
            description: "bsdfsfafsssssssdsafqwdasa"
        },
    ];

    await userRepository.save(post);
    console.log("Seeders added!");
  }
}
