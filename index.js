require('dotenv').config(); //load env variables setted in .env file
var app = require('./config/express')();
var http = require('http').Server(app);
const serializeError = require('serialize-error')

http.listen(process.env.PORT,function(){
    console.log("servidor rodando loucamente");
});

//evita que o servidor desligue apos uma exception
//recomendado usar tambem o forever para que nao haja downtime
process.on('uncaughtException', (err) => {
  console.log(err)
  app.infra.slackPusher(process.env.slackErrorsChannel, 
      {
          text:JSON.stringify(serializeError(err),null,4)
      }
  )
  process.exit(1)
});