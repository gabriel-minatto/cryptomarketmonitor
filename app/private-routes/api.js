const md5 = require("md5");

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
          
          if(!user || !user[0])
            res.json({msg:"",err:"Usuario nao encontrado ou token invalido"})
            
          user = user[0]

          (!user.webhooks)
            ? user.webhooks = [newPush]
            : user.webhooks.push(newPush)

          const result = await apiUsersDAO.updateByid(user._id, {webhooks:user.webhooks})
          
          res.json({user:user, msg:result.result});

        });
        
    });
}

