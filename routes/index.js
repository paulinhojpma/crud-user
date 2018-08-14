var express = require('express');
var jwt    = require('jsonwebtoken');
var router = express.Router();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var User   = require('../user'); 
var config = require('../config'); 
var multer = require('multer'); 
var upload = multer();
var app = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

mongoose.connect(config.database , { useNewUrlParser: true }); 
console.log("Global Promise - "+ global.Promise);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get("/users", function(req, res){
  console.log("decoded - "+ req.headers['x-access-token']);
  //console.log("Decoded - "+  req.decoded);
      User.find({}, function(err, users){
        if(err){
          console.log(err);
        }else{
          console.log("Primeiro usuario - "+ users[0]);
          res.json({success: true,
                     message: "Usuarios retornados",
                      usuarios: users});
        }

      });

  //res.json({success: true, message: "logou"});
});


router.get("/users/usersView", function(req, res){
    console.log("Entrou no usersView");
    //res.setHeader('Content-Type', 'text/html');
     //res.status(200)
      //res.sendFile('/usuarios.html');
      
      res.render("usuarios");
     // res.end();

});


router.get("/users/verificar/:id", function(req, res){
  console.log("Entrnou no verificar usuario - "+ req.params.id);
  console.log("Senha retornada ", req.headers['senha']);
  User.findOne({
        login: req.params.id},
        
        function(err, user){
          if (err) throw err;
          if(!user){
            console.log("Não achou o usuario");
            res.json({ success: false, message: 'Usuário não encontrado.'});

          }else if(user){
            console.log("Senha enviada - "+ req.headers['senha']+"\nSenha do usuario - "+ user.senha);
            if(user.senha != req.headers['senha']){
              console.log("Senha errada - "+ user.login);
              res.json({ success: false, message: 'Senha errada.' });

            }else{
                console.log("Usuario encontrado - "+ user.login);
                res.json({success: true, message: user.email});
               /*const payload = {
                email: user.email
              };

               // console.log("Segredo - "+ process.env.SECRET);
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 300 // expires in 24 hours
                 });

                res.json({
                  success: true,
                  message: 'Logado com sucesso',
                  token: token
                });*/
            }
          }
        }
      );


});
/*
router.get("/", function(req, res){
    console.log("Entrou no index");
    res.setHeader('Content-Type', 'text/html');
    res.render("index", {title: "Login"});
});



router.post("/logar", function (req, res, next){
  console.log("Entrou no logar");
  console.log("Valor do login - "+ req.body.login);
  console.log("Latitude - "+ req.body.latitude+ "\nlongitude = "+ req.body.longitude);

  User.findOne({
      login: req.body.login},
      function(err, user){
        if (err) throw err;
        if(!user){
          res.json({ success: false, message: 'Usuário não encontrado.' });
        }else if(user){
          if(user.senha != req.body.senha){
            res.json({ success: false, message: 'Senha errada' });

          }else{

             const payload = {
              email: user.email};

              var token = jwt.sign(payload, config.secret, {
                  expiresIn: 1440 // expires in 24 hours
               });

              res.json({
                success: true,
                message: 'Logado com sucesso',
                token: token
              });
          }
        }
      }
    );


    

});

//autenticar o usuario
router.use(function(req, res, next){
   console.log("Entrou no autenticar");
    var token = req.body.token || req.headers['x-access-token'];
    console.log("token - "+ token);
    if(token){
      jwt.verify(token, config.secret, function(err, decoded){
        if(err){
          console.log(err);
          return res.json({ success: false, message: 'Erro ao autenticar' })
        }else{
          console.log("Decoded - "+ decoded);
          req.decode = decoded;
          next();
        }
      });
    }else{
      return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
      });
      //res.render('index');
    }
    
});

router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    nome: 'Vicente',
    login: 'vicentinho',
    senha: 'vicente',
    nascimento: new Date("2016-05-18"),
    email: 'vicente@vicente'
    
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

*/


router.get('/lista', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

module.exports = router;