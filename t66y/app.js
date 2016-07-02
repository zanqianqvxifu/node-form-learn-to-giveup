var express = require('express'),
	superagent = require('superagent'),
	cheerio = require('cheerio');
var app = express();

app.get('/',function(req,res,next){
	//用superagent获取网页中的资源
	superagent.get('http://www.imooc.com/index/search?words=node')
	//superagent end方法中传入回调函数，这个函数接受两个参数，一个错误参数，一个获取的网页资源
		.end(function(err,sres){
			if(err){
				res.send(err);
				alert('err')
			}
		//调用chreeio中的load方法将superagent获取的网页资源缓存到$中；
		var $ = cheerio.load(sres.text);
		//创建容器
		var item = [];
		//获取资源中的指定资源并便利
			$('.search-course .introduction').each(function(key,val){
				var $ele = $(val);
				item.push({
					title:$ele.find('.title.autowrap').text(),
					courseT:$ele.find('.description.autowrap').text(),
					courseChartper:$ele.find('.chapter.autowrap').text()
				})
			})
			res.send(item);
		})
		
}).listen(3000,function(){
	console.log('run')
})