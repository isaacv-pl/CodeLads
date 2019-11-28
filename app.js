var express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var http = require('http');

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
var app = express();
var router = express.Router();
var curPath = __dirname + '/views/';
var backend = new ShareDB();
var server = http.createServer(app);

// Bring in Models
let User = require('./models/user');
let Doc = require('./models/doc');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

router.get("/",function(req,res){
    console.log("I am here");
    res.sendFile(curPath + "landing.html");
    //res.render('landing.pug');
});

router.get("/index.html",function(req,res){
  res.sendFile(curPath + "landing.html");
});

router.get("/Frontend/index.html",function(req,res){
  res.sendFile(curPath + "landing.html");
});

router.get("/backend/static/index.html",function(req,res){
  res.sendFile(curPath + "index.html");
});

router.get("*/about.html",function(req,res){
  res.sendFile(curPath + "about.html");
});

router.get("*/contact.html",function(req,res){
  res.sendFile(curPath + "contact.html");
});

app.use("/",router);

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
	res.render("index.pug", {
	    docs:docs
	});
    });
});

// Update Submit POST Route
app.post('/docs/:name/edit/:id', function(req, res){
    let doc = {owner: req.params.name, _id: req.params.id};
    doc.content = req.body.content;  
    console.log("This is what I wrote: "+ doc.content);
    let query = {_id:req.params.id}
     
    Doc.updateOne(query, doc, function(err){
	if(err){
	    console.log(err);
	    return;
	}
	else{
	    res.redirect('/docs/'+req.params.name);
	}
    });
});



//Start Server
app.listen(3000, function(){
    console.log('server started on port 3000');
});
