define({ "api": [
  {
    "type": "get, post",
    "url": "/",
    "title": "Autenticação",
    "name": "Autentica__o",
    "group": "Geral",
    "description": "<p>Autenticação</p> <p>Para ter permissão as chamadas das rotas publicas desta API, é preciso enviar uma chave de API (apiKey) válida no cabeçalho de todas as requisições. Para as rotas privadas, é preciso enviar também um para token que é retornado no ato de cadastro. Para solicitar sua chave entre em contato com a nossa equipe. Todos os parâmetros recebidos no corpo do documento devem se passados no formato &quot;x-www-form-urlencoded&quot;.</p> <p>x-api-key / x-api-token</p>",
    "version": "0.0.0",
    "filename": "app/routes/public.js",
    "groupTitle": "Geral"
  },
  {
    "type": "get",
    "url": "/get-email",
    "title": "Ver email",
    "group": "Private_Email",
    "description": "<p>Retorna o email do usuário</p>",
    "version": "0.0.0",
    "filename": "app/routes/send-email.js",
    "groupTitle": "Private_Email",
    "name": "GetGetEmail"
  },
  {
    "type": "post",
    "url": "/send-email/codigo_da_moeda",
    "title": "Enviar email",
    "group": "Private_Email",
    "description": "<p>Envia uma notificação ao email do usuário o(os) parametro(os) {variation}</p>",
    "version": "0.0.0",
    "filename": "app/routes/send-email.js",
    "groupTitle": "Private_Email",
    "name": "PostSendEmailCodigo_da_moeda"
  },
  {
    "type": "put",
    "url": "/change-email",
    "title": "Alterar email",
    "group": "Private_Email",
    "description": "<p>Altera o endereço de email do usuário o(os) parametro(os) {email}</p>",
    "version": "0.0.0",
    "filename": "app/routes/send-email.js",
    "groupTitle": "Private_Email",
    "name": "PutChangeEmail"
  },
  {
    "type": "delete",
    "url": "/delete-slack-webhook",
    "title": "Deletar Canal",
    "group": "Private_Slack",
    "description": "<p>Deleta quaisquer canais cadastrados que sejam iguais ao parametro {notification}</p>",
    "version": "0.0.0",
    "filename": "app/routes/slack-webhooks.js",
    "groupTitle": "Private_Slack",
    "name": "DeleteDeleteSlackWebhook"
  },
  {
    "type": "get",
    "url": "/get-slack-webhooks",
    "title": "Listar Canais",
    "group": "Private_Slack",
    "description": "<p>Retorna uma lista com os canais slack cadastrados do usuário</p>",
    "version": "0.0.0",
    "filename": "app/routes/slack-webhooks.js",
    "groupTitle": "Private_Slack",
    "name": "GetGetSlackWebhooks"
  },
  {
    "type": "post",
    "url": "/new-slack-webhook",
    "title": "Novo Canal Slack",
    "group": "Private_Slack",
    "description": "<p>Adiciona um novo canal (slack incoming webhook) para envio de notificações recebendo o(os) parametro(os) {notification}</p>",
    "version": "0.0.0",
    "filename": "app/routes/slack-webhooks.js",
    "groupTitle": "Private_Slack",
    "name": "PostNewSlackWebhook"
  },
  {
    "type": "post",
    "url": "/send-slack-notification/codigo_da_moeda",
    "title": "Enviar Notificação",
    "group": "Private_Slack",
    "description": "<p>Dispara notificações sobre alterações nas moedas para os canais cadastrados do usuários recebendo o(os) parametro(os) {variation}</p>",
    "version": "0.0.0",
    "filename": "app/routes/slack-webhooks.js",
    "groupTitle": "Private_Slack",
    "name": "PostSendSlackNotificationCodigo_da_moeda"
  },
  {
    "type": "get",
    "url": "/moeda/codigo_da_moeda",
    "title": "Moedas",
    "name": "Moedas",
    "group": "Public",
    "description": "<p>Lista os dados atualizados de determinada moeda [btc, ltc, bch]</p>",
    "version": "0.0.0",
    "filename": "app/routes/public.js",
    "groupTitle": "Public"
  },
  {
    "type": "post",
    "url": "/saveUser",
    "title": "Novo Usuário",
    "name": "saveUser",
    "group": "Public",
    "description": "<p>Salva um novo usuário recebendo o(os) parametro(os) {email}</p>",
    "version": "0.0.0",
    "filename": "app/routes/public.js",
    "groupTitle": "Public"
  }
] });
