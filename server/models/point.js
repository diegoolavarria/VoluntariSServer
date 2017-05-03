var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var PointSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ubicacion: {
        type: [Number],
        unique: true,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    nombreadmin: {
        type: String,
        required: true
    },
    cantvoluntarios: {
        type: Number,
        required: true
    },
    tipoactividad: {
        type: String,
        required: true
    },
    fechainicio: {
        type: Date,
        required: true
    },
    diasdetrabajo: {
        type: Number,
        required: true
    },
    llamado: {
        type: Number
    }
});
 
PointSchema.pre('save', function (next) {
    var point = this;
    next();
});
 
module.exports = mongoose.model('Point', PointSchema);