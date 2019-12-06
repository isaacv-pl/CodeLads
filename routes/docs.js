const express = require('express')
const router = express.Router();

// Bring in Docs model
let Doc = require('../models/doc');

//Add route
router.get('/:name/add', function(req, res){
    res.render('add_doc');
});

//Add Submit POST Route
router.post('/:name/add', function(req, res){
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
	doc.owner = req.params.name;

	doc.save(function(err){
	    if(err){
		console.log(err);
		return;
	    }
	    else{
		req.flash('success', 'Document Added');
		res.redirect('/docs/'+req.params.name);
	    }
	});
    }
});

// Load Edit Form
router.get('/:name/edit/:id', function(req, res){
    Doc.findById(req.params.id, function(err, docs){
	res.render("index.pug", {
	    docs:docs
	});
    });
});

// Update Submit POST Route
router.post('/:name/edit/:id', function(req, res){
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
	    req.flash('success', 'Document updated');
	    res.redirect('/docs/'+req.params.name);
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

router.get('/:name', function(req, res){
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


module.exports = router
