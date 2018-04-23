var express = require('express');
var router = express.Router();

router.get('/', (req,res) =>{
    res.render('test/views/test');
});

exports.test = router;
