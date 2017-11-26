const express = require('express')
const load = require('express-load')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const helmet = require('helmet')
const slackPusher = require('../app/infra/slackPusher')()
const serializeError = require('serialize-error')

module.exports = function(){
    
    var app = express();

    app.use(helmet());

    app.use(express.static('./app/public'));
    app.set('view engine','ejs');
    app.set('views','./app/views');

    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    app.use(expressValidator())
    
    app.use((req, res, next) => {
        const pushText = `Headers:\n${JSON.stringify(req.headers)}\n\nBody:\n${JSON.stringify(req.body)}`
        const message = {'text':pushText,username:`New Request From: ${req.headers['x-forwarded-for']}`}
        
        slackPusher(process.env.slackRequestsChannel, message)
        
        next()
    })

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*'])
        next()
    });
    
    app.use((req, res, next) => {
        const apiKey = req.get('x-api-key')
        if(apiKey != process.env.apiKey){
            res.status(401).render("erros/401",{name:"x-api-key"})
            return
        }

        next()
    });
    
    load('routes',{cwd:'app'})
    .then('infra')
    .into(app)
    
    app.use(function(req,res,next){
        res.status(404).render("erros/404")
        next()
    });

    app.use(function(err,req,res,next){
        app.infra.slackPusher(process.env.slackErrorsChannel, 
            {
                text:JSON.stringify(serializeError(err),null,4)
            }
        )
        res.status(500).render("erros/500")
        return
    });

    return app
}