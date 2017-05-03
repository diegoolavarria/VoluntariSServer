var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    passport    = require('passport'),
    nodemailer  = require('nodemailer'),
    gcm         = require('node-gcm'),
    config      = require('./config/database'),
    User        = require('./models/user'),
    Grupo       = require('./models/grupo'),
    Admin       = require('./models/admin'),
    Actividad   = require('./models/actividad'),
    Point       = require('./models/point'),
    Mensaje     = require('./models/mensaje'),
    port        = process.env.PORT || 8080,
    jwt         = require('jwt-simple');
// Obtener los parametros de requerimientos.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Login en la consola.
app.use(morgan('dev'));
//Permitir operaciones CORS.
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
    // interceptar método OPTIONS.
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});
// Usar el paquete Passport.
app.use(passport.initialize());
// demo Route (GET http://localhost:8080).
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});
// Conectar a la base de datos.
mongoose.connect(config.database);
// Dar Passport para la configuración.
require('./config/passport')(passport);
 
var apiRoutes = express.Router();
//Configuración para correo electrónico para el administrador.
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "diego.olavarria@usach.cl",
        pass: "20/01/1992"
    }//
});
var sender = new gcm.Sender('AIzaSyASD1boUZv1DYiH6_XsCQnhMDoP6vWEHHQ');
//Variables globales de asistencia.
var cantidaddias = 0;
var cantidadvoluntariospordia = 0;
var diainicio = '';
var contenidocorreo = 'a';
var monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
    ];
