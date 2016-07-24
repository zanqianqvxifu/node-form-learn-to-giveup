var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	 title: '主页',
  	 user:req.session.user,
  	 success:req.flash('success').toString(),
  	 error:req.flash('success').toString()
  });
});
router.get('/login',checknotlogin)
router.get('/login',function(req,res,next){
	res.render('login',{
		title: 'login',
		user:req.session.user,
		success:req.flash('success').toString(),
	 	error:req.flash('success').toString()
	})
});
router.post('/login',checknotlogin)
router.post('/login',function(req,res,next){
	//生成md5值
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	//检查用户是否存在
	User.get(req.body.name,function(err,user){
		if(!user){
			error:req.flash('error','用户不存在');
			return res.redirect('/login');
		}
		//检查密码是否一致
		if(user.password != password){
			console.log('wrongpass')
			success:req.flash('error','密码错误');
			return res.redirect('/login');
		}
		//用户信息一致后将信息存入session
		req.session.user = user;
		success:req.flash('success','成功！');
		res.redirect('/');
	})
});
router.get('/reg',checknotlogin)
router.get('/reg',function(req,res,next){
	res.render('reg',{
		title: 'reg',
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('success').toString()
	});
});
router.post('/reg',checklogin)
router.post('/reg',function(req,res,next){
	var name = req.body.name,
		password = req.body.password,
		repassword = req.body.conpassword
	//检验两次用户输入是否一致
	if(repassword != password){
		console.log('if same')
		error:req.flash('error','两次输入不一致');
		return res.redirect('/reg');
	}
	//生成md5
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name:name,
		password:password,
		email:req.body.email
	});
	//检查用户名是否存在
	User.get(newUser.name,function(err,user){
		console.log('if had');
		if(err){
			error:req.flash('error','err');
			return res.redirect('/reg');
		}
		if(user){
			console.log('already had')
			error:req.flash('error','用户名已存在，客官再换一个吧');
			return res.redirect('/reg')
		};
		//如果用户不存在则新增用户
		newUser.save(function(err,user){
			if(err){
				error:req.flash('error',err);
				return res.redirect('/reg');
			}
			console.log('success')
			req.session.user = newUser;//用户信息存入session
			success:req.flash('success','注册成功');
			return res.redirect('/reg');
		})
	})
});
// router.get('/post',checknotlogin)
router.get('/post',function(req,res,next){
	res.render('post',{title:'post'})
});
// router.post('/post',checklogin)
router.post('/post',function(req,res,next){
	var currentUser = req.session.user,
		post = new Post(currentUser.name,req.body.title,req.body.post);
	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/')
		}
		req.flash('success','发布成功');
		res.redirect('/article')
	})
});
router.get('/logout',function(req,res,next){
	res.render('logout',{
		title: 'logout',
		users:req.session.user = null,
		success:req.flash('success','成功'),
		error:req.flash('error','错误')
	})
});
router.get('/article',function(req,res,next){
	Post.getAll(null,function(err,posts){
		if(err){
			posts = []
		}
		res.render('article',{
			title:'article',
			posts:posts,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		})
	})
});
router.get('/u/:name',function(req,res){
	//检查用户
	User.get(req.params.name,function(err,user){
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		//查询并返回该用户所有文章
		Post.getAll(user.name,function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('user',{
				title:user.name,
				posts:posts,
				user:req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			})
		})
	})
});
router.get('/u/:name/:day/:title',function(req,res){
	Post.getone(req.params.name,req.params.day,req.params.title,function(err,post){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}
		res.render('article',{
			title:req.params.title,
		      post: post,
		      user: req.session.user,
		      success: req.flash('success').toString(),
		      error: req.flash('error').toString()
		})
	})
})
function checklogin (req,res,next) {
	if(!req.session.user){
		console.log('notlogin')
		req.flash('error','未登录');
		return res.redirect('/');
	}
	next();
}
function checknotlogin (req,res,next) {
	if(req.session.user){
		req.flash('error','已登录');
		return res.redirect('back');
	}
	//console.log('ok');
	next();
}
module.exports = router;
