console.log("Iniciando script")

const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const createDB = (dbName, server, port) => {

  const url = `mongodb://${server}:${port}/${dbName}`

  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    console.log("Database created!")
    db.close()
  })
}

const [dbName, dbServer, dbPort] = [process.env.dbName, process.env.dbServer, process.env.dbPort]

createDB(dbName, dbServer, dbPort)

console.log("Finalizando script")