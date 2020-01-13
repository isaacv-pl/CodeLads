const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const http = require('http');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
//For yjs
const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection;
mongoose.connect('mongodb://heroku_qkbbwftf:i1t11fg9if435691niu8vdbtir@ds263248.mlab.com:63248/heroku_qkbbwftf',
		 { useNewUrlParser: true,
		   useUnifiedTopology: true,
		   useFindAndModify: false
		 });
/*
mongoose.connect('mongodb://localhost/userDB',
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
*/
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
var server = http.createServer(app);

// Bring in Models
let User = require('./models/user');
let Doc = require('./models/doc');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Connect any incoming WebSocket connection to Yjs
var wss = new WebSocket.Server({
  server: server
});
wss.on('connection', function (conn, req) {
  return setupWSConnection(conn, req);
});


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    //set global variable
    res.locals.user = req.user || null;
    next();
});

router.get("/",function(req,res){
    res.render('frontpage.pug');
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
router.get("/test", function(req, res){
    res.render("test.pug")
});


//Route Files
let users = require('./routes/users');
app.use('/users', users);

let docs = require('./routes/docs');
app.use('/docs', docs);

//Start Server
var production = process.env.PRODUCTION != null;
var port = process.env.PORT || 8000;

server.listen(port);
console.log("Listening to http://localhost:".concat(port, " ").concat(production ? '(production)' : ''));
