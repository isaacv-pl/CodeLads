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

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/Frontend/index.html'));
});

//Start Server
app.listen(3000, function(){
    console.log('server started on port 3000...');
});
