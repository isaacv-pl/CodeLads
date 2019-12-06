const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in user Model
let User = require('../models/user');

//Register Form
router.get('/register', function (req,res){
    res.render('register');
});

//Register Process
router.post('/register', function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    console.log("Does username exist: " + username);

    let errors = req.validationErrors();

    if(errors){
	res.render('register',{
	    errors:errors
	});
    }
    else{
	let newUser = new User({
	    name:name,
	    username:username,
	    password:password
	});
	console.log("Did newUser get username: "+ newUser.username);
	bcrypt.genSalt(10, function(err, salt){
	    bcrypt.hash(newUser.password, salt, function(err, hash){
		if(err){
		    console.log(err);
		}
		newUser.password = hash;
		newUser.save(function(){
		    if(err){
			console.log(err);
			return;
		    }
		    else{
			req.flash('success', 'You are now registered and can log in');
			res.redirect('/users/login');
		    }
		});
	    });
	});
    }
});

// Login Form
router.get('/login', function(req,res){
    res.render('login');
});

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});

// Login Process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
	successRedirect:'/docs/',
	failureRedirect:'/users/login',
	failureFlash: true
    })(req, res, next);
});

module.exports = router;
