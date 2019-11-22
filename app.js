const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/userDB',
		 { useNewUrlParser: true,
		   useUnifiedTopology: true
		 });
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Init App
const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Bring in Models
let User = require('./models/user');
let Doc = require('./models/doc');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', function(req, res){
    res.render('land');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    let user = new User();
    user.name = req.body.name;
    user.password = req.body.password;
    user.projects = [];
    user.save(function(err){
	if(err){
	    console.log(err);
	    return;
	}
	else{
	    res.redirect('/docs/'+req.body.name);
	}
    });
});

app.get('/docs/:name', function(req, res){
    Doc.find({owner: req.params.name}, function(err, docs){
	if(err){
	    console.log(err);
	}
	else{
	    name=req.params.name;
	    res.render('docs', {
		name: name,
		docs: docs
	    });
	}
    });
});




/*
//Get Single document
app.get('/docs/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
	res.render('article',{
		       article:article
	});
    });
});*/

//Add route
app.get('/docs/:name/add', function(req, res){
    res.render('add_doc');
});

//Add Submit POST Route
app.post('/docs/:name/add', function(req, res){
    let doc = new Doc();
    doc.docname = req.body.docname;
    doc.owner = req.params.name;

    doc.save(function(err){
	if(err){
	    console.log(err);
	    return;
	}
	else{
	    res.redirect('/docs/'+req.params.name);
	}
    });
});

// Load Edit Form
app.get('/docs/:name/edit/:id', function(req, res){
    Doc.findById(req.params.id, function(err, docs){
	res.render('edit_doc',{
	    docs:docs

	});
    });
});

// Update Submit POST Route
app.post('/docs/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
     
    Article.update(query, article, function(err){
	if(err){
	    console.log(err);
	    return;
	}
	else{
	    res.redirect('/');
	}
    });
});



//Start Server
app.listen(3000, function(){
    console.log('server started on port 3000...');
});
