import { Router } from 'express'
import knex from '../infra/database/connection'

const companyController = Router()

companyController.post('/', async (req, res) => {
	const { uf, trade_name, cnpj } = req.body

	try {
		const id = await knex('companys')
			.insert({
				uf,
				trade_name,
				cnpj,
				created_at: new Date()
			}).returning('id').then(id => id[0])

		const company = await knex('companys').where('id', id).first()

		res.status(201).json(company)

	} catch (err) {
		console.log(err)
		res.status(500).send({ statusCode: 500, 	message: 'Create company fail' })
	}
})

export default companyController
