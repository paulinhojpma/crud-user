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
var request = require('request');
//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

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

function criarNovaQeue(login, fn){
  request({
    method: "GET",
    //url: 'https://microservices-crud-user.herokuapp.com/users/verificar/'+ req.body.login,
    url: 'http://localhost:8090/createQeue/'+ login,
    

  }).on('data', function(chunk) {
    console.log("Chunk - " + chunk);
    var data = JSON.parse(chunk);
   //console.log(response.statusCode);
    console.log("resposta do request - "+ data);
    if(data.success){
      console.log("Fila gerada - "+ data.urlQeue);

       
    }else{
           console.log("Não foi possível gerar a fila");
    }
    fn();
  }).on("error", function(err){
    console.log("Erro no request");
    console.log(err);
  });



}

router.get("/testaCriaFila", function(req, res){
      criarNovaQeue("ronaldo", function(){

        res.json({success: true});
      });


});


router.post("/users",  function(req, res, next){
  console.log("Entrou em criar usuário - "+ req.body.nome);
      User.findOne({$or:[{_id: req.body.email}, {login: req.body.login}]},
      function(err, data){
        if(err){
           res.json({succes: false, message: "Ocorreu um erro"}); 

        }
          if(!data){
            var nick = new User({ 
              nome: req.body.nome,
              login: req.body.login,
              senha: req.body.senha,
              nascimento: new Date(req.body.nascimento),
              _id:  req.body.email    
            });

            nick.save(function(err) {
              if (err){ 
                throw err;
                res.json({ success: false , message: err});
              }

              console.log('Novo usuário criado');
              res.json({ success: true , message: "Usuario "+ req.body.nome+ " criado com sucesso"});
            });
          }else{
            if(data._id == req.body.email){
               res.json({succes: false, message: "email já cadastrado"});
            } else{
              res.json({succes: false, message: "login já cadastrado"});
            }
            
          }        
          

      }

    );
     
     

});



router.put("/users/:id" , function(req, res){
  console.log("Entrou em atualizar usuario - "+req.params.id);
  console.log("Entrou em atualizar usuarioNome - "+req.body.nome);
  User.findOneAndUpdate({
    _id: req.params.id
  },
  req.body,
  /*{nome: req.body.nome,
    login: req.body.login,
    senha: req.body.senha,
    nascimento: new Date(req.body.nascimento),
    email: req.body.email},*/
    {new: true},
  function(err, data){
    if(err){
      throw err;
      res.status(404).json({success: false, message: "Usuário não pode ser atualizado"});
    }
      res.json({success: true, message: "Usuario "+ data.nome+ " atualizado com sucesso", user: data});
  } 


  );
});

router.delete("/users/:id", function(req, res){
  console.log("Entrou em deletar usuario - "+req.params.id);
  User.findOneAndRemove({
    _id: req.params.id
  }, function(err, data){
    if(err){
      throw err;
      res.status(404).json({success: false, message: "Usuário não pode ser removido"});
    }
    res.json({success: true, message: "Usuario "+ data.nome+ " removido com sucesso"});
  }
  );

});

router.get("/users/atualizaView", function(req, res){
  console.log("Entrou no atualizaView"); 
    res.render("usuarioUpdate");

})

router.get("/users/usersView", function(req, res){
    console.log("Entrou no usersView");      
    res.render("usuarios");
});

router.get("/users/userView", function(req,  res){
  console.log("Entrou no userView");
  res.render("usuario");
});

router.get("/users/new", function(req, res){
  console.log("Entrou no new View");
  res.render("usuarioCreate");
});

router.get("/users/:id", function(req, res){
  console.log("Entrou no users/:id - "+ req.params.id);
    User.findOne({
      _id: req.params.id
    },
      function(err, user){
        console.log("Usuario retornado - "+user);
        if(err) throw err;

        if(user){
          res.json(user);
        }else{
          res.json({succes: false, message: "usuario não encontrado"});
        }
      }
    );

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
                console.log("Usuario encontrado - "+ user._id);
                res.json({success: true, message: user._id});
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


router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    nome: 'Ronaldo',
    login: 'ronaldo',
    senha: 'spcock',
    nascimento: new Date("1978-05-18"),
    _id: 'ronaldo@spock'
    
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
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