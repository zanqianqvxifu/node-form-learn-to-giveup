var eventproxy = require('eventproxy'),
	superagent = require('superagent'),
	cheerio = require('cheerio'),
	url = require('url');
var cnurl = 'https://cnodejs.org/';

superagent.get(cnurl).end(function(err,sres){
	if(err){
		return console.log(err,123);
	}
	var topUrl = [];
	var $ = cheerio.load(sres.text);
	$('#topic_list').find('.topic_title').each(function(key,val){
		var $ele = $(val);
		var href = url.resolve(cnurl,$ele.attr('href'));
		topUrl.push(href);
	});
	//console.log(topUrl);
	var ep =new eventproxy();
	ep.after('topic_html',topUrl.length,function(topics){
		topics = topics.map(function(topicPair){
			var topicUrl = topicPair[0];
			var topicHtml = topicPair[1];
			var $ = cheerio.load(topicHtml);
			return ({
				title:$('.topic_title').text().trim(),
				href:topicUrl,
				comment1: $('.reply_content').eq(0).text().trim()
			})
		})
		console.log(topics,1234567789)
	});
	topUrl.forEach(function(topicUrl){
		superagent.get(topicUrl).end(function(err,sres){
			console.log('fetch ' + topicUrl + ' successful');
			ep.emit('topic_html', [topicUrl, sres.text]);
		})
	})
})