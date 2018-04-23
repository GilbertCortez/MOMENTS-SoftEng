
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
 router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
    // with headers
          req.session.destroy(err => {
	res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 0});
               });
});





router.post('/organizerLogin',(req,res)=>{


    //console.log(`${req.body.password}`);

    db.query(`SELECT * from \`tblorganizer\` where "${req.body.email}" = \`strOrganizerEmail\` AND sha("${req.body.password}") = \`strOrganizerPassword\` `, (err,results, fields) =>{

        //console.log(fields[0]);
        if (results.length == 0 || results == 'undefined' || results == 'NULL'){
            // with headers
            res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 1});
        }
        //console.log(results);
        else if (results.length > 0) {
            req.session.user = results[0];
            var profile= req.session.user;
         	db.query(`SELECT COUNT(*) as upcomingctr FROM tblEvent WHERE now()<dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,upcomingctr, fields) =>{ console.log(upcomingctr);
	db.query(`SELECT COUNT(*) as recentctr FROM tblEvent WHERE now()>dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,recentctr, fields) =>{console.log("profile"); console.log(req.session.user);
    res.render('organizer/views/organizerDashboard', {profile:profile,rectr:recentctr[0].recentctr,upctr:upcomingctr[0].upcomingctr, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
	});
	});
		}
    });

});




