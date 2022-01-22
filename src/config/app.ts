import express from 'express'
import routes from '../route'

const app = express()

app.use(routes)

export default app
