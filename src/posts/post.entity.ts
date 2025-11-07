import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    description: string;

    @ManyToOne(()=>User, (user) => user.posts, {onDelete: "CASCADE"})
    @JoinColumn({name: 'userId'})
    user: User;

    // @Column()
    // userId: number

}