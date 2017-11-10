const md5 = require("md5")
const request = require("request")
const get = require('simple-get')

module.exports = function(app){
    
    app.post("/newPushNotification", async (req, res) => {
      
        const email = req.body.email
        const newPush = req.body.notification
        const token = req.get('x-api-token')
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const incomingUser = {
            email: email,
            token: token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let user = await apiUsersDAO.query(incomingUser)
          
          if(!user || !user[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }
          user = user[0]

          (!user.webhooks)
            ? user.webhooks = [newPush]
            : user.webhooks.push(newPush)

          const result = await apiUsersDAO.updateByid(user._id, {webhooks:user.webhooks})
          
          res.json({user:user, msg:result.result})

        })
        
    })
    
    app.post("/sendPushNotification/:coin", async (req, res) => {

        const email = req.body.email
        const variation = req.body.variation
        const coin = req.params.coin
        const token = req.get('x-api-token')
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const incomingUser = {
            email: email,
            token: token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          let user = await apiUsersDAO.query(incomingUser)
          
          if(!user || !user[0]){
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            return
          }
          
          user = user[0]

          if(!user.webhooks){
            res.json({msg:"",err:"Usuario selecionado nao possui webhooks cadastrados"})
            return
          }
          
          get.concat(`https://www.mercadobitcoin.net/api/${coin}/ticker/`, function (err, getRes, data){
            if (err) throw err
            if(getRes.statusCode != 200){
              res.json({msg:"",err:"Erro no provedor de valores"})
              return
            }
            
            const newValues = Number(JSON.parse(data).ticker.last).toFixed(2)
            
            request.post('https://cryptomarketmonitor-gabdevilshunter.c9users.io/teste',
              function (error, response, body) {
                if (error) throw error
                if (response.statusCode != 200) {
                  res.json({msg:"",err:"Erro no envio dos webhooks"})
                  return
                }
            })
            .form({
              "text":`A moeda ${coin} sofreu uma variação de ${variation}% e agora tem o valor de ${newValues}R$`
            })
          
            res.json({msg:"Pushs enviados com successo",err:""})
          })
          
        })
    })
}

