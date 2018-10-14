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
  `UserId` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Provider` ENUM('qna', 'google', 'anonymous') NULL DEFAULT NULL,
  PRIMARY KEY (`UserId`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`googleusers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`googleusers` (
  `UserId` INT(11) NOT NULL,
  `Email` VARCHAR(255) NULL DEFAULT NULL,
  UNIQUE INDEX `Email` (`Email` ASC),
  INDEX `UserId` (`UserId` ASC),
  CONSTRAINT `googleusers_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `qasys2`.`users` (`UserId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`qnausers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`qnausers` (
  `UserId` INT(11) NOT NULL,
  `UserName` VARCHAR(50) NULL DEFAULT NULL,
  `UserPass` TEXT NULL DEFAULT NULL,
  UNIQUE INDEX `UserName` (`UserName` ASC),
  INDEX `UserId` (`UserId` ASC),
  CONSTRAINT `qnausers_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `qasys2`.`users` (`UserId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`sessions` (
  `SessionId` INT(11) NOT NULL AUTO_INCREMENT,
  `SessionName` VARCHAR(50) NULL DEFAULT NULL,
  `SessionType` ENUM('DEFAULT', 'NEEDS_VERIFICATION') NULL DEFAULT NULL,
  `SessionStatus` ENUM('OPENING', 'CLOSED') DEFAULT 'OPENING',
  `CreationTime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateTime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SessionId`),
  UNIQUE INDEX `SessionName` (`SessionName` ASC, `SessionType` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`questions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`questions` (
  `QuestionId` INT(11) NOT NULL AUTO_INCREMENT,
  `SessionId` INT(11) NOT NULL,
  `UserId` INT(11) NOT NULL,
  `Title` VARCHAR(255) NULL DEFAULT NULL,
  `Content` MEDIUMTEXT NULL DEFAULT NULL,
  `VoteByUser` INT(11) NULL DEFAULT '0',
  `VoteByEditor` INT(11) NULL DEFAULT '0',
  `Status` ENUM('PENDING', 'UNANSWERED', 'ANSWERED') NULL DEFAULT NULL,
  `CreationTime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateTime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QuestionId`),
  INDEX `UserId` (`UserId` ASC),
  INDEX `SessionId` (`SessionId` ASC),
  CONSTRAINT `questions_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `qasys2`.`users` (`UserId`)
    ON DELETE CASCADE,
  CONSTRAINT `questions_ibfk_2`
    FOREIGN KEY (`SessionId`)
    REFERENCES `qasys2`.`sessions` (`SessionId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`roles` (
  `UserId` INT(11) NOT NULL,
  `SessionId` INT(11) NOT NULL,
  `Role` ENUM('EDITOR') NOT NULL,
  PRIMARY KEY (`UserId`, `SessionId`, `Role`),
  INDEX `SessionId` (`SessionId` ASC),
  CONSTRAINT `roles_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `qasys2`.`users` (`UserId`)
    ON DELETE CASCADE,
  CONSTRAINT `roles_ibfk_2`
    FOREIGN KEY (`SessionId`)
    REFERENCES `qasys2`.`sessions` (`SessionId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `qasys2`.`voting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `qasys2`.`voting` (
  `UserId` INT(11) NOT NULL,
  `QuestionId` INT(11) NOT NULL,
  PRIMARY KEY (`UserId`, `QuestionId`),
  INDEX `QuestionId` (`QuestionId` ASC),
  CONSTRAINT `voting_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `qasys2`.`users` (`UserId`)
    ON DELETE CASCADE,
  CONSTRAINT `voting_ibfk_2`
    FOREIGN KEY (`QuestionId`)
    REFERENCES `qasys2`.`questions` (`QuestionId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
