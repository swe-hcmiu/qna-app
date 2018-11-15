-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema qasys2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema qasys2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `qasys2` DEFAULT CHARACTER SET utf8 ;
USE `qasys2` ;

-- -----------------------------------------------------
-- Table `qasys2`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`users` (
  `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `display_name` VARCHAR(50) NOT NULL,
  `provider` ENUM('qna', 'google', 'anonymous') NOT NULL DEFAULT 'anonymous',
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`googleusers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`googleusers` (
  `email` VARCHAR(255) NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `googleusers_email_unique` (`email` ASC),
  INDEX `googleusers_user_id_foreign` (`user_id` ASC),
  CONSTRAINT `googleusers_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `qasys2`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`knex_migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`knex_migrations` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `batch` INT(11) NULL DEFAULT NULL,
  `migration_time` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`qnausers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`qnausers` (
  `username` VARCHAR(50) NOT NULL,
  `userpass` VARCHAR(255) NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `qnausers_username_unique` (`username` ASC),
  INDEX `qnausers_user_id_foreign` (`user_id` ASC),
  CONSTRAINT `qnausers_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `qasys2`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`sessions` (
  `session_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `session_name` VARCHAR(70) NOT NULL,
  `session_type` ENUM('default', 'needs_verification') NOT NULL DEFAULT 'default',
  `session_status` ENUM('opening', 'closed') NOT NULL DEFAULT 'opening',
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`questions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`questions` (
  `question_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `session_id` INT(10) UNSIGNED NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` MEDIUMTEXT NULL DEFAULT NULL,
  `vote_by_user` INT(11) NULL DEFAULT '0',
  `vote_by_editor` INT(11) NULL DEFAULT '0',
  `question_status` ENUM('pending', 'unanswered', 'answered', 'invalid') NULL DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  INDEX `questions_session_id_foreign` (`session_id` ASC),
  INDEX `questions_user_id_foreign` (`user_id` ASC),
  CONSTRAINT `questions_session_id_foreign`
    FOREIGN KEY (`session_id`)
    REFERENCES `qasys2`.`sessions` (`session_id`)
    ON DELETE CASCADE,
  CONSTRAINT `questions_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `qasys2`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`roles` (
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `session_id` INT(10) UNSIGNED NOT NULL,
  `role` ENUM('editor') NOT NULL,
  PRIMARY KEY (`user_id`, `session_id`, `role`),
  INDEX `roles_session_id_foreign` (`session_id` ASC),
  CONSTRAINT `roles_session_id_foreign`
    FOREIGN KEY (`session_id`)
    REFERENCES `qasys2`.`sessions` (`session_id`)
    ON DELETE CASCADE,
  CONSTRAINT `roles_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `qasys2`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`votings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`votings` (
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `question_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `question_id`),
  INDEX `votings_question_id_foreign` (`question_id` ASC),
  CONSTRAINT `votings_question_id_foreign`
    FOREIGN KEY (`question_id`)
    REFERENCES `qasys2`.`questions` (`question_id`)
    ON DELETE CASCADE,
  CONSTRAINT `votings_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `qasys2`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
