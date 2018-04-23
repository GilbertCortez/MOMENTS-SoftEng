//THIS IS THE CONTROLLER FOR ORGANIZER
var sanitizer = require('sanitize')();
//module used in this controller
var express = require('express');
var async = require('async');
//declaration of routes
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
router.use(authMiddleware.hasAuth);


 router.get('/itemServiceList', (req,res) =>{
	res.render('/organizer/views/itemServiceList');
});

router.get('/', (req,res) =>{
	db.query(`SELECT COUNT(*) as upcomingctr FROM tblEvent WHERE now()<dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,upcomingctr, fields) =>{ console.log(upcomingctr);
	db.query(`SELECT COUNT(*) as recentctr FROM tblEvent WHERE now()>dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,recentctr, fields) =>{console.log(recentctr);

var profile= req.session.user;
    res.render('organizer/views/organizerDashboard', {profile:profile,rectr:recentctr[0].recentctr,upctr:upcomingctr[0].upcomingctr, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
	});
	});
	});

router.post('/', (req,res) =>{

var profile= req.session.user;
    res.render('organizer/views/organizerDashboard', {profile:profile,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});





router.post('/summaryOfItemService', (req,res) =>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/summaryItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});

});


router.post('/itemServiceList', (req,res) =>{

var profile= req.session.user;
	var toSearch=`${req.body.searchbox}`;
	if(toSearch.length>0){
		db.query(`select * from tblevent WHERE intOrganizerID=${req.session.user.intOrganizerID} order by 1 desc limit 1`, (err,currenteventno, fields) =>{
			console.log(currenteventno);
		if(err){console.log(err);}
			db.query(`SELECT UPPER(LEFT( "${currenteventno[0].dateEventStart}",2)) AS EVENTDAY `, (err,EVENTDAY, fields) =>{
				console.log(EVENTDAY[0].EVENTDAY);
			db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${currenteventno[0].intEventNo}`,(err,transactionNum,fields)=>{
	db.query(`SELECT *
			FROM tblGenService JOIN tblProvider ON tblGenService.intProviderID=tblProvider.intProviderID
			WHERE (LOWER(strServiceName) LIKE LOWER("%${toSearch}%")
				OR LOWER(strServiceName) LIKE LOWER("${toSearch}%")
				OR LOWER(strServiceName) LIKE LOWER("%${toSearch}")
				OR LOWER(strServiceDescription) LIKE LOWER("%${toSearch}%")
				OR LOWER(strServiceDescription) LIKE LOWER("${toSearch}%")
				OR LOWER(strServiceDescription) LIKE LOWER("%${toSearch}"))
				AND intGenServiceNo NOT IN(SELECT intGenServiceNo from tblServices WHERE ${transactionNum[0].intTransactionNo}=intTransactionNo)
				AND  strServiceAvailableDay LIKE "%${EVENTDAY[0].EVENTDAY}%" AND intGenServiceStatus=1
				`, (err,resultsServices, fields) =>{
	if(err){console.log(err);}
	console.log("RESULTS");
	console.log(resultsServices);
		db.query(`SELECT *
				FROM tblItem JOIN tblProvider ON tblItem.intProviderID=tblProvider.intProviderID
				WHERE (LOWER(strItemName) LIKE LOWER("%${toSearch}%")
					OR LOWER(strItemName) LIKE LOWER("${toSearch}%")
					OR LOWER(strItemName) LIKE LOWER("%${toSearch}")
					OR LOWER(strItemDescription) LIKE LOWER("%${toSearch}%")
					OR LOWER(strItemDescription) LIKE LOWER("${toSearch}%")
					OR LOWER(strItemDescription) LIKE LOWER("%${toSearch}"))
					AND intItemNo NOT IN(SELECT intItemNo from tblRental WHERE ${transactionNum[0].intTransactionNo}=intTransactionNo)
				AND  strItemAvailableDay LIKE "%${EVENTDAY[0].EVENTDAY}%"  AND intItemStatus=1
					`, (err,resultsItems, fields) =>{
					if(err){console.log(err);}
					console.log(resultsItems);
					console.log(resultsServices);

			res.render('organizer/views/chooseSpecificItemService', {profile:profile,currevent:currenteventno, reServices:resultsServices,reItems:resultsItems,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});

		});
		});
		});
		});
	});
	}
	else{
				db.query(`select intEventNo from tblevent WHERE intOrganizerID=${req.session.user.intOrganizerID} order by 1 desc limit 1`, (err,currenteventno, fields) =>{
			res.render('organizer/views/chooseSpecificItemService', {profile:profile,currevent:currenteventno, reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});

		});
	}
});

router.get('/createEvent', (req,res) =>{

var profile= req.session.user;
	res.render('organizer/views/createNewEvent', {profile:profile,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});


router.post('/createEvent', (req,res) =>{

var profile= req.session.user;

	var eventlocation=`${req.body.location}`.split(",");
	var city=eventlocation[0];
	var province=eventlocation[1];
	var starttime=`${req.body.eventdatestart}`+" "+`${req.body.eventtimestart}`+":00";
	var endtime=`${req.body.eventdateend}`+" "+`${req.body.eventtimeend}`+":00";

	db.query(`INSERT INTO tblEvent
				(intOrganizerID,
				strEventName,
				dateEventStart,
				dateEventEnd,
				strEventDescription,
				intEstimatedNumberofGuest,
				strCity,
				strProvince)
			values(${req.session.user.intOrganizerID},
			"${req.body.eventname}",
			"${starttime}",
			"${endtime}",
			"${req.body.eventdescription}",
			"${req.body.estimatednumberofguest}",
			"${city}","${province}")`, (err,results, fields) =>{

		if(err){console.log(err);}
		db.query(`select intEventNo from tblevent WHERE intOrganizerID=${req.session.user.intOrganizerID} order by 1 desc limit 1 `, (err,currenteventno, fields) =>{

			db.query(`INSERT INTO tblTransaction(intEventNo) values(${currenteventno[0].intEventNo}) `,(err,results,fields)=>{

				res.render('organizer/views/chooseSpecificItemService', {profile:profile,currevent:currenteventno,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
			});

		});
	});
});

router.get('/upcomingEvents', (req,res) =>{

var profile= req.session.user;
	db.query(`SELECT *, DATE_FORMAT(dateEventStart , "%M %e, %Y %r") AS start,
				DATE_FORMAT(dateEventEnd , "%M %e, %Y %r") AS end
			FROM tblEvent
			WHERE now()<dateEventEnd AND
				boolEventStatus=true AND
				${req.session.user.intOrganizerID}=intOrganizerID
			ORDER BY start`, (err,results, fields) =>{
		console.log(results);
		res.render('organizer/views/Events', {profile:profile,re:results, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
  });
});
router.get('/cancelledEvents', (req,res) =>{

var profile= req.session.user;
	db.query(`SELECT *, DATE_FORMAT(dateEventStart , "%M %e, %Y %r") AS start,DATE_FORMAT(dateEventEnd , "%M %e, %Y %r") AS end from tblEvent where boolEventStatus=0 AND  ${req.session.user.intOrganizerID}=intOrganizerID ORDER BY start`, (err,results, fields) =>{
      console.log(results);
    res.render('organizer/views/cancelledEvents', {profile:profile,re:results, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
  });
});

router.post('/cancelEvent', (req,res)=>{

var profile= req.session.user;
	db.query(`UPDATE tblevent SET boolEventStatus=0 WHERE intEventNo=${req.body.cancelevent}`, (err,results, fields) =>{
	 if(err) console.log(err);

        db.query(`update tblrental set intrentalstatus = ${3} where inttransactionno = (select inttransactionno from tbltransaction where inteventno = ${req.body.cancelevent})`, (a,b,c)=>{
            if (a) console.log(a);

            db.query(`update tblservices set intservicestatus = ${3} where inttransactionno = (select inttransactionno from tbltransaction where inteventno = ${req.body.cancelevent})`, (d,e,f)=>{
                if(d) console.log(e);

                res.redirect('/organizer/upcomingEvents');
            });
        });


	});
});

router.get('/recentEvents', (req,res) =>{

var profile= req.session.user;
	db.query(`SELECT *, DATE_FORMAT(dateEventStart , "%M %e, %Y %r") AS start,DATE_FORMAT(dateEventEnd , "%M %e, %Y %r") AS end from tblEvent where now()>dateEventEnd AND boolEventStatus=1 AND  ${req.session.user.intOrganizerID}=intOrganizerID ORDER BY start`, (err,results, fields) =>{
      console.log(results);
    res.render('organizer/views/recentEvents', {profile:profile,re:results, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
  });
 });

router.get('/serviceRequest', (req,res)=>{
	res.redirect('/organizer/createEvent');
});

router.post('/serviceRequest', (req,res)=>{

var profile= req.session.user;
	var currentEventNo=`${req.body.currentEvent}`;
	var genServiceNo=`${req.body.servicereq}`;
	var dateOfUse=`${req.body.dateOfUse}`+' '+`${req.body.timeOfUse}`+':00';
	console.log(dateOfUse);

	db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${currentEventNo}`,(err,results,fields)=>{
		if(err)console.log("1"+err);
		console.log(results);
		db.query(`INSERT INTO tblServices(intTransactionNo,intGenServiceNo,dtmServiceDateofUse) VALUES(${results[0].intTransactionNo},${genServiceNo},"${dateOfUse}")`,(err,results,fields)=>{
	if(err)console.log("2"+err);
db.query(`select intEventNo from tblevent WHERE intOrganizerID=${req.session.user.intOrganizerID} order by 1 desc limit 1 `, (err,currenteventno, fields) =>{
			if(err)console.log("3"+err);
				res.render('organizer/views/chooseSpecificItemService', {profile:profile,currevent:currenteventno,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
			});
	});
	});

});

router.post('/AddService', (req,res)=>{

var profile= req.session.user;
	var currentEventNo=`${req.body.currentEvent}`;
	var genServiceNo=`${req.body.servicereq}`;
	var dateOfUse=`${req.body.dateOfUse}`+' '+`${req.body.timeOfUse}`+':00';
	console.log(dateOfUse);
	db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${currentEventNo}`,(err,results,fields)=>{
		if(err)console.log("1"+err);
		console.log(results);
		db.query(`INSERT INTO tblServices(intTransactionNo,intGenServiceNo,dtmServiceDateofUse) VALUES(${results[0].intTransactionNo},${genServiceNo},"${dateOfUse}")`,(err,results,fields)=>{
	if(err)console.log("2"+err);
	db.query(`SELECT * from tblEvent WHERE intEventNo=${req.body.currentEvent}`, (err,eventDetails, fields) =>{
		console.log(eventDetails);
		if(err)console.log("3"+err);
	res.render('organizer/views/ItemService', {profile:profile,eventdetails:eventDetails, currevent:`${req.body.currentEvent}`,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});
	});
	});

});

router.post('/AddItem', (req,res)=>{

var profile= req.session.user;
			var itemNo=`${req.body.itemreq}`;
	var currentEventNo=`${req.body.currentEvent}`;
	var dateOfUse=`${req.body.dateOfUse}`+' '+`${req.body.timeOfUse}`+':00';
	console.log(dateOfUse);

	db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${currentEventNo}`,(err,results,fields)=>{
		if(err)console.log("1"+err);
		console.log(results);
		db.query(`INSERT INTO tblRental(intTransactionNo,intItemNo,dtmRentalDateofUse) VALUES(${results[0].intTransactionNo},${itemNo},"${dateOfUse}")`,(err,results,fields)=>{
	if(err)console.log("2"+err);
db.query(`SELECT * from tblEvent WHERE intEventNo=${req.body.currentEvent}`, (err,eventDetails, fields) =>{
	console.log(eventDetails);
	if(err)console.log("3"+err);
	res.render('organizer/views/ItemService', {profile:profile,eventdetails:eventDetails, currevent:`${req.body.currentEvent}`,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});


});
	});
	});
});
router.get('/itemRequest', (req,res)=>{
	res.redirect('/organizer/createEvent');
});

router.post('/AddItemService', (req,res)=>{

var profile= req.session.user;
	var toSearch=`${req.body.searchbox}`.trim();

	console.log(`${req.body.currentEvent}`);
	if(toSearch.length>0){
		db.query(`SELECT * from tblEvent WHERE intEventNo= ${req.body.currentEvent} `, (err,eventDetails, fields) =>{ console.log("${eventDetails[0].dateEventStart}");
			db.query(`SELECT UPPER(LEFT( "${eventDetails[0].dateEventStart}",2)) AS EVENTDAY `, (err,EVENTDAY, fields) =>{
					if(err){console.log(err);}
	console.log("RESULTS");
	console.log(EVENTDAY[0].EVENTDAY);
		db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.currentEvent}`,(err,transactionNum,fields)=>{
	db.query(`SELECT *
			FROM tblGenService JOIN tblProvider ON tblGenService.intProviderID=tblProvider.intProviderID
			WHERE (LOWER(strServiceName) LIKE LOWER("%${toSearch}%")
				OR LOWER(strServiceName) LIKE LOWER("${toSearch}%")
				OR LOWER(strServiceName) LIKE LOWER("%${toSearch}")
				OR LOWER(strServiceDescription) LIKE LOWER("%${toSearch}%")
				OR LOWER(strServiceDescription) LIKE LOWER("${toSearch}%")
				OR LOWER(strServiceDescription) LIKE LOWER("%${toSearch}"))
				AND intGenServiceNo NOT IN(SELECT intGenServiceNo from tblServices WHERE ${transactionNum[0].intTransactionNo}=intTransactionNo)
				AND  strServiceAvailableDay LIKE "%${EVENTDAY[0].EVENTDAY}%" AND intGenServiceStatus=1`, (err,resultsServices, fields) =>{if(err){console.log(err);}

		db.query(`SELECT *
				FROM tblItem JOIN tblProvider ON tblItem.intProviderID=tblProvider.intProviderID
				WHERE (LOWER(strItemName) LIKE LOWER("%${toSearch}%")
					OR LOWER(strItemName) LIKE LOWER("${toSearch}%")
					OR LOWER(strItemName) LIKE LOWER("%${toSearch}")
					OR LOWER(strItemDescription) LIKE LOWER("%${toSearch}%")
					OR LOWER(strItemDescription) LIKE LOWER("${toSearch}%")
					OR LOWER(strItemDescription) LIKE LOWER("%${toSearch}"))
					AND intItemNo NOT IN(SELECT intItemNo from tblRental WHERE ${transactionNum[0].intTransactionNo}=intTransactionNo)
					AND  strItemAvailableDay LIKE "%${EVENTDAY[0].EVENTDAY}%" AND intItemStatus=1
					`, (err,resultsItems, fields) =>{
					console.log(resultsItems);
					console.log(resultsServices);


	res.render('organizer/views/ItemService', {profile:profile,eventdetails:eventDetails, currevent:`${req.body.currentEvent}`,reServices:resultsServices,reItems:resultsItems,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});
		});
		});
		});
	});
	}
	else{
		db.query(`SELECT * from tblEvent WHERE intEventNo= ${req.body.currentEvent} `, (err,eventDetails, fields) =>{
	res.render('organizer/views/ItemService', {profile:profile,eventdetails:eventDetails, currevent:`${req.body.currentEvent}`,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});
}
});

router.post('/ItemService', (req,res)=>{

var profile= req.session.user;
	db.query(`SELECT * from tblEvent WHERE intEventNo=${req.body.eventNo} `, (err,eventDetails, fields) =>{
	res.render('organizer/views/ItemService', {profile:profile,eventdetails:eventDetails, currevent:`${req.body.eventNo}`,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});


});
});
router.post('/itemRequest', (req,res)=>{

var profile= req.session.user;
	var itemNo=`${req.body.itemreq}`;
	var currentEventNo=`${req.body.currentEvent}`;
	var dateOfUse=`${req.body.dateOfUse}`+' '+`${req.body.timeOfUse}`+':00';
	console.log(dateOfUse);


	db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${currentEventNo}`,(err,results,fields)=>{
		if(err)console.log("1"+err);
		console.log(results);
		db.query(`INSERT INTO tblRental(intTransactionNo,intItemNo,dtmRentalDateofUse) VALUES(${results[0].intTransactionNo},${itemNo},"${dateOfUse}")`,(err,results,fields)=>{
	if(err)console.log("2"+err);
db.query(`select intEventNo from tblevent WHERE intOrganizerID=${req.session.user.intOrganizerID} order by 1 desc limit 1 `, (err,currenteventno, fields) =>{
			if(err)console.log("3"+err);
				res.render('organizer/views/chooseSpecificItemService', {profile:profile,currevent:currenteventno,reServices:[],reItems:[],user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
			});
	});
	});
});


router.post('/ViewItemServiceForCancelled', (req,res)=>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (0,1,2,3)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (0,1,2,3)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemServiceForCancelled', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});
});

router.post('/ViewItemServiceForRecent', (req,res)=>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (0,1,2,3)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (0,1,2,3)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemServiceForRecent', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});
});

router.post('/ViewItemService', (req,res)=>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});
});

router.post('/requestCancelled', (req,res)=>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus =3`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  * ,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus =3`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/requestCancelled', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});
});

router.post('/cancelItemTransaction', (req,res)=>{

var profile= req.session.user;
	db.query(`UPDATE tblRental SET intRentalStatus=3 WHERE intTransactionNo=${req.body.transactionno} AND intItemNo=${req.body.itemno}` , (err,results, fields) =>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});});

});


router.post('/cancelServiceTransaction', (req,res)=>{

var profile= req.session.user;
		db.query(`UPDATE tblServices SET intServiceStatus=3 WHERE intTransactionNo=${req.body.transactionno} AND intGenServiceNo=${req.body.genserviceno}` , (err,results, fields) =>{

var profile= req.session.user;

db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});
});

});

