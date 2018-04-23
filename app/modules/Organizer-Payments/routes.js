//THIS IS THE CONTROLLER FOR ORGANIZER
var sanitizer = require('sanitize')();
//module used in this controller
var express = require('express');
var async = require('async');
//declaration of routes
var router = express.Router();
//var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.hasAuth);

var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})

var upload = multer({ storage: storage })


 router.get('/fileupload', (req,res) =>{
	res.render('Organizer-Payments/views/fileupload');
});

 router.get('/fileuploads', (req,res) =>{
	res.render('Organizer-Payments/views/fileuploadview');
});

 router.post('/uploaddeposit', upload.any(), (req,res) =>{
 var filedir="/uploads/"+req.files[0].filename;

	db.query(`INSERT INTO tblpayment(intTransactionNo,strDepositSlip) VALUES("${req.body.transno}","${filedir}")`, (err,results, fields) =>{
    console.log(err);
  res.redirect('/organizerpayment/unpaidAccounts');
	});
});

router.get('/unpaidAccounts', (req,res)=>{


var profile= req.session.user;
	db.query(`SELECT *, DATE_FORMAT(dateEventStart , "%M %e, %Y %r") AS start,
				DATE_FORMAT(dateEventEnd , "%M %e, %Y %r") AS end, SUM(decServiceFinalPrice)+SUM(decRentalFinalPrice) as totbill
				FROM tblEvent JOIN tblServices ON tblEvent.intEventNo=tblServices.intTransactionNo JOIN tblRental ON tblEvent.intEventNo=tblRental.intTransactionNo
				WHERE now()<dateEventEnd AND boolEventStatus=true AND ${req.session.user.intOrganizerID}=intOrganizerID AND intRentalStatus = 2 AND intServiceStatus = 2 AND (intEventNo in
				(SELECT intTransactionNo FROM tblrental WHERE intRentalStatus = 2) OR intEventNo in
				(SELECT intTransactionNo FROM tblservices WHERE intServiceStatus = 2)) AND intEventNo in
				(SELECT intTransactionNo FROM tblpayment WHERE intStatus = 0)`, (err,results, fields) =>{
					console.log("RESUULTS:"+results);
		res.render('Organizer-Payments/views/unpaidAccounts', {profile:profile,re:results, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});

});
});

router.get('/paidAccounts', (req,res)=>{

var profile= req.session.user;
	db.query(`SELECT *, DATE_FORMAT(dateEventStart , "%M %e, %Y %r") AS start,
				DATE_FORMAT(dateEventEnd , "%M %e, %Y %r") AS end, SUM(decServiceFinalPrice)+SUM(decRentalFinalPrice) as totbill
				FROM tblEvent JOIN tblServices ON tblEvent.intEventNo=tblServices.intTransactionNo JOIN tblRental ON tblEvent.intEventNo=tblRental.intTransactionNo
				WHERE now()<dateEventEnd AND boolEventStatus=true AND ${req.session.user.intOrganizerID}=intOrganizerID AND intRentalStatus = 2 AND intServiceStatus = 2 AND (intEventNo in
				(SELECT intTransactionNo FROM tblrental WHERE intRentalStatus = 2) OR intEventNo in
				(SELECT intTransactionNo FROM tblservices WHERE intServiceStatus = 2)) AND intEventNo in
				(SELECT intTransactionNo FROM tblpayment WHERE intStatus = 1)`, (err,results, fields) =>{

		res.render('Organizer-Payments/views/paidAccounts', {profile:profile,re:results, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});

});
});





exports.organizerpayment = router;
