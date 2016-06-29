var express = require('express');
var app = express();

app.get('/',function(res,req){
	req.send('im runing');
});
app.listen(3000,function(){
	console.log('app has ran');
});