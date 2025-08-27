const app = require('./app') // la aplicación Express real
const config = require('./utils/config') // Importamos para acceder a las variables de entorno
const logger = require('./utils/logger') // Importamos para la utilización del logger 

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })