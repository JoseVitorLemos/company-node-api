import { Router } from 'express'
import knex from '../infra/database/connection'
import { cpfValidate, cnpjValidate, removeSymbols, getAge } from '../helper'
import { NaturalPersonDto, LegalPersonDto } from './dto'
import { validate } from 'class-validator'

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

	if(getAge(birth_date) < 18) {
		return res.status(400).json({ 
			statusCode: 400, 
			message: 'Is not allowed to register a minor, as a provider natural person' 
		})
	}

	const naturalPersonValidate = new NaturalPersonDto(name, phone, cpf, rg, birth_date, company_id)

	if(cpf) {
		const cpfCheck = cpfValidate(cpf)

		if(!cpfCheck) return res.status(400).json({ statusCode: 400, message: 'Invalid cpf' })

		validate(naturalPersonValidate).then(async err => {
	  	if (err.length) {
				const message = err.map(prop => prop.constraints) 
		  	console.log('Invalid params')
				return res.status(400).json({
					statusCode: 400,
					message: message
		  	})
			} else {
				const company = await knex('companys').where('id', company_id).first()

				if(!company) return res.status(400).json({ statusCode: 400, message: 'None company was found'  })

				const transaction = await knex.transaction()

				const person_id = await transaction('persons').insert({
					name, 
					phone, 
					created_at: new Date()
				}).returning('id').then(id => id[0])

				const provider_id = await transaction('natural_persons').insert({
					cpf: removeSymbols(cpf),
					rg, 
					birth_date, 
					company_id, 
					person_id
				}).returning('id').then(id => id[0])

				await transaction.commit()

				const naturalPerson = await knex('natural_persons').where('id', provider_id).first()

				const person = await knex('persons').where('id', person_id).first()

				return res.status(201).json(Object.assign({}, naturalPerson, person))
	  	}
		})
	}

	const legalPersonValidate = new LegalPersonDto(name, phone, cnpj, company_id)

	if(cnpj) {
		const cnpjCheck = cnpjValidate(cnpj)

		if(!cnpjCheck) return res.status(400).json({ statusCode: 400, message: 'Invalid cnpj' })

		validate(legalPersonValidate).then(async err => {
	  	if (err.length) {
				const message = err.map(prop => prop.constraints) 
		  	console.log('Invalid params')
				return res.status(400).json({
					statusCode: 400,
					message: message
		  	})
			} else {
				const company = await knex('companys').where('id', company_id).first()

				if(!company) return res.status(400).json({ statusCode: 400, message: 'None company was found'  })

				const transaction = await knex.transaction()

				const person_id = await transaction('persons').insert({
					name,
					phone,
					created_at: new Date()
				}).returning('id').then(id => id[0])

				const provider_id = await transaction('legal_persons').insert({
					cnpj: removeSymbols(cnpj),
					company_id,
					person_id
				}).returning('id').then(id => id[0])

				await transaction.commit()

				const legalPerson = await knex('legal_persons').where('id', provider_id).first()

				const person = await knex('persons').where('id', person_id).first()

				return res.status(201).json(Object.assign({}, legalPerson, person, { company_name: company.trade_name }))
	  	}
		})
	}
})

export default providerRoute

