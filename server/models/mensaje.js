var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var MensajeSchema = new Schema({
    voluntario: {
    	type: String,
        required: true
    },
    mensaje: {
    	type: String,
    	required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    posactividad: {
        type: [Number],
        required: true
    }
});
 
MensajeSchema.pre('save', function (next) {
    var mensaje = this;
    next();
});
 
module.exports = mongoose.model('Mensaje', MensajeSchema);