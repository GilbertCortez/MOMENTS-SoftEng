# Moments

Moment is a web-based event resources reservation system. An organizer can create event and find items or services needed for the event. A provider can offer his/her items or services.

Sample Events that may be organized:
  - Birthday
  - Wedding
  - Funeral
  - Educational Seminar
  - Festival
  - Party

## Features!

  - Create Event
  - Reserve Items/Acquire Services
  - Post Items/Services
  - Cancellation of Reservations
  - Cancellation of Event
  - Hiring Businessman


### Tech

Moment uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [jQuery] - a cross-platform JavaScript library designed to simplify the client-side scripting of HTML. 
* [Bootstrap] -a free and open-source front-end web framework for designing websites and web applications.
* [sweetalert] - a JavaScript library that provides a replacement for standard alert() dialogue.
* [async] - is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. 
* [ejs] - a simple templating language that lets you generate HTML markup with plain JavaScript.


### Installation

1. Fork this repository. https://github.com/janellealag/Moments
2. After forking, clone it to your local machines. Forking gives you ownership to the copy of the project, thus you'll have automatic read and write (pull and push) privileges. No need to authenticate through your professor as long as you have configured your SSH keys.
3. After cloning, open a command line (terminal) and go to the boilerplate directory. Issue an `npm install` command. This will download module dependencies of the project. **Note that this requires a working internet connection**.
4. After installing all the dependencies, open the `.env.sample` file and copy the contents of it. Create a new `.env` file and paste everything in there. The sample file has comments in it for each field present.
5.  Run the application using `node index.js` or `nodemon`.

```sh
$ npm install
$ node index.js
```

On your browser: type localhost:3009/login (this will direct you to the login page)
If you are an admin, your email is admin@email.com and your password is Admin23

## Database

If you want to enable the database part of the application, then you have to check the following first:
- MySQL should be installed
- You have a usable credential to login to your MySQL database, provide them in the .env file
- You have created a database in MySQL, provide the name in the .env file
- Import the dbForum.sql to your mysql server. Two ways to import:
    1. Through your phpmyadmin on browser, just click import and choose the dbMoments.sql file
    2. Or through your command line:
    
    ```sh
    $ cd xampp/mysql/bin
    $ mysql root -u root -p
    $ create database dbMoments;
    $ source dbMoments.sql
    ```
    note: make sure that your .sql file is pasted on the same directory (/mysql/bin)
- Once all of those are satisfied, you should be able to see your list of users in the `/index` route when you run the app.

## Table Descriptions
- tblOrganizer
   `intOrganizerID` INT PRIMARY KEY AUTO_INCREMENT,
    `strOrganizerFName` VARCHAR(50) NOT NULL ,
    `strOrganizerMName` VARCHAR(50) ,
    `strOrganizerLName` VARCHAR	(50) NOT NULL,
    `strOrganizerEmail` VARCHAR(50) NOT NULL UNIQUE,
    `strOrganizerPassword` VARCHAR(50) NOT NULL,
    `strOrganizerTel` VARCHAR(13),
    `strOrganizerCell` VARCHAR(11) NOT NULL,
    `strOrganizerBusinessName` VARCHAR(50))

- tblEvent
    `intEventNo` INT PRIMARY KEY AUTO_INCREMENT,
    `intOrganizerID` INT NOT NULL,
    `strEventName` VARCHAR(50) NOT NULL,
    `dateEventStart` TIMESTAMP NOT NULL DEFAULT 0,
    `dateEventEnd` TIMESTAMP NOT NULL DEFAULT 0,
    `strEventDescription` VARCHAR(255) NOT NULL,
    `boolEventStatus` BOOLEAN NOT NULL DEFAULT '1', 			
    `intEstimatedNumberofGuest` INT NOT NULL,
    `strCity` VARCHAR(50) NOT NULL,
    `strProvince` VARCHAR(50 ) NOT NULL

- tblTransaction
    intTransactionNo int primary key AUTO_INCREMENT,
    intEventNo int  not null

- tblPayment
    intPaymentNo int not null primary key AUTO_INCREMENT,
    intTransactionNo int not null,
    decAmountPaid decimal(9,2) not null

- tblServices
    intTransactionNo int  not null ,
    intGenServiceNo int not null,
    dtmServiceDateofUse timestamp default 0,
    decServiceFinalPrice decimal(9,2) ,
    intServiceStatus int(1) default 1 not null,					
    primary key(intTransactionNo,intGenServiceNo)

- tblRental
    intTransactionNo int not null,
    intItemNo int not null,
    dtmRentalDateofUse timestamp default 0,
    decRentalFinalPrice decimal(9,2) ,
    intRentalStatus int(1) not null default 1,					
    primary key(intTransactionNo,intItemNo)

- tblGenServices
    intGenServiceNo int not null primary key AUTO_INCREMENT,
    intProviderID  int not null,
    strServiceName varchar(50) not null,
    strEstimatedPrice varchar(20) not null,
    strServiceDescription varchar(255) not null,
    decServiceRefundPercentage decimal(3,2) not null,
    strServiceAvailableDay varchar(27) not null,
    intGenServiceStatus int(1) not null default 1,					
    intAdminID int not null

- tblProvider
    intProviderID int not null primary key AUTO_INCREMENT,
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

- tblItem
    intItemNo int not null primary key AUTO_INCREMENT,
    intProviderID int not null,
    strItemName varchar(50) not null,
    strEstimatedPrice varchar(20) not null,
    strItemDescription varchar(255) not null,
    decItemRefundPercentage decimal(3,2) not null,
    strItemAvailableDay varchar(27) not null,
    intItemStatus int(1) not null default 1,			
    intAdminID int not null

- tblAdmin
    intAdminID int not null primary key AUTO_INCREMENT,
    strAdminFName varchar(50) not null,
    strAdminMName varchar(50),
    strAdminLName varchar(50) not null,
    strAdminEmail varchar(50) not null unique,
    strAdminPassword varchar(50) not null

- tblItemReport
    intItemReportNo int not null primary key AUTO_INCREMENT,
    intItemNo int not null,
    strReportReason varchar(50) not null,
    intOrganizerID int not null

- tblServiceReport
    intServiceReportNo int not null primary key AUTO_INCREMENT,
    intGenServiceNo int not null,
    strReportReason varchar(50) not null,
    intOrganizerID int not null