// Registrar nuevo Administrador
apiRoutes.post('/signupadmin', function(req, res) {
  //Si uno de los parámetros no se encuentra en el formulario.
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Por favor ingrese correo electrónico o contraseña.'});
  } 
  else if (!req.body.nombrecompleto){
    res.json({success: false, msg: 'Por favor, ingrese su nombre'});
  }
  //Si estan todos los parámetros, crear nuevo administrador.
  else {
    var newAdmin = new Admin({
      name: req.body.name,
      password: req.body.password,
      nombrecompleto: req.body.nombrecompleto
    });
    //Guardar los datos
    newAdmin.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Error en los datos'});
      }
      res.json({success: true, msg: 'Creación de nuevo Administrador exitosa'});
    });
  }
});
// Registrar nuevo Usuario
apiRoutes.post('/signup', function(req, res) {
  //Si uno de los parámetros no se encuentra en el formulario.
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } 
  else if (!req.body.nombre1){
    res.json({success: false, msg: 'Por favor, ingrese su nombre'});
  }
  /*else if (!req.body.nombre2){
    res.json({success: false, msg: 'Por favor, ingrese su segundo nombre'});
  }*/
  else if (!req.body.apellido1){
    res.json({success: false, msg: 'Por favor, ingrese su apellido paterno'});
  }
  else if (!req.body.apellido2){
    res.json({success: false, msg: 'Por favor, ingrese su apellido materno'});
  }
  else if (!req.body.rut){
    res.json({success: false, msg: 'Por favor, ingrese su cédula de identidad'});
  }
  else if (!req.body.ubicacion){
    res.json({success: false, msg: 'Por favor, ingrese su cédula de identidad'});
  }
  else if (!req.body.grupo){
    res.json({success: false, msg: 'Por favor, ingrese un grupo de trabajo'});
  }
  //Si estan todos los parámetros, crear nuevo usuario.
  else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      nombre1: req.body.nombre1,
      nombre2: req.body.nombre2,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      rut: req.body.rut,
      direccion: req.body.direccion,
      ubicacion: req.body.ubicacion,
      grupo: req.body.grupo,
      ranking: req.body.ranking,
      token: req.body.token
    });
    //Guardar los datos
    console.log(newUser);
    newUser.save(function(err) {
      if (err) {
        console.log(newUser);
        return res.json({success: false, msg: 'Error en registro'});
      }
      res.json({success: true, msg: 'Creación de nuevo usuario exitosa'});
    });
  }
});
//Crear nuevo grupo
apiRoutes.post('/addgroup', function(req, res) {
    var newGrupo = new Grupo({
      name: req.body.name
    });
    newGrupo.save(function(err){
        if (err) {
          return res.json({success: false, msg: 'Grupo ya existe.'});
        }
        res.json({success: true, msg: 'Grupo creado exitosamente.'});
    });
});
//Crear nuevo punto de trabajo.
apiRoutes.post('/addmarker', function(req, res) {
    var newPoint = new Point({
      name: req.body.name,
      ubicacion: req.body.ubicacion,
      direccion: req.body.direccion,
      nombreadmin: req.body.nombreadmin,
      descripcion: req.body.descripcion,
      cantvoluntarios: req.body.cantvoluntarios,
      tipoactividad: req.body.tipoactividad,
      fechainicio: req.body.fechainicio,
      diasdetrabajo: req.body.diasdetrabajo
    });
    newPoint.save(function(err){
        if (err) {
          return res.json({success: false, msg: 'Marcador ya existe.'});
        }
        res.json({success: true, msg: 'Punto de trabajo creado exitosamente.'});
    });
});
//Crear nueva postulación de voluntario en un punto de trabajo.
apiRoutes.post('/addactividad', function(req, res) {
    var newActividad = new Actividad({
      name: req.body.name,
      idtarea: req.body.idtarea,
      voluntario: req.body.voluntario,
      posactividad: req.body.posactividad,
      posvoluntario: req.body.posvoluntario,
      fechainicio: req.body.fechainicio,
      fechafin: req.body.fechafin,
      ranking: req.body.ranking,
      token: req.body.token
    });
    console.log(newActividad);
    newActividad.save(function(err){
      if (err) {
        return res.json({success: false, msg: 'Error, no se pudo procesar postulación'});
      }
      res.json({success: true, msg: 'Postulación realizada exitosamente.'});
    });
});
//Obtener los grupos ingresados en el sistema.
apiRoutes.get('/getGrupos', function(req, res) {
  Grupo.find(
    function(err, grupo) {
    if (err)
      res.send(err)
        res.json(grupo);
      }
  );
});
//Obtener los puntos de trabajo ingresados en el sistema.
apiRoutes.get('/getPoints', function(req, res) {
  Point.find(
    function(err, point) {
    if (err)
      res.send(err)
        res.json(point);  
      }
  );
});
//Obtener nombre de punto por id.
apiRoutes.get('/getPointName/:_id', function(req, res) {
  Point.findById(req.params._id, function(err, point) {
    if (err)
        res.send(err);
    //Guardar cantidad de dias de trabajo de punto.
    cantidaddias = point.diasdetrabajo;
    //Guardar cantidad de voluntarios requeridos por dia en el punto de trabajo.
    cantidadvoluntariospordia = point.cantvoluntarios;
    //Guardar fecha de inicio de trabajos en el punto.
    diainicio = new Date(point.fechainicio);
    res.json(point);
  });
});
//Eliminar punto de trabajo, buscando por id.
apiRoutes.delete('/deletePoint/:_id', function(req, res) {
    Point.remove({
        _id: req.params._id
    }, function(err, point) {
        if (err){
          
        }
        else{
          res.json({success: true, msg: 'Asignacion de voluntarios exitosa.'});
        }
    });
});
//Eliminar mensajes por correo electrónico de voluntario.
apiRoutes.delete('/deleteMensaje/:voluntario', function(req, res) {
    Mensaje.remove({
        voluntario: req.params.voluntario
    }, function(err, mensaje) {
        if (err){
          
        }
        else{
          res.json({success: true, msg: 'Mensaje eliminado.'});
        } 
    });
});
//Eliminar postulaciones por correo electrónico de voluntario.
apiRoutes.delete('/deleteActividad/:voluntario', function(req, res) {
    Actividad.remove({
        voluntario: req.params.voluntario
    }, function(err, actividad) {
        if (err){
          //res.send(err);
        }
        else{
          res.json({success: true, msg: 'Postulación eliminada.'});
        }
    });
});
//Eliminar postulaciones por id de punto de trabajo.
apiRoutes.delete('/deleteActPorId/:idtarea', function(req, res) {
    Actividad.remove({
        idtarea: req.params.idtarea
    }, function(err, actividad) {
        if (err){
          //res.send(err);
        }
        else{
          res.json({success: true, msg: 'Postulación eliminada.'});
        }
    });
});
//Eliminar grupo por nombre de grupo.
apiRoutes.delete('/deleteGrupo/:name', function(req, res) {
    Grupo.remove({
        name: req.params.name
    }, function(err, actividad) {
        if (err){
          //res.send(err);
        }
        else{
          res.json({success: true, msg: 'Grupo eliminado.'});
        }
    });
});
//Actualizar ranking de voluntario, buscando por correo electrónico.
apiRoutes.put('/updateRanking/:name', function(req, res) {
    User.findOne({name: req.params.name}, function(err, user) {
        if (err) res.send(err);
        user.ranking = user.ranking + 1;
        console.log(user.ranking);
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: '¡Ranking actualizado!' });
        });
    });
});
apiRoutes.put('/updatePoint/:idtarea', function(req, res) {
    Point.findOne({_id: req.params.idtarea}, function(err, point) {
        if (err) res.send(err);
        point.llamado = 1;
        console.log(point.llamado);
        point.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Punto actualizado!' });
        });
    });
});
//Actualizar grupo escogido por voluntario, recibiendo el nombre del grupo como parámetro.
apiRoutes.put('/updateGrupo/:grupo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado'});
        } else {
          user.grupo = req.params.grupo;
          user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: '¡Grupo actualizado!' });
          });
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
//Buscar datos de postulación, buscando por id.
apiRoutes.get('/getDatosTarea/:_id', function(req, res) {
  Actividad.find({idtarea: req.params._id}, function(err, actividad) {
    if (err)
        res.send(err);
    res.json(actividad);
  });
});
//Obtener mensaje enviado a cada voluntario.
apiRoutes.get('/getMensaje/:voluntario', function(req, res) {
  Mensaje.find({voluntario: req.params.voluntario}, function(err, mensaje) {
    if (err)
        res.send(err);
    res.json(mensaje);
  });
});
//Comenzar asignación de voluntarios, por cada punto de trabajo.
apiRoutes.get('/comenzar/:_id', function(req, res) {
  Actividad.find({idtarea: req.params._id}, function(err, actividad) {
    if (err)
        res.send(err);
    var array = [];
    array.push(actividad);
    var arraymes = [];
    var diaactivid = new Date(diainicio);
    contenidocorreo = "Estos son los correos electrónicos de los usuarios que participarán en la tarea '" + array[0][0].name + "': "
    //armar matriz de dias/cantidadDeVoluntarios
    for(i = 0; i <= cantidaddias; i++) {  
        arraymes[i] = [];
        for(j = 0; j < cantidadvoluntariospordia; j++) {
          arraymes[i][j] = []
          arraymes[i][j][0] = new Date(diaactivid);
          arraymes[i][j][1] = new Date(diaactivid)
        }
        diaactivid.setDate(diaactivid.getDate() + (1));  
    }
    //Obtener distancia relativa entre punto de trabajo y voluntario.
    for(i=0;i<array[0].length;i++){
      var radlat1 = Math.PI * array[0][i].posvoluntario[0]/180
      var radlat2 = Math.PI * array[0][i].posactividad[0]/180
      var theta = array[0][i].posvoluntario[1]-array[0][i].posactividad[1]
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      dist = dist * 1.609344
      array[0][i].posvoluntario = dist;
    }
    //Ordenar postulantes por ranking y por distancia al punto.
    array[0].sort(function (a, b) {   
        return b.ranking - a.ranking || a.posvoluntario - b.posvoluntario;
    });

    var contador = 0;
    var contador2 = 0;
    var seleccionados = [];
    for(h=0;h<2;h++){
      seleccionados[h] = []
    }
    var contador3 = 0;
    var vol = 'a';
    var objeto = 'a';
    //Algoritmo principal, por cada voluntario postulante, recorrer matriz.
    for(i=0;i<array[0].length;i++){
      //Por la cantidad de voluntarios requeridos por dia en el punto de trabajo.
      for(k = 0; k < cantidadvoluntariospordia; k++){
        //Por cantidad de dias requeridos para completar la tarea.
        for(j = 0; j < cantidaddias; j++){ 
          //Ver si dia de inicio de voluntario corresponde a fecha libre
          if((array[0][i].voluntario != " ")&&(arraymes[j][k][0] instanceof Date)&&(arraymes[j][k][0].getDate() == array[0][i].fechainicio.getDate())&&(arraymes[j][k][0].getMonth() == array[0][i].fechainicio.getMonth())){
            //ver si el periodo que voluntario escogió esta libre
            contador = 0;
            for(l=0;l<=((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)));l++){
              if((l < (Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)))&&(arraymes[j+l][k][0] instanceof Date)){
                contador++;
              }
              if((l == (Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)))&&(arraymes[j+l][k][1] instanceof Date)){
                contador++;
              }
            }
            //Ver si el plazo libre encontrado es igual al plazo propuesto del usuario
            if((contador==(Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24))+1)&&(vol!=array[0][i].voluntario)){
              vol = array[0][i].voluntario;
              //Reservar intervalo de tiempo para el voluntario postulante.
              for(l=0;l<=((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)));l++){
                if((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)) == 0){//si alguien solo trabajará un dia
                  arraymes[j+l][k][0] = vol;
                  arraymes[j+l][k][1] = vol;
                }
                else{
                  if(l<(Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24))){
                    arraymes[j+l][k][0] = vol;
                  }
                  else{
                    arraymes[j+l][k][1] = vol;
                  }
                }
              }
              console.log(seleccionados)
                  seleccionados[0][contador3] = array[0][i].voluntario;
                  seleccionados[1][contador3] = array[0][i].token;
                  contador3++;
                  console.log(seleccionados)
                  array[0][i].voluntario = " ";
                  console.log(seleccionados)
            }
          }
          contador = 0;
        }
      }
      for(k = 0; k < cantidadvoluntariospordia; k++){
        for(j = 0; j < cantidaddias; j++){ 
          if((array[0][i].voluntario != " ")&&(vol!=array[0][i].voluntario)){
            //Ir descontando dias de trabajo, hasta que se alcance un mínimo 4 dias + 1 dia cada 500 kilometros de distancia.
            while(((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24))) >= (4+(array[0][i].posvoluntario)/500)) {
              //Aplazar el dia de llegada del voluntario un dia más.
              array[0][i].fechainicio.setDate(array[0][i].fechainicio.getDate() + (1));
              contador2++;
              //Ver si dia de inicio de voluntario corresponde a fecha libre
              if((arraymes[j][k][0] instanceof Date)&&(arraymes[j][k][0].getDate() == array[0][i].fechainicio.getDate())&&(arraymes[j][k][0].getMonth() == array[0][i].fechainicio.getMonth())){
                //ver si el periodo que voluntario escogió esta libre
                contador = 0;
                for(l=0;l<=((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)));l++){
                  if((l < (Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)))&&(arraymes[j+l][k][0] instanceof Date)){
                    contador++;
                  }
                  if((l == (Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)))&&(arraymes[j+l][k][1] instanceof Date)){
                    contador++;
                  }
                }
                //Ver si el plazo libre encontrado es igual al plazo propuesto del usuario
                if((contador==(Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24))+1)&&(vol!=array[0][i].voluntario)){
                  vol = array[0][i].voluntario;
                  for(l=0;l<=((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)));l++){
                    if((Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24)) == 0){//si alguien solo trabajará un dia
                      arraymes[j+l][k][0] = vol;
                      arraymes[j+l][k][1] = vol;
                    }
                    else{
                      if(l<(Math.ceil((array[0][i].fechafin).getTime()-(array[0][i].fechainicio).getTime())/(1000*60*60*24))){
                        arraymes[j+l][k][0] = vol;
                      }
                      else{
                        arraymes[j+l][k][1] = vol;
                      }
                    }
                  }
                  console.log(seleccionados)
                  seleccionados[0][contador3] = array[0][i].voluntario;
                  seleccionados[1][contador3] = array[0][i].token;
                  contador3++;
                  console.log(seleccionados)
                  array[0][i].voluntario = " ";
                  console.log(seleccionados)
                }
              }
            }
          }
          array[0][i].fechainicio.setDate(array[0][i].fechainicio.getDate() - (contador2));
          contador2 = 0;
        }
      }
    }
    console.log(arraymes);
    console.log("ASDF");

    var device_tokens = [];
    var retry_times = 4;

    var message = new gcm.Message();

    message.addData('title', 'Has sido llamado');
    message.addData('message', 'Ingresa a la aplicación para conocer más detalles.');
    message.addData('sound', 'notification');

    message.collapseKey = 'testing'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline

    vol = 's';
    var diaparavol = new Date(diainicio);
    //Recorrer matriz de itinerario una vez más para notificar a los voluntarios asignados al punto de trabajo.
    for(k = 0; k < cantidadvoluntariospordia; k++) { 
      for(j = 0; j < cantidaddias; j++){
        for(i=0;i<seleccionados[0].length;i++){
          if(arraymes[j][k][0] != vol){
            if(arraymes[j][k][0] == seleccionados[0][i]){
              device_tokens.push(seleccionados[1][i]);
              vol = arraymes[j][k][0];
              diaparavol.setDate(diaparavol.getDate() + (j)); 
              var fechamensaje = new Date();
              var menscache = ('Se le requiere el dia ' + diaparavol.getDate() + ' de ' + monthNames[diaparavol.getMonth()] + ' de ' + diaparavol.getFullYear() 
                + ' en el punto escogido por usted para iniciar los trabajos.');
              contenidocorreo = contenidocorreo  + '<p>- ' + vol + ' para el ' + diaparavol.getDate() + ' de ' + monthNames[diaparavol.getMonth()] + ' de ' + diaparavol.getFullYear()
              + ', cupo: ' + k+1 + '.';
              var newMensaje = new Mensaje({
                voluntario: vol,
                mensaje: menscache,
                fecha: fechamensaje,
                posactividad: array[0][0].posactividad
              });
              newMensaje.save(function(err){
                if (err) {
                  throw err;
                }
              });
            }
          }
        }
      }
    }
    sender.send(message, device_tokens, retry_times, function(result){
        console.log(result);
    });
    var device_tokens2 = [];

    var message2 = new gcm.Message();

    message2.addData('title', 'No has sido llamado');
    message2.addData('message', 'Puedes intentar postular a otra actividad.');
    message2.addData('sound', 'notification');

    message2.collapseKey = 'testing'; //grouping messages
    message2.delayWhileIdle = true; //delay sending while receiving device is offline
    message2.timeToLive = 3;
    for(i=0;i<array[0].length;i++){
      if(array[0][i].voluntario != " "){
        device_tokens2.push(array[0][i].token);
        Actividad.remove({
            voluntario: array[0][i].voluntario
        }, function(err, actividad) {
            if (err){
              //res.send(err);
            }
        });
      }
    }
    sender.send(message2, device_tokens2, retry_times, function(result){
        console.log(result);
    });

    console.log("LISTO");
    res.json({success: true, msg: 'Asignacion de vountarios exitosa.'});
  });
});

