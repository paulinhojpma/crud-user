var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var path = require('path');
var morgan      = require('morgan');
var request = require('request');
//var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); 
var config = require('./config'); 
var User   = require('./user'); 
var indexRouter = require('./routes/index');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');
app.use("/users/public", express.static(path.join(__dirname, 'public')));
var port = process.env.PORT || 8080; 
//mongoose.connect(config.database , { useNewUrlParser: true }); 
app.set('superSecret', config.secret); 
app.use('/', indexRouter);

app.use(morgan('dev'));

if (require.main === module){
    //inicia o servidor
    app.listen(port)
    console.log('API funcionando!')
}


//app.listen(port);
console.log('Magic happens at http://localhost:' + port);