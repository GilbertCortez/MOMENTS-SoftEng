//THIS IS THE CONTROLLER FOR ADMIN

//module used in this controller
var express = require('express');

//declaration of routes
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();

router.use(authMiddleware.hasAuth);



router.get('/', (req,res) =>{
	 db.query(`SELECT COUNT(*) as appctr FROM tblProvider WHERE intProviderStatus=0 `, (err,applicantCtr,fields) =>{
    res.render('admin/views/adminDashboard',  {applicant:applicantCtr[0].appctr,user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
});
});

router.post('/', (req,res) =>{

    res.render('admin/views/adminDashboard', {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
});

router.get('/confirmationOfBusinessman', (req,res) =>{


      db.query(`SELECT * from \`tblProvider\` where \`intProviderStatus\` = ${0} `, (err,results,fields) =>{
				console.log(results);
        if (results.length < 0 || results.length == 'NULL'){
            res.render('admin/views/confirmationOfBusinessman', {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}` });

        }
        else{
            res.render('admin/views/confirmationOfBusinessman', {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`, content: results} );
        }

      });

});

router.post('/confirmationOfBusinessman', (req,res)=>{
	var Split=`${req.body.location}`.split(",");
	var city=Split[0];
	var province=Split[1];
	console.log(city);
	console.log(province);
    db.query(`UPDATE \`tblProvider\` SET \`strProviderBusinessName\` = "${req.body.businessName}", \`strProviderDTI\` = "${req.body.dti}", \`strProviderBIR\` = "${req.body.bir}", \`intProviderStatus\` = ${1}, \`intAdminID\` = ${req.session.user.intAdminID}, \`strCity\`="${city}" , \`strProvince\`="${province}" where \`intProviderID\` = ${req.body.idnumber} `, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin');
    });
});

router.post('/rejectionOfBusinessman', (req,res)=>{

    db.query(`UPDATE \`tblProvider\` SET  \`intProviderStatus\` = ${2} where \`intProviderID\` = ${req.body.idnumber} `, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin');
    });
});

router.get('/confirmationOfRequest', (req,res)=>{

            res.render('admin/views/confirmationOfRequest', {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});


});

router.post('/approveItemRequest', (req,res)=>{
    db.query(`UPDATE \`tblitem\` SET \`intitemStatus\` = ${1}, \`intAdminID\` = ${req.session.user.intAdminID} where intItemNo = ${req.body.itemno} `, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin/confirmationofRequest');
   });
});

router.post('/approveServiceRequest', (req,res)=>{
   db.query(`UPDATE \`tblgenservice\` SET \`intServiceStatus\` = ${1}, \`intAdminID\` = ${req.session.user.intAdminID} where intgenServiceNo = ${req.body.serviceno} `, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin/confirmationofRequest');
   });
});

router.post('/rejectServiceRequest', (req,res)=>{
   db.query(`UPDATE \`tblgenservice\` SET \`intServiceStatus\` = ${2}, \`intAdminID\` = ${req.session.user.intAdminID} where intgenServiceNo = ${req.body.serviceno}`, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin/confirmationofRequest');
   });
});

router.post('/rejectItemRequest', (req,res)=>{
   db.query(`UPDATE \`tblitem\` SET \`intitemStatus\` = ${2}, \`intAdminID\` = ${req.session.user.intAdminID}  where intItemNo = ${req.body.itemno} `, (err,results,fields)=>{
       if (err) console.log(err);
       res.redirect('/admin/confirmationofRequest');
   });
});

router.get('/allPayments', (req,res)=>{
	db.query(`Select * from tblpayment join tbltransaction on tblpayment.intTransactionNo = tbltransaction.intTransactionNo join tblevent on tblevent.intEventNo = tbltransaction.intEventNo join tblorganizer on tblevent.intOrganizerID = tblorganizer.intOrganizerID `, (err, results, fields)=>{
		if (err) console.log(err);
	//	console.log(results);

		res.render('admin/views/payments',  {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`, content: results});
	});
});

router.post('/confirmPayment', (req,res)=>{
	db.query(`UPDATE tblpayment SET intStatus = ${1}, intAdminID = ${req.session.user.intAdminID}, decAmountPaid = ${req.body.payment} where intPaymentNo = ${req.body.payid} `, (err, results, fields)=>{
		if (err) console.log(err);
		res.redirect('/admin/allPayments');
	});
});

router.post('/rejectPayment', (req,res)=>{
	db.query(`UPDATE tblpayment SET intStatus = ${3}, intAdminID = ${req.session.user.intAdminID} where intPaymentNo = ${req.body.payid} `, (err, results, fields)=>{
		if (err) console.log(err);
		res.redirect('/admin/allPayments');
	});
});

router.get('/eventReport', (req,res)=>{
	db.query(`Select count(*) as allevents from tblEvent`, (err,results,fields)=>{
		if (err) console.log(err);

		res.render('admin/views/eventReport', {selected: 0, count: results[0].allevents, user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
	});
});

router.post('/getEvents', (req,res)=>{

	var month = 0;
  var year = 0;

  if (`${req.body.month}` == 'January'){
    month = 01;
  }
  if (`${req.body.month}` == 'February'){
    month = 02;
  }
  if (`${req.body.month}` == 'March'){
    month = 03;
  }
  if (`${req.body.month}` == 'April'){
    month = 04;
  }
  if (`${req.body.month}` == 'May'){
    month = 05;
  }
  if (`${req.body.month}` == 'June'){
    month = 06;
  }
  if (`${req.body.month}` == 'July'){
    month = 07;
  }
  if (`${req.body.month}` == 'August'){
    month = 08;
  }
  if (`${req.body.month}` == 'September'){
    month = 09;
  }
  if (`${req.body.month}` == 'October'){
    month = 10;
  }
  if (`${req.body.month}` == 'November'){
    month = 11;
  }
  if (`${req.body.month}` == 'December'){
    month = 12;
  }

  if (`${req.body.year}` == 2016){
    year = 2016;
  }
  if (`${req.body.year}` == 2017){
    year = 2017;
  }
  if (`${req.body.year}` == 2018){
    year = 2018;
  }

	db.query(`Select count(*) as allevents from tblEvent where MONTH(tblevent.dateEventStart) = ${month} and YEAR(tblevent.dateEventStart) = ${year};`, (err,results,fields)=>{
		if(err) console.log(err);

			res.render('admin/views/eventReport', {selected: 1, month: `${req.body.month}`, year: `${req.body.year}`, count: results[0].allevents, user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
	});
});

router.get('/customerReport', (req,res)=>{
	db.query(`select count(*) as lahat from tblOrganizer`, (err,results,fields)=>{
		if (err) console.log(err);

		res.render('admin/views/customers', {count: results[0].lahat, user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
	});
});

router.get('/providerReport', (req,res)=>{
	db.query(`select count(*) as lahat from tblProvider`, (err,results,fields)=>{
		if (err) console.log(err);

		res.render('admin/views/provider', {count: results[0].lahat, user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
	});
});

router.get('/allReports', (req,res)=>{
	res.render('admin/views/reports', {user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
});



exports.admin = router;
