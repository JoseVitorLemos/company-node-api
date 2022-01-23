import { Router } from 'express'
import companyRoute from './company-controller'
import providerRoute from './provider-controller'

const routes = Router()

routes.use('/company', companyRoute)
routes.use('/provider', providerRoute)

export default routes



