/* jshint unused:false */



'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
// var Task = traceur.require(__dirname + '/../models/task.js');
// var Mongo = require('mongodb');

exports.register = (req, res)=>{
	User.register(req.body, user=>{
		req.session.userId = user._id;
		res.redirect('users/dashboard');
	});
};

exports.login = (req, res)=>{
	User.login(req.body, user=>{
		req.session.userId = user._id;
		res.redirect('users/dashboard');
	});
};

exports.search = (req, res)=>{
  var id = req.session.userId;
  User.findByUserId(id, user=>{
    res.render('users/search', {user: user});
  });
};

exports.lookup = (req, res, next)=>{
  User.findByUserId(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};

exports.update = (req,res)=>{
  User.findByUserId(req.session.userId, u=>{
    u.updateIntake(req.body, ()=>{
      u.updateStats(u, ()=>{
        res.render('users/dashboard', {user:u});
      });
    });
  });
};

exports.dashboard = (req, res)=>{
  User.findByUserId(req.session.userId, u=>{
    res.render('users/dashboard',{user:u});
  });
};
