var express = require('express'),
	superagent = require('superagent'),
	cheerio = require('cheerio');

var app = express();
app.get('/',function(req,res,next){
	//superagent.get方法获取输入的url中的节点
	superagent.get('https://cnodejs.org')
	.end(function(err,sres){
		if(err){
			return next(err);
		}
		//cheerio.load负责解析获取的文件
		var $ = cheerio.load(sres.text);
		//容器
		var items = [];
		//获取id为opic_list下的类名为topic_title下的元素
		$('#topic_list .topic_title').each(function(idx,ele){
			var $ele = $(ele);
			items.push({
				title:$ele.attr('title'),
				href:$ele.attr('href')
			});
		});
		res.send($ele);
	});
});

app.listen(3000,function(){
	console.log('app run at 3000')
})