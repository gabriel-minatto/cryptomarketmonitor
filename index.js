/*var express = require('express');
var app = express();
app.set('view engine','ejs');*/

require('dotenv').config(); //load env variables setted in .env file

var app = require('./config/express')();
var http = require('http').Server(app);

http.listen(process.env.PORT,function(){
    console.log("servidor rodando loucamente");
});

//evita que o servidor desligue apos uma exception
//recomendado usar tambem o forever para que nao haja downtime
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});