import { Router } from 'express'
import knex from '../infra/database/connection'
import { cpfValidate, cnpjValidate, removeSymbols } from '../helper'
//import { validate } from 'class-validator'

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
		const cpfCheck = cpfValidate(cpf)

		if(!cpfCheck) return res.status(400).json({ statusCode: 400, message: 'Invalid cpf' })

		const id = await knex('providers').insert({
			name, 
			cpf: removeSymbols(cpf),
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
		const cnpjCheck = cnpjValidate(cpf)

		if(!cnpjCheck) return res.status(400).json({ statusCode: 400, message: 'Invalid cnpj' })

		const id = await knex('providers').insert({
			name, 
			cnpj: removeSymbols(cnpj),
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

providerRoute.get('/:id', async (req, res) => {
	const { id } = req.params

	const provider = await knex('providers').where('id', id).first()

	if(!provider) { 
		return res.status(400).json({
			statusCode: 400,
			message: 'Provider not found'
		}) 
	}
	res.status(200).json(provider)
})

export default providerRoute
