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
	required:true
    }
    people:{
	type: [String],
	required: true
    }
});

let Doc = module.exports = mongoose.model('Doc', docSchema);
