const mongoConnectionFactory = require('../app/infra/mongoConnectionFactory')()
const apiUsersDAOFunction = require('../app/infra/apiUsersDAO')()


const privateTokenAuth = (req, res, next) => {
      const token = req.get('x-api-token')
      
      mongoConnectionFactory(async (err, conn) => {
          
          const apiUsersDAO = new apiUsersDAOFunction(conn)
          let user = await apiUsersDAO.query({token:token})
          
          if(!user || !Array.isArray(user) || user.length == 0){
              res.status(401).render("erros/403")
              return
          }
          next()
      })
}


module.exports = function(){
    return privateTokenAuth
}