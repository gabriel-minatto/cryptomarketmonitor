var express = require('express')
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');

module.exports = function(){
    
    var app = express();
    
    app.use(helmet());

    app.use(express.static('./app/public'));
    app.set('view engine','ejs');
    app.set('views','./app/views');

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        next();
    });
    
    /*app.use((req, res, next) => {
        const apiKey = req.headers['x-api-key']
        if(apiKey != process.env.apiKey)
            res.status(403).render("erros/403")

        next();
    });*/
    
    load('public-routes',{cwd:'app'})
        .then('infra')
        .into(app);
    
    //private middleware

    load('private-routes',{cwd:'app'})
        .into(app);

    
    app.use(function(req,res,next){
        res.status(404).render("erros/404");
        next();
    });

    app.use(function(err,req,res,next){
        res.status(500).render("erros/500");
        return;
        next(err);
    });

    return app;
}