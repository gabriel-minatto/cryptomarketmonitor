var MongoClient = require('mongodb').MongoClient;
/*var databaseName = "aulalivre_chat",
    server = "127.0.0.1",
    port = 27017;*/

module.exports = function(dbName, server, port){

  //var url = `mongodb://${server}:${port}/${dbName}`;
  var url = `mongodb://localhost:27017/crypto_api`;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
}

