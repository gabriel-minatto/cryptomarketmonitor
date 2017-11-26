var db = require('./mongoConnectionFactory')()
const ObjectID = require('mongodb').ObjectID

function apiUsersDAO(conn){
    this._collection = conn.collection("apiUsers")
}

apiUsersDAO.prototype.query = async function(query={}){
    return await this._collection.find(query).toArray()
}

apiUsersDAO.prototype.queryById = async function(id){
    return await this._collection.find({"_id":ObjectID(id)})
}

apiUsersDAO.prototype.fieldsQuery = async function(query={}, fields={}){
    return await this._collection.find(query, fields).toArray()
}

apiUsersDAO.prototype.insert = async function(user){
    return await this._collection.insert(user)
}

apiUsersDAO.prototype.update = async function(query, params, config){
    return await this._collection.update(query, params, config)
}

apiUsersDAO.prototype.updateByid = async function(id, setters){
    return await this._collection.update({"_id":ObjectID(id)},{ $set: setters })
}

apiUsersDAO.prototype.updateSetMult = async function(query, setters){
    return await this._collection.update(query,{ $set: setters },{ multi:true })
}

module.exports = function(){
    return apiUsersDAO
};