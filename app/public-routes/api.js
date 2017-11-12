const get = require('simple-get');
const md5 = require("md5");

module.exports = function(app){

    app.get('/btc', function(req, res){
        get.concat('https://www.mercadobitcoin.net/api/BTC/ticker/', function (err, getRes, data){
          if (err) throw err
          if(getRes.statusCode == 200)
            res.set('Content-Type', 'application/json');
            res.send(data.toString());
        });
        
    });
    
    app.get('/ltc', function(req, res){
        get.concat('https://www.mercadobitcoin.net/api/LTC/ticker/', function (err, getRes, data){
          if (err) throw err
          if(getRes.statusCode == 200)
            res.set('Content-Type', 'application/json');
            res.send(data.toString());
        });
        
    });
    
    app.get('/bch', function(req, res){
        get.concat('https://www.mercadobitcoin.net/api/BCH/ticker/', function (err, getRes, data){
          if (err) throw err
          if(getRes.statusCode == 200)
            res.set('Content-Type', 'application/json');
            res.send(data.toString());
        });
        
    });
    
    app.post("/saveUser", async (req, res) => {
      
        const email = req.body.email;
        const token = md5(`${req.headers+new Date()}`);
        
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

