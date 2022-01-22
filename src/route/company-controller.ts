import { Router } from 'express'

const companyController = Router()

companyController.get('/', (req, res) => {
	res.send('Ok!')
})

export default companyController
