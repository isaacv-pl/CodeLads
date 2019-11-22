let mongoose = require('mongoose');

let docSchema = mongoose.Schema({
    docname:{
	type: String,
	required: true
    },
    owner:{
	type: String,
	required: true
    },
    directoryPath:{
	type: String,
	required: false
    },
    people:{
	type: [String],
	required: false
    },
    content:{
	type: String,
	required: false
    }
});

let Doc = module.exports = mongoose.model('Doc', docSchema);
