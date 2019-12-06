var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const { parse } = require('querystring');
const http = require('http');const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
	collectRequestData(req, result => {
	    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("userDB")
		var myobj = { f_name: result.fname, l_name:result.lname };
		dbo.collection("users").insert(myobj, function(err, res) {
		    if (err) throw err;
		    console.log("1 document inserted");
		    db.close();
		});
	    }); 

        console.log(result);
        res.end(`Parsed data belonging to ${result.fname}`);
    });
    }
    else {
      res.end(`
        <!doctype html>
        <html>
<meta charset="utf-8">
<title>Login to CodeLads</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
        <body>


<div id="container">
  <h1 id="title">CodeLads Login</h1>
    <form name="form" onsubmit="put();" method="post">
    First name: <input name="fname" type="text"><br>
    Last name: <input name="lname" type="text"><br>
    <input type="submit" value="Log In" >
  </form>
 </div>
        </body>
        </html>
      `);
    }
});server.listen(1234);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}
