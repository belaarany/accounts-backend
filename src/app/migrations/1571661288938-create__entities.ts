import { MigrationInterface, QueryRunner } from "typeorm"

export class create_entities1571661288938 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			"CREATE TABLE `accounts` (`id` varchar(36) NOT NULL, `identifier` varchar(100) NOT NULL, `password` varchar(100) NOT NULL, `passwordEncryption` varchar(20) NOT NULL, `email` varchar(100) NOT NULL, `firstName` varchar(100) NOT NULL, `lastName` varchar(100) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_4ab221da872e3a22c20258f3c8` (`identifier`), UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
		)
		await queryRunner.query(
			"CREATE TABLE `applications` (`id` varchar(36) NOT NULL, `name` varchar(300) NOT NULL, `clientId` varchar(300) NOT NULL, `clientSecret` varchar(100) NOT NULL, `homeUrl` varchar(300) NOT NULL, `callbackUrl` varchar(300) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
		)
		await queryRunner.query(
			"CREATE TABLE `auth_sessions` (`id` varchar(36) NOT NULL, `accountId` varchar(100) NULL DEFAULT null, `stepsCompleted` text NULL DEFAULT null, `flowType` varchar(30) NULL DEFAULT null, `clientId` varchar(100) NULL DEFAULT null, `validUntil` datetime NOT NULL, `authenticatedAt` datetime NULL DEFAULT null, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
		)
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query("DROP TABLE `auth_sessions`")
		await queryRunner.query("DROP TABLE `applications`")
		await queryRunner.query("DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`")
		await queryRunner.query("DROP INDEX `IDX_4ab221da872e3a22c20258f3c8` ON `accounts`")
		await queryRunner.query("DROP TABLE `accounts`")
	}
}
