import express from 'express'
import routes from '../route'
import bodyParser from '../infra/middleware/body-parser'

const app = express()

app.use(bodyParser)

app.use(routes)

export default app