var sortBy = (function () {
  //cached privated objects
  var _toString = Object.prototype.toString,
      //the default parser function
      _parser = function (x) { return x; },
      //gets the item to be sorted
      _getItem = function (x) {
        return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x);
      };
  return function (array, o) {
    if (!(array instanceof Array) || !array.length)
      return [];
    if (_toString.call(o) !== "[object Object]")
      o = {};
    if (typeof o.parser !== "function")
      o.parser = _parser;
    o.desc = !!o.desc ? -1 : 1;
    return array.sort(function (a, b) {
      a = _getItem.call(o, a);
      b = _getItem.call(o, b);
      return o.desc * (a < b ? -1 : +(a > b));
    });
  };
}());
//Función para enviar correo electrónico al administrador con la información de los voluntarios asignados a la actividad.
apiRoutes.get('/enviarcorreo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Admin.findOne({
      name: decoded.name
    }, function(err, admin) {
        if (err) throw err;
 
        if (!admin) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado.'});
        } else {
          var mailOptions = {
            from: 'example@gmail.com', // sender address
            to: admin.name, // list of receivers
            subject: 'Email Example', // Subject line
            text: 'listo',
            html: contenidocorreo //, // plaintext body
          };
          smtpTransport.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
            console.log('Mensaje enviado: ' + info.response);
          });
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No hay información del usuario.'});
  }
});
//Autenticación del administrador al sistema.
apiRoutes.post('/authenticateadmin', function(req, res) {
  Admin.findOne({
    name: req.body.name
  }, function(err, admin) {
    if (err) throw err;
 
    if (!admin) {
      res.send({success: false, msg: 'Administrador no encontrado.'});
    } else {
      //Revisar si la contraseña coincide.
      admin.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          //Crear un token si correo electrónico y contraseña coinciden.
          var token = jwt.encode(admin, config.secret);
          //Retornar la información del token como un JSON.
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Datos erróneos.'});
        }
      });
    }
  });
});
//Autenticación de usuario al sistema.
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Usuario no encontrado.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Datos erróneos.'});
        }
      });
    }
  });
});
//Recoger toda la información del administrador.
apiRoutes.get('/adminuser', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Admin.findOne({
      name: decoded.name
    }, function(err, admin) {
        if (err) throw err;
 
        if (!admin) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado.'});
        } else {
          res.json({success: true, msg: admin});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No hay información del usuario.'});
  }
});
//Obtener toda la información del usuario.
apiRoutes.get('/profileuser', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado.'});
        } else {
          res.json({success: true, msg: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No hay información del usuario.'});
  }
});
//Obtener coordenadas del usuario.
apiRoutes.get('/profilepos', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado.'});
        } else {
          res.json(user.ubicacion);
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No hay información del usuario.'});
  }
});
//Obtener ranking del usuario.
apiRoutes.get('/profiletodo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Usuario no encontrado.'});
        } else {
          res.json({success: true, msg: user.ranking});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No hay información del usuario.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
 
// Conectar las rutas de la API.
app.use('/api', apiRoutes);
 
// Iniciar el servidor.
app.listen(port, "0.0.0.0");
console.log('There will be dragons: http://localhost:' + port);