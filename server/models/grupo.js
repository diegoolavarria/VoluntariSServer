var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var GrupoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});
 
GrupoSchema.pre('save', function (next) {
    var grupo = this;
    next();
});
 
module.exports = mongoose.model('Grupo', GrupoSchema);