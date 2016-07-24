var mongodb = require('./db');
var markdown = require('markdown').markdown;
function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

//存储
Post.prototype.save = function (cb) {
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+'-'+(date.getMonth()+1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      	date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
	//要存入数据库的文档
	var post = {
		name:this.name,
		time:time,
		title:this.title,
		post:this.post
	};
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return cb(err);
		}
		//文档插入posts集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return cb(err);
			};
			collection.insert(post,{
				safe:true
			},function(err){
				mongodb.close();
				if(err){
					return cb(err);
				}
				return cb(null)
			})
		})
	})
}

//读取
Post.getAll = function (name,cb) {
	mongodb.open(function (err,db) {
		if(err) {
			return cb(err)
		}
		//读取posts集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return cb(err);
			}
			var query = {};
			if(name){
				query.name = name
			}
			//根据juery查询对象
			collection.find(query).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return cb(err)
				}
				//解析markdonw为为html
				docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post)
				})
				cb(null,docs)
			})
		})
	})
}
Post.getone = function (name,day,title,cb) {
	mongodb.open(function(err,db){
		if(err){
			return cb(err)
		}
		//度posts集合
		mongodb.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return cb(err);
			}
			//根据用户名，日期，文章名进行查询
			collection.findOne({
				'name':name,
				'time.day':day,
				'title':title
			},function(err,doc){
				mongodb.close();
				if(err){
					return cb(err)
				}
				doc.post = markdown.toHTML(doc.post);
				cb(null,doc)
			})
		})
	})
}