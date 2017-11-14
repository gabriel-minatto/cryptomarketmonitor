const get = require('simple-get');
const md5 = require("md5");

module.exports = function(app){

    app.get('/moeda/:coin', function(req, res){
      const coin = req.params.coin
      
      req.assert("coin","Codigo de moeda invalido").isIn(['btc','ltc','bch'])
        
      var erros = req.validationErrors()
      if(erros){
        res.json({msg:"",err:JSON.stringify(erros)})
        return
      }
        
      get.concat(`https://www.mercadobitcoin.net/api/${coin}/ticker/`, function (err, getRes, data){
        if (err) throw err
        if(getRes.statusCode != 200){
          res.json({msg:"",err:"Erro no provedor de valores"})
          return
        }
        
        res.json(data.toString())
      });
        
    });
    
    app.post("/saveUser", async (req, res) => {
      
        const email = req.body.email;
        const token = md5(`${req.headers+new Date()}`);
        
        req.assert("email","O campo email e obrigatorio").notEmpty()
        
        var erros = req.validationErrors()
        if(erros){
          res.json({msg:"",err:JSON.stringify(erros)})
          return
        }
        
        app.infra.mongoConnectionFactory(async (err, conn) => {
          if(err) throw err
          
          const user = {
            email:email,
            token:token
          }
          
          const apiUsersDAO = new app.infra.apiUsersDAO(conn)
          const result = await apiUsersDAO.insert(user)
          
          res.json({user:user, msg:result.result});
          
        });
        
    });
}

