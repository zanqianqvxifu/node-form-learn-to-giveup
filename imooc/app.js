var express = require('express'),
	superagent = require('superagent'),
	cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	url = require('url');

var app = express();

app.get('/',function(req,res,next){
	superagent.get('http://www.imooc.com/course/list?c=fe').end(function(err,sres){
		if(err){
			return next(err);
		}
		var $ = cheerio.load(sres.text);
		var items = [];
		$('.js-course-lists').find('.course-one a').each(function(key,val){
			var $ele = $(val);
			items.push({title:$ele.attr('href')})
		});
		res.send(items);
	})
}).listen(3000,function(){
	console.log('run')
})