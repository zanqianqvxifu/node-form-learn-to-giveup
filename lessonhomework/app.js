var eventproxy = require('eventproxy'),
	superagent = require('superagent'),
	cheerio = require('cheerio'),
	url = require('url'),
	express = require('express'),
	async = require('async');
var murl = 'http://www.imooc.com/';
var app = express();

app.get('/',function(req,res,netx){
	var spuer = superagent.get('http://www.imooc.com/course/list?c=fe').end(function(err,srse){
		if(err){
			return next(err);
		};
		var $ = cheerio.load(srse.text);
		var items = [];
		$('.js-course-lists').find('.course-one a').each(function(k,v){
			var $ele = $(v);
			var href = url.resolve(murl,$ele.attr('href'));
			items.push(href);
		});
		var ep = new eventproxy();
		ep.after('goooo',items.length,function(pair){
			var mpair = pair.map(function(toppair){
				var insideurl = toppair[0];
				var insidehtml = toppair[1];
				var $ = cheerio.load(insidehtml);
				return({
					title:$('.hd h2').text(),
					url:insideurl,
					info:$('.auto-wrap').text().trim(),
					chapter:$('.chapter.clearfix').text(),
					count:$('.satisfaction').text(),
					manyperson:$('.person_num').text(),
					name:$('.username').text(),
					say:$('.content-box.content').text()||'say nothing'
				})
			})
			res.send(mpair)
		})
		items.forEach(function(k){
			superagent.get(k).end(function(err,srse){
				console.log(k+'success');
				ep.emit('goooo',[k,srse.text]);
			})
		})
	})
}).listen(3000,function(){
	console.log('run')
})