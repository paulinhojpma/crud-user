var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({ 
	_id: String,
    nome: {type: String, required: true },
    login: {type: String,  required: true },
    senha: {type: String, required: true },
    nascimento: {type: Date,  required: true }
    //email: {type: String, unique: true, required: true }
});

userSchema.virtual('email').get(function() {
    return this._id;
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);


