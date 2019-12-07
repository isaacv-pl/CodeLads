const express = require('express')
const router = express.Router();

// Bring in Docs model
let Doc = require('../models/doc');
// Bring in User model
let User = require('../models/user');

//Add route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_doc');
});

//Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('docname', 'Filename is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
	res.render('add_doc',{
	    title:'Add Document',
	    errors:errors
	});
    }
    else{
	let doc = new Doc();
	doc.docname = req.body.docname;
	//doc.owner = req.params.name;
	doc.owner = req.user._id;
	
	doc.save(function(err){
	    if(err){
		console.log(err);
		return;
	    }
	    else{
		req.flash('success', 'Document Added');
		res.redirect('/docs/');
	    }
	});
    }
});

// Share Submit POST Route
router.post('/share/:id', ensureAuthenticated, function(req, res){
    User.find({username: req.body.userfriend}, function(err,data){
	if(err){
	    console.log(err);
	}
	else if(data.length == 0){
	    req.flash('danger', 'Username '+req.body.userfriend+' Not Found');
	    res.redirect('/docs/');
	}
	else{
	    Doc.findByIdAndUpdate(req.params.id, { "$push": { "people": req.body.userfriend } }, { "new": true, "upsert": true }, function (err, doc) {
		if(err){
		    console.log(err);
		}
		else{
		    req.flash('success', 'Shared '+doc.docname+' with '+req.body.userfriend);
		    res.redirect('/docs/');
		}
	    });
    	}
    });
});

/*
Doc.findById(req.params.id, function(err, ddoc){
		let doc = {owner: req.user._id, _id: req.params.id};
		console.log("type of people array: "+ typeof ddoc.people)
		console.log("Before update; This is people: "+ ddoc.people);
		if (typeof ddoc.people != 'undefined' && ddoc.people.length > 0){
		    doc.people = ddoc.people.push(req.body.userfriend);
		}
		else{
		    doc.people = [req.body.userfriend];
		}
		console.log("After update; This is people: "+ doc.people);
		console.log("This should have been inserted: "+ req.body.userfriend);
		let query = {_id:req.params.id}

		Doc.updateOne(query, doc, function(err){
		    if(err){
			console.log(err);
			return;
		    }
		    else{
			req.flash('success', 'Shared '+ddoc.docname+' with '+req.body.userfriend);
			res.redirect('/docs/');
		    }
		});
	    });

*/

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    /*if(doc.owner != req.user._id)
req.flsh('danger', "Not Authorized");
res.redirect('/');
}
*/
    Doc.findById(req.params.id, function(err, docs){
	res.render("index.pug", {
	    docs:docs
	});
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let doc = {owner: req.user._id, _id: req.params.id};
    doc.content = req.body.content;  
    console.log("This is what I wrote: "+ doc.content);
    let query = {_id:req.params.id}
     
    Doc.updateOne(query, doc, function(err){
	if(err){
	    console.log(err);
	    return;
	}
	else{
	    req.flash('success', 'Document updated');
	    res.redirect('/docs/');
	}
    });
});

// Deleting doc
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}
    Doc.deleteOne(query, function(err){
	if(err){
	    console.log(err);
	}
	else{
	    res.send('Success');
	}
    });
});

router.get('/', ensureAuthenticated, function(req, res){
    Doc.find({owner: req.user._id}, function(err, docs){
	if(err){
	    console.log(err);
	}
	else{
	    name=req.user._id;
	    res.render('docs', {
		name: name,
		docs: docs
	    });
	}
    });
});

//Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
	return next();
    }
    else{
	req.flash('danger', 'Please login');
	res.redirect('users/login')
    }
}


module.exports = router