router.post('/requestCancelledItem', (req,res)=>{

var profile= req.session.user;
	db.query(`UPDATE tblRental SET intRentalStatus=1 WHERE intTransactionNo=${req.body.transactionno} AND intItemNo=${req.body.itemno}` , (err,results, fields) =>{


db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});


});
});

router.post('/requestCancelledService', (req,res)=>{
      var profile= req.session.user;
		db.query(`UPDATE tblServices SET intServiceStatus=1 WHERE intTransactionNo=${req.body.transactionno} AND intGenServiceNo=${req.body.genserviceno}` , (err,results, fields) =>{
            if(err)console.log(err);


db.query(`SELECT * FROM tblEvent WHERE  intEventNo= ${req.body.eventNo}`,(err,eventDetails,fields)=>{  console.log(eventDetails);if(err)console.log(err);
db.query(`SELECT intTransactionNo FROM tblTransaction WHERE intEventNo= ${req.body.eventNo}`,(err,results,fields)=>{console.log(results);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblServices.dtmServiceDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblServices JOIN tblGenService ON  tblGenService.intGenServiceNo=tblServices.intGenServiceNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblGenService.intProviderID
	WHERE   tblServices.intTransactionNo=${results[0].intTransactionNo} AND  tblServices.intServiceStatus in (1,2,3,0)`,(err,services,fields)=>{console.log(services);if(err)console.log(err);
db.query(`SELECT  *,DATE_FORMAT(tblRental.dtmRentalDateofUse, "%M %e, %Y %r") AS dateofUse
	 FROM  tblRental JOIN tblItem ON  tblItem.intItemNo=tblRental.intItemNo
		                     JOIN tblProvider ON tblProvider.intProviderID =tblItem.intProviderID
	WHERE   tblRental.intTransactionNo=${results[0].intTransactionNo} AND intRentalStatus in (1,2,3,0)`,(err,items,fields)=>{console.log(items);if(err)console.log(err);

res.render('organizer/views/ViewItemService', {profile:profile,currevent:`${req.body.eventNo}`,eventdetails:eventDetails, service:services,item:items, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});});});});


});
});
router.post('/updateDetails', (req,res)=>{

var profile= req.session.user;

	db.query(`UPDATE tblEvent SET strEventDescription="${req.body.eventdescription}",strEventName="${req.body.eventname}",intEstimatedNumberofGuest="${req.body.estimatednumberofguest}" WHERE intEventNo = ${req.body.eventID}` , (err,results, fields) =>{
    if(err)
		console.log(err);
	else
	res.redirect('/organizer/upcomingEvents');
	});
	});

	router.get('/updateDetails', (req,res)=>{

	res.redirect('/organizer/upcomingEvents');
	});

router.get('/unpaidAccounts', (req,res)=>{

var profile= req.session.user;
    res.render('organizer/views/unpaidAccounts', {profile:profile,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});


router.get('/paidAccounts', (req,res)=>{

var profile= req.session.user;
    res.render('organizer/views/paidAccounts', {profile:profile,user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
});



exports.organizer = router;
