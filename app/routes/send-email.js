const md5 = require("md5")
const request = require("request")
const get = require('simple-get')
const nodemailer =require("nodemailer")
const privateTokenAuth = require('../../config/privateTokenAuth')()

module.exports = function(app){
    
    app.post("/send-email/:coin", privateTokenAuth, async (req, res) => {

        const variation = req.body.variation
        const coin = req.params.coin
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

          if(!user.email){
            res.json({msg:"",err:"Usuario selecionado nao esta com problema em seu endereco de email"})
            return
          }
          
          get.concat(`https://www.mercadobitcoin.net/api/${coin}/ticker/`, (err, getRes, data) => {
            if (err) throw err
            if(getRes.statusCode != 200){
              res.json({msg:"",err:"Erro no provedor de valores"})
              return
            }
            
            const newValues = Number(JSON.parse(data).ticker.last).toFixed(2)
            
            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: "CryptoMarketMonitor <gabdevilshunter@gmail.com>", // sender address
              to: user.email, // list of receivers
              subject: "Variação no preço de crypto moedas", // Subject line
              text: `A moeda ${coin} sofreu uma variação de ${variation}% e agora tem o valor de ${newValues}R$` // plaintext body
            }
            
            app.infra.nodeMailer(mailOptions, (err, result) => {
              res.json({msg:"Email enviado com successo", response:result.response, err:err})
            })

          })
          
        })
    })
    
    app.get("/get-email", privateTokenAuth, async (req, res) => {
        
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
          
          res.json({email:user.email})
          return
        })
    })
    
    app.put("/change-email", privateTokenAuth, async (req, res) => {
        
        const token = req.get('x-api-token')
        const newEmail = req.body.email
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          const result = await apiUsersDAO.update({token:token},{$set:{email:newEmail}})
          
          res.json({msg:"Email alterado com sucesso",err:""})
          return
          
        })
        
    })
}

