DROP DATABASE IF EXISTS QASys;

CREATE DATABASE QASys;

USE QASys;

CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(50),
    UserPass TEXT,
    
    UNIQUE (UserName)
);

CREATE TABLE Sessions (
    SessionId INT AUTO_INCREMENT PRIMARY KEY,
    SessionName VARCHAR(50),
    SessionType ENUM('DEFAULT', 'NEEDS_VERIFICATION'),
    
    UNIQUE (SessionName, SessionType)
);

CREATE TABLE Roles (
    UserId INT NOT NULL,
    SessionId INT NOT NULL,
    Role ENUM('EDITOR') NOT NULL,
    
    FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,
    FOREIGN KEY (SessionId)
        REFERENCES Sessions(SessionId)
        ON DELETE CASCADE,
    
    PRIMARY KEY (UserId, SessionId,Role)
);

CREATE TABLE Questions (
    QuestionId INT PRIMARY KEY AUTO_INCREMENT,
    SessionId INT NOT NULL,
    UserId INT NOT NULL,
    Title VARCHAR(255),
    Content MEDIUMTEXT,
    VoteByUser INT DEFAULT 0,
    VoteByEditor INT DEFAULT 0,
    Status ENUM('PENDING', 'UNANSWERED', 'ANSWERED'),
    Time DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,
    FOREIGN KEY (SessionId)
        REFERENCES Sessions(SessionId)
        ON DELETE CASCADE
    
);
