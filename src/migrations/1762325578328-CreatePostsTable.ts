import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostsTable1762325578328 implements MigrationInterface {
  name = 'CreatePostsTable1762325578328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "description" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "description"`);
  }
}
