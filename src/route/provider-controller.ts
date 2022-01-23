import { Router } from 'express'
import knex from '../infra/database/connection'

const providerRoute = Router()

providerRoute.post('/', async (req, res) => {
	const { 
		name, 
		cpf, 
		rg, 
		cnpj, 
		phone, 
		birth_date, 
		company_id
	} = req.body

	if(cpf) {
		const id = await knex('providers').insert({
			name, 
			cpf, 
			rg, 
			phone, 
			birth_date, 
			company_id, 
			created_at: new Date()
		}).returning('id').then(id => id[0])

		const naturalPerson = await knex('providers').where('id', id).first()

		return res.status(201).json(naturalPerson)
	}

	if(cnpj) {
		const id = await knex('providers').insert({
			name, 
			cnpj, 
			phone, 
			company_id, 
			created_at: new Date()
		}).returning('id').then(id => id[0])

		const legalPerson = await knex('providers').where('id', id).first()

		return res.status(201).json({
			id: legalPerson.id,
			name: legalPerson.name,
			cnpj: legalPerson.cnpj,
			phone: legalPerson.phone,
			company_id: legalPerson.company_id,
			created_at: legalPerson.created_at
		})
	}
})

export default providerRoute
