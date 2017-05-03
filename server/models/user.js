var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nombre1: {
        type: String,
        required: true
    },
    nombre2: {
        type: String
    },
    apellido1: {
        type: String,
        required: true
    },
    apellido2: {
        type: String,
        required: true
    },
    rut: {
        type: String,
        required: true
    },
    ubicacion: {
        type: [Number],
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    grupo: {
        type: String,
        required: true
    },
    ranking: {
        type: Number,
        required: true
    },
    token: {
        type: String
    }
});
 
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.index({location: '2dsphere'});
 
module.exports = mongoose.model('User', UserSchema);