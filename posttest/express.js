var express = require('express');

var app = express.createServer();

app.use(express.bodyParser());

app.all('/',function(req,res){
	res.send(req.body.titile + req.body.text)
}).listen('3000',function(){
	console.log('run');
})

