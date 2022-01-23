import express from 'express'
import routes from '../route'
import bodyParser from '../infra/middleware/body-parser'
import logRequest from '../infra/middleware/log-request'

const app = express()

app.use(bodyParser)

logRequest(app)

app.use(routes)

export default app
