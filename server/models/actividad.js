var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var ActividadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    idtarea: {
        type: String,
        required: true
    },
    voluntario: {
    	type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    posactividad: {
    	type: [Number],
    	required: true
    },
    posvoluntario: {
    	type: [Number],
    	required: true
    },
    fechainicio: {
        type: Date,
        required: true
    },
    fechafin: {
        type: Date,
        required: true
    },
    ranking: {
        type: Number,
        required: true
    }
});
 
ActividadSchema.pre('save', function (next) {
    var actividad = this;
    next();
});
 
module.exports = mongoose.model('Actividad', ActividadSchema);