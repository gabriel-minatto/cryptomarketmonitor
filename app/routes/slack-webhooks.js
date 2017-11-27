const md5 = require("md5")
const request = require("request")
const get = require('simple-get')
const privateTokenAuth = require('../../config/privateTokenAuth')()

module.exports = function(app){
  
    /**
    * @api {post} /new-slack-webhook Novo Canal Slack
    * @apiGroup Private/Slack
    * @apiDescription Adiciona um novo canal (slack incoming webhook) para envio de notificações recebendo
    * o(os) parametro(os) {notification}
    *
    *
    **/
    app.post("/new-slack-webhook", privateTokenAuth, async (req, res) => {

        const newPush = req.body.notification
        const token = req.get('x-api-token')
        
        req.assert("notification","O campo notification e obrigatorio").notEmpty()
        
        var erros = req.validationErrors()
        if(erros){
          res.json({msg:"",err:JSON.stringify(erros)})
          return
        }
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err

          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let dbUser = await apiUsersDAO.query({token:token})
          
          if(!dbUser || !dbUser[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }

          const user = dbUser[0]

          if(!user.webhooks || !Array.isArray(user.webhooks))
            user.webhooks = [newPush]
          else
            user.webhooks.push(newPush)

          const result = await apiUsersDAO.updateByid(user._id, {webhooks:user.webhooks})
          
          res.json({user:user, msg:result.result})

        })
        
    })
    
    /**
    * @api {post} /send-slack-notification/codigo_da_moeda Enviar Notificação
    * @apiGroup Private/Slack
    * @apiDescription Dispara notificações sobre alterações nas moedas para os canais cadastrados do usuários recebendo
    * o(os) parametro(os) {variation}
    *
    *
    **/
    app.post("/send-slack-notification/:coin", privateTokenAuth, (req, res) => {

        const variation = req.body.variation
        const coin = req.params.coin
        const token = req.get('x-api-token')
        
        req.assert("variation","O campo variation e obrigatorio").notEmpty()
        req.assert("coin","Codigo de moeda invalido").isIn(['btc','ltc','bch'])
        
        var erros = req.validationErrors()
        if(erros){
          res.json({msg:"",err:JSON.stringify(erros)})
          return
        }
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const incomingUser = {
            token: token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let user = await apiUsersDAO.query(incomingUser)
          
          if(!user || !user[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }
          
          user = user[0]

          if(!user.webhooks || !Array.isArray(user.webhooks)){
            res.json({msg:"",err:"Usuario selecionado nao possui webhooks cadastrados"})
            return
          }
          
          get.concat(`https://www.mercadobitcoin.net/api/${coin}/ticker/`, (err, getRes, data) => {
            if (err) throw err
            if(getRes.statusCode != 200){
              res.json({msg:"",err:"Erro no provedor de valores"})
              return
            }
            
            const newValues = Number(JSON.parse(data).ticker.last).toFixed(2)
            
            user.webhooks.forEach((value, key) => {
              
              app.infra.slackPusher(value, {"text":`A moeda ${coin} sofreu uma variação de ${variation}% e agora tem o valor de ${newValues}R$`})

            })

            res.json({msg:"Pushs enviados com successo",err:""})
          })
          
        })
    })
    
    /**
    * @api {get} /get-slack-webhooks Listar Canais
    * @apiGroup Private/Slack
    * @apiDescription Retorna uma lista com os canais slack cadastrados do usuário
    *
    *
    **/
    app.get("/get-slack-webhooks", privateTokenAuth, async (req, res) => {
        
        const token = req.get('x-api-token')
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const incomingUser = {
            token: token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let user = await apiUsersDAO.query(incomingUser)
          
          if(!user || !user[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }
          
          user = user[0]
          
          res.json({webhooks:user.webhooks})
          return
        })
    })
    
    /**
    * @api {delete} /delete-slack-webhook Deletar Canal
    * @apiGroup Private/Slack
    * @apiDescription Deleta quaisquer canais cadastrados que sejam iguais
    * ao parametro {notification}
    *
    *
    **/
    app.delete("/delete-slack-webhook", privateTokenAuth, async (req, res) => {
      
        const token = req.get('x-api-token')
        const notification = req.body.notification
        
        req.assert("notification","O campo notification e obrigatorio").notEmpty()
        
        var erros = req.validationErrors()
        if(erros){
          res.json({msg:"",err:JSON.stringify(erros)})
          return
        }
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const incomingUser = {
            token: token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let user = await apiUsersDAO.query(incomingUser)
          
          if(!user || !user[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }
          
          if(!Array.isArray(user[0].webhooks)){
            res.json({msg:"", err:"Usuario nao possui webhooks cadastrado"})
            return
          }
          
          user = user[0]
          
          user.webhooks = user.webhooks.filter(item => {return item != notification})
          
          let result = await apiUsersDAO.updateByid(user._id,user)
          
          res.json({msg:"Push deletado com successo",err:""})
          return
          
        })
        
    })
}

