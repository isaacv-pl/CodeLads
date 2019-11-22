let mongoose = require('mongoose');

let projectSchema = mongoose.Schema({
    projName:{
	type: String,
	required: true
    },
    files:{
	type: [Schema.Types.ObjectId],
	required: true
    },
    owner:{
	type: String,
	required: true
    },
    people:{
	type: [String],
	required: true
    }
});

let Proj = module.exports = mongoose.model('Proj', projSchema);

