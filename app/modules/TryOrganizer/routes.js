//THIS IS THE CONTROLLER FOR ORGANIZER
var sanitizer = require('sanitize')();
//module used in this controller
var express = require('express');
var async = require('async');
//declaration of routes
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.hasAuth);

 

router.get('/itemSL', (req,res)=>{
	console.log("HELLO");
    res.render('organizer/views/itemServiceList');
});


exports.organizer = router;
