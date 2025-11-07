import { AppDataSource } from "data-source"
import createUserSeeds from "./users.seed";
import createPostSeeds from "./posts.seed";

async function run(){
    await AppDataSource.initialize();

    await new createUserSeeds().run(AppDataSource);
    await new createPostSeeds().run(AppDataSource);

    console.log("Seeds executed");
    await AppDataSource.destroy();
}

run();