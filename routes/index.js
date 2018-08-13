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