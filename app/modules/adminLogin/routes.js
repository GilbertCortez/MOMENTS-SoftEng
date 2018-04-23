var express = require('express');
var router = express.Router();

router.get('/adminXYZ', (req,res)=>{
        req.session.destroy(err => {
    res.render('adminLogin/views/adminLogin', {alertprovider: 0, alertorganizer: 0, wrongemail: 0});
            });
});

router.get('/logout', (req,res) =>{
    req.session.destroy(err => {
        if (err) throw err;
        // with headers
        res.render('adminLogin/views/adminLogin', {alertprovider: 0, alertorganizer: 0, wrongemail: 0});
    });
});


exports.adminLog = router;
