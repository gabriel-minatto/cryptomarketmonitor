console.log("Iniciando script")

const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const createDB = (user, password, dbName, server, port) => {

  const url = `mongodb://${user}:${password}@${server}:${port}/${dbName}`

  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    console.log("Database created!")
    db.close()
  })
}

const [dbUser, dbPassword, dbName, dbServer, dbPort] = 
  [process.env.dbUser, process.env.dbPassword, process.env.dbName, process.env.dbServer, process.env.dbPort]

createDB(dbUser, dbPassword, dbName, dbServer, dbPort)

console.log("Finalizando script")