var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});
router.get('/123',function(req,res,next){
	res.render('123.ejs',{look:'look'})
});
module.exports = router;
