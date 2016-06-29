var express = require('express');
var utility = require('utility');
var app = express();

app.get('/',function(req,res){
	var q = req.query.q;
	var md5v = utility.md5(q);
	res.send(md5v);
	console.dir(req.query)
});

app.listen(3000,function(){
	console.log('app has ran');
});