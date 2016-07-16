var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/:usersname',function(req,res,next){
	console.log(req.params.usersname,123);
	next();
});
router.get('/:usersname',function(req,res,next){
	res.send('user'+req.params.usersname);
})
module.exports = router;
