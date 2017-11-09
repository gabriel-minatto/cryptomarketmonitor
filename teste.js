//node requests https://pt.stackoverflow.com/questions/174525/como-fazer-requisi%C3%A7%C3%A3o-get-post-com-node-js#answer-174536


var http = require('http');

var config = {
    hostname: "localhost",
    port: 8080,
    path: "/",
    headers:{
        Accept: "application/json"
    }
};

http.get(config,function(res){
   res.on('data',function(body){
       console.log(body.toString());
   });
});