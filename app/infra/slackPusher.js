const request = require('request')

const sendSlack = async (url, body) => {
    
    const params = {
      url:     url,
      body:    JSON.stringify(body)
    }

    request.post(params,(error, response, body) => {
        if (error) throw error
        if (response.statusCode != 200) {
            console.log(`Erro no envio webhook de uma requisicao.\n${params.body}`)
            console.log(`Response:\n${JSON.stringify(response)}`)
        }
    })
    
}

module.exports = function(){
    return sendSlack
}