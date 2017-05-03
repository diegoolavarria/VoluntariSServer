//Utilizar Passport para JSON Web Tokens.
var JwtStrategy = require('passport-jwt').Strategy;
 
//Cargar modelos de Usuarios y Administrador, debido a que requieren tokens.
var User = require('../models/user');
var Admin = require('../models/admin');
var config = require('../config/database'); // Obtener información de base de datos.
 
module.exports = function(passport) {
  var optsuser = {};
  var optsadmin = {};
  optsuser.secretOrKey = config.secret;
  optsadmin.secretOrKey = config.secret;
  passport.use(new JwtStrategy(optsuser, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  passport.use(new JwtStrategy(optsadmin, function(jwt_payload, done) {
    Admin.findOne({id: jwt_payload.id}, function(err, admin) {
          if (err) {
              return done(err, false);
          }
          if (admin) {
              done(null, admin);
          } else {
              done(null, false);
          }
      });
  }));
};