//MAY BINAGO SI GILBERT
router.post('/organizerSignup', (req,res)=>{

    db.query(`SELECT * from tblOrganizer where strOrganizerEmail = "${req.body.email}"`, (err,resu,fie)=>{
        if (resu.length > 0){
            // with headers
            res.render('login/views/login', {alertprovider: 0, alertorganizer: 1, wrongemail: 0});
        }
        else{




    db.query(`SET @p0="${req.body.fname}"; SET @p1="${req.body.mname}"; SET @p2="${req.body.lname}"; SET @p3="${req.body.email}"; SET @p4=sha("${req.body.password}"); SET @p5="${req.body.telNo}"; SET @p6="${req.body.cpNo}"; SET @p7="${req.body.businessname}"; CALL sproc_orgSignup(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7); `, (err,results,fields)=>{
        if (err) console.log(err);
        else{
          db.query(`SELECT * from \`tblorganizer\` where "${req.body.email}" = \`strOrganizerEmail\` AND sha("${req.body.password}") = \`strOrganizerPassword\` `, (err,results, fields) =>{
        console.log(results);
        //console.log(fields[0]);
        if (results.length == 0 || results == 'undefined' || results == 'NULL'){
            // with headers
            res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 1});
        }
        //console.log(results);
        else if (results.length > 0) {
			//console.log("Pasok na");
            req.session.user = results[0];
            var profile= req.session.user;
       	db.query(`SELECT COUNT(*) as upcomingctr FROM tblEvent WHERE now()<dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,upcomingctr, fields) =>{ console.log(upcomingctr);
	db.query(`SELECT COUNT(*) as recentctr FROM tblEvent WHERE now()>dateEventEnd AND
				boolEventStatus=true AND intOrganizerID=${req.session.user.intOrganizerID}`, (err,recentctr, fields) =>{console.log(recentctr);
    res.render('organizer/views/organizerDashboard', {profile:profile,rectr:recentctr[0].recentctr,upctr:upcomingctr[0].upcomingctr, user: `${req.session.user.strOrganizerFName}`+" "+ `${req.session.user.strOrganizerLName}`});
	});
	});
	   }
    });
        }
        // VALIDATE IF EMAIL EXISTS
    });

           }
    });


});

router.post('/businessmanLogin', (req,res)=>{
    db.query(`SELECT * from \`tblprovider\` where "${req.body.email}" = \`strProviderEmail\` AND sha("${req.body.password}") = \`strProviderPassword\`  `, (err, results, fields) =>{
        if (results.length == 0 || results == 'undefined' || results == 'NULL'){
            // with headers
            res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 1});

        }
        else if (results.length > 0){
            req.session.user = results[0];

            if (req.session.user.intProviderStatus == 0 || req.session.user.intProviderStatus == 2 ){
                var profile = req.session.user;
                res.render('businessman/views/businessmanPending', {profile: profile, user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`} );
            }
            else{
                var service = 0;
                var rental = 0;
                var total = 0;

                db.query(`Select count(*) as C from tblservices join tblgenservice on tblservices.intgenserviceno = tblgenservice.intgenserviceno where tblgenservice.intproviderid = ${req.session.user.intProviderID} AND tblServices.intServiceStatus = ${1}`, (err, resu, fieldsu)=>{
					if (resu.length < 0 || resu == 'undefined' || resu == 'NULL'){
						service = 0;
					}
					else{
						service = resu[0].C;
					}

                    db.query(`Select count(*) as I from tblrental join tblitem on tblrental.intitemno = tblitem.intitemno where tblitem.intproviderid = ${req.session.user.intProviderID} AND tblrental.intrentalStatus = ${1}`, (err,resuu, fieldsuu)=>{
						if (resuu.length < 0 || resuu == 'undefined' || resuu == 'NULL'){
							rental = 0;
						}
						else{
							rental = resuu[0].I;
						}


                        total = service + rental;

                        var profile = req.session.user;
                        console.log(profile);
                        res.render('businessman/views/BusinessmanDashboard', {profile: profile, transact: total, user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`});
                    });

                });
            }
        }

    });
});



router.post('/adminLogin', (req,res)=>{
    db.query(`SELECT * FROM \`tblAdmin\` where "${req.body.email}" = \`strAdminEmail\` AND sha("${req.body.password}") = \`strAdminPassword\`  `, (err,results,fields)=>{
        if (results.length == 0 || results == 'undefined' || results == 'NULL'){
            res.render('adminLogin/views/adminLogin', {alertprovider: 0, alertorganizer: 0, wrongemail: 1});
        }
        else if (results.length > 0){
            req.session.user = results[0];
            console.log(req.session.user);
            db.query(`SELECT COUNT(*) as appctr FROM tblProvider WHERE intProviderStatus=0 `, (err,applicantCtr,fields) =>{
    res.render('admin/views/adminDashboard',  {applicant:applicantCtr[0].appctr,user: `${req.session.user.strAdminFName}`+" "+`${req.session.user.strAdminLName}`});
    });
        }
    });
});



router.post('/businessmanSignup', (req,res)=>{
  var Split=`${req.body.location}`.split(",");
  var city=Split[0];
  var province=Split[1];
    db.query(`SELECT * from tblProvider where "${req.body.bemail}" = strProviderEmail`, (err,results,fields) =>{
        if (results.length > 0){
            console.log(results);
            // with headers
            res.render('login/views/login', {alertprovider: 1, alertorganizer: 0, wrongemail: 0});

        }
        else{
            db.query(`SET @p0="${req.body.fname}"; SET @p1="${req.body.mname}"; SET @p2="${req.body.lname}"; SET @p3="${req.body.btelno}"; SET @p4="${req.body.bcpno}"; SET @p5="${req.body.bemail}"; SET @p6=sha("${req.body.bpassword}"); SET @p7="${req.body.businessName}"; SET @p8="${req.body.dti}"; SET @p9="${req.body.bir}"; SET @p10="${req.body.bankname}"; SET @p11="${req.body.bankno}"; SET @p12="${city}"; SET @p13="${province}"; CALL sproc_prvSignup(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12, @p13); `, (err,results,fields)=>{
                if (err) console.log(err);

                else{
                    db.query(`SELECT * from tblProvider where strProviderEmail = "${req.body.bemail}" AND strProviderPassword = sha("${req.body.bpassword}")`, (erra,resulta,fielda) => {
						if (erra) console.log(erra);
						console.log(resulta);
                        if (resulta.length == 0 || resulta == 'undefined' || resulta == 'NULL'){
                            // with headers
                            res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 1});
                        }
                        else if (resulta.length > 0){
                            req.session.user = resulta[0];
                            var profile = req.session.user;
							console.log(req.session.user.intProviderStatus);
                            if (req.session.user.intProviderStatus == 0 || req.session.user.intProviderStatus == 2){
                                res.render('businessman/views/businessmanPending', {profile: profile,user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`} );
                            }
                            else{
                                var service = 0;
                                var rental = 0;
                                var total = 0;

                                db.query(`Select count(*) as C from tblservices join tblgenservice on tblservices.intgenserviceno = tblgenservice.intgenserviceno where tblgenservice.intproviderid = ${req.session.user.intProviderID} AND tblServices.intServiceStatus = ${1}`, (err, resu, fieldsu)=>{
                                    service = resu[0].C;
                                    db.query(`Select count(*) as I from tblrental join tblitem on tblrental.intitemno = tblitem.intitemno where tblitem.intproviderid = ${req.session.user.intProviderID} AND tblrental.intrentalStatus = ${1}`, (err,resuu, fieldsuu)=>{
                                        rental = resuu[0].I;

                                        total = service + rental;

                                        var profile = req.session.user;
                                        res.render('businessman/views/BusinessmanDashboard', {profile: profile,transact: total, user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`});
                                    });

                                });
                            }
                        }
                    });
                }


            });
        }
    });

});


router.get('/logout', (req,res) =>{
    req.session.destroy(err => {
        if (err) throw err;
        res.render('login/views/login', {alertprovider: 0, alertorganizer: 0, wrongemail: 0});
    });
});




exports.login = router;
