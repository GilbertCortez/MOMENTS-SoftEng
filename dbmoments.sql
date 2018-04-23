

CREATE TABLE tblOrganizer(
intOrganizerID INT PRIMARY KEY AUTO_INCREMENT,
strOrganizerFName VARCHAR(50) NOT NULL ,
strOrganizerMName VARCHAR(50) ,
strOrganizerLName VARCHAR	(50) NOT NULL,
strOrganizerEmail VARCHAR(50) NOT NULL UNIQUE,
strOrganizerPassword VARCHAR(50) NOT NULL,
strOrganizerTel VARCHAR(13),
strOrganizerCell VARCHAR(11) NOT NULL,
strOrganizerBusinessName VARCHAR(50));

create table tblEvent(
intEventNo INT PRIMARY KEY AUTO_INCREMENT,
intOrganizerID INT NOT NULL,
strEventName VARCHAR(50) NOT NULL,
dateEventStart TIMESTAMP NOT NULL DEFAULT 0,
dateEventEnd TIMESTAMP NOT NULL DEFAULT 0,
strEventDescription VARCHAR(255) NOT NULL,
boolEventStatus BOOLEAN NOT NULL DEFAULT '1', 			
intEstimatedNumberofGuest INT NOT NULL,
strCity VARCHAR(50) NOT NULL,
strProvince VARCHAR(50 ) NOT NULL
);

CREATE table tblTransaction(
intTransactionNo int primary key AUTO_INCREMENT,
intEventNo int  not null);

CREATE table tblPayment(
intPaymentNo int not null primary key 

AUTO_INCREMENT,
intTransactionNo int not null,
decAmountPaid decimal(9,2) not null
);

CREATE table tblServices (
intTransactionNo int  not null ,
intGenServiceNo int not null,
dtmServiceDateofUse timestamp default 0,
decServiceFinalPrice decimal(9,2) ,
intServiceStatus int(1) default 1 not null,
dtmServiceDate timestamp not null default current_timestamp,			
primary key(intTransactionNo,intGenServiceNo)
);

CREATE table tblRental(
intTransactionNo int not null,
intItemNo int not null,
dtmRentalDateofUse timestamp default 0,
decRentalFinalPrice decimal(9,2) ,
intRentalStatus int(1) not null default 1,			dtmRentalDate timestamp not null default current_timestamp,	
primary key(intTransactionNo,intItemNo)
);

CREATE table  tblGenService(
intGenServiceNo int not null primary key 
AUTO_INCREMENT,
intProviderID  int not null,
strServiceName varchar(50) not null,
strEstimatedPrice varchar(20) not null,
strServiceDescription varchar(255) not null,
decServiceRefundPercentage decimal(3,2) not null,
strServiceAvailableDay varchar(27) not null,
intGenServiceStatus int(1) not null default 1,					
intAdminID int not null
);

CREATE table tblProvider(
intProviderID int not null primary key 

AUTO_INCREMENT,
strProviderBusinessName varchar(50),
strProviderFName varchar(50) not null,
strProviderMName varchar(50),
strProviderLName varchar(50) not null,
strProviderTel varchar(12),
strProviderCell varchar(11) not null,
strProviderEmail varchar(50) not null unique,
strProviderPassword varchar(50) not null,
strProviderDTI varchar(8),			
strProviderBIR varchar (5),				
intProviderStatus int (1) not null default 0,			
intAdminID int,
strCity varchar(50) not null,
strProvince varchar(50) not null
);

CREATE table tblItem(
intItemNo int not null primary key AUTO_INCREMENT,
intProviderID int not null,
strItemName varchar(50) not null,
strEstimatedPrice varchar(20) not null,
strItemDescription varchar(255) not null,
decItemRefundPercentage decimal(3,2) not null,
strItemAvailableDay varchar(27) not null,
intItemStatus int(1) not null default 1,			
intAdminID int not null
);

CREATE table tblAdmin (
intAdminID int not null primary key AUTO_INCREMENT,
strAdminFName varchar(50) not null,
strAdminMName varchar(50),
strAdminLName varchar(50) not null,
strAdminEmail varchar(50) not null unique,
strAdminPassword varchar(50) not null
);

CREATE table tblItemReport (
intItemReportNo int not null primary key AUTO_INCREMENT,
intItemNo int not null,
strReportReason varchar(50) not null,
intOrganizerID int not null
);

CREATE table tblServiceReport (
intServiceReportNo int not null primary key AUTO_INCREMENT,
intGenServiceNo int not null,
strReportReason varchar(50) not null,
intOrganizerID int not null
);

INSERT INTO `tbladmin`( `strAdminFName`, `strAdminMName`, `strAdminLName`, `strAdminEmail`, `strAdminPassword`) VALUES ("Janelle"," ","Alag","admin@email.com",sha("Admin23"));


CREATE DEFINER=`root`@`localhost` PROCEDURE `sproc_prvSignup`(IN `@p0` VARCHAR(50), IN `@p1` VARCHAR(50), IN `@p2` VARCHAR(50), IN `@p3` VARCHAR(12), IN `@p4` VARCHAR(11), IN `@p5` VARCHAR(50), IN `@p6` VARCHAR(50))
    NO SQL
INSERT INTO tblProvider(strProviderFname, strProviderMname, strProviderLname, strProviderTel, strProviderCell, strProviderEmail, strProviderPassword) VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6);

CREATE DEFINER=`root`@`localhost` PROCEDURE `sproc_orgSignup`(IN `@p0` VARCHAR(50), IN `@p1` VARCHAR(50), IN `@p2` VARCHAR(50), IN `@p3` VARCHAR(50), IN `@p4` VARCHAR(50), IN `@p5` VARCHAR(13), IN `@p6` VARCHAR(11), IN `@p7` VARCHAR(50))
    NO SQL
INSERT INTO tblOrganizer(strOrganizerFName, strOrganizerMName, strOrganizerLName, strOrganizerEmail, strOrganizerPassword, strOrganizerTel, strOrganizerCell, strOrganizerBusinessName) VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7);
