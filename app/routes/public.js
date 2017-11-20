const get = require('simple-get');
const md5 = require("md5");

module.exports = function(app){
  
    /**
    * @api {get, post} / Autenticação
    * @apiName Autenticação
    * @apiGroup Geral
    * @apiDescription Autenticação
    *
    * Para ter permissão as chamadas das rotas publicas desta API, é preciso enviar uma chave de API (apiKey) válida no
    * cabeçalho de todas as requisições. Para as rotas privadas, é preciso enviar também um para token que é
    * retornado no ato de cadastro.
    * Para solicitar sua chave entre em contato com a nossa equipe.
    * Todos os parâmetros recebidos no corpo do documento devem se passados no formato "x-www-form-urlencoded".
    *
    * x-api-key /
    * x-api-token
    *
    **/
  
    /**
    * @api {get} /moeda/codigo_da_moeda Moedas
    * @apiName Moedas
    * @apiGroup Public
    * @apiDescription Lista os dados atualizados de determinada moeda [btc, ltc, bch]
    *
    *
    **/
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

        res.json(JSON.parse(data))
      });
        
    });
    
    /**
    * @api {post} /saveUser Novo Usuário
    * @apiName saveUser
    * @apiGroup Public
    * @apiDescription Salva um novo usuário recebendo o(os) parametro(os) {email}
    *
    *
    **/
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

