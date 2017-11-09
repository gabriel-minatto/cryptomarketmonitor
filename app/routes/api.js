const get = require('simple-get');

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
    
    app.get("/teste", async (req, res) => {
        const teste = await app.infra.apiUsersDAO.query();
    });
}