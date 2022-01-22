import { Router } from 'express'
import companyRoute from './company-controller'

const routes = Router()

routes.use('/company', companyRoute)

export default routes



