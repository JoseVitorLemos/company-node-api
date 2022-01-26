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
				try {
					const company = await knex('companys').where('id', company_id).first()

					if(!company) return res.status(404).json({ statusCode: 404, message: 'Company not found' })

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

					const naturalPerson = await transaction('natural_persons').where('natural_persons.id', provider_id).first()
					.join('persons', 'natural_persons.person_id', '=', 'persons.id')
					.join('companys', 'natural_persons.company_id', '=', 'companys.id')
					.select('natural_persons.id', 'natural_persons.cpf', 'natural_persons.rg', 'natural_persons.birth_date', 'persons.name', 'persons.phone', 'companys.trade_name', 'persons.created_at')

					await transaction.commit()

					return res.status(201).json(naturalPerson)
				} catch (err) {
					console.log(err)
					return res.status(500).send({ statusCode: 500, 	message: 'Internal Server Error' })
				}
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
				try {
					const company = await knex('companys').where('companys.id', company_id).first()

					if(!company) return res.status(400).json({ statusCode: 400, message: 'Comapny not found' })

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

					const legalPerson = await transaction('legal_persons').where('legal_persons.id', provider_id).first()
					.join('persons', 'legal_persons.person_id', '=', 'persons.id')
					.join('companys', 'legal_persons.company_id', '=', 'companys.id')
					.select('legal_persons.id', 'legal_persons.cnpj', 'persons.name', 'persons.phone', 'companys.trade_name', 'persons.created_at')

					await transaction.commit()

					return res.status(201).json(legalPerson)
 				} catch (err) {
					console.log(err)
					return res.status(500).send({ statusCode: 500, 	message: 'Internal Server Error' })
				}
	  	}
		})
	}
})

providerRoute.get('/', async (req, res) => {
	const { cpf, cnpj, birth_date } = req.query

	if(cpf) {
		const provider = await knex('natural_persons').where('natural_persons.cpf', removeSymbols(cpf!.toString()))
		.join('persons', 'natural_persons.person_id', '=', 'persons.id')
		.join('companys', 'natural_persons.company_id', '=', 'companys.id')
		.select('natural_persons.id', 'natural_persons.cpf', 'natural_persons.rg', 'natural_persons.birth_date', 'persons.name', 'persons.phone', 'companys.trade_name', 'persons.created_at')

		if(!provider) return res.status(404).json({ statusCode: 404, message: 'Provider not found' })

		return res.status(200).json(provider)
	}

	if(cnpj) {
		const provider = await knex('legal_persons').where('legal_persons.cnpj', removeSymbols(cnpj.toString()))
		.join('persons', 'legal_persons.person_id', '=', 'persons.id')
		.join('companys', 'legal_persons.company_id', '=', 'companys.id')
		.select('legal_persons.id', 'legal_persons.cnpj', 'persons.name', 'persons.phone', 'companys.trade_name', 'persons.created_at')

		if(!provider) return res.status(404).json({ statusCode: 404, message: 'Provider Not found' })

		return res.status(200).json(provider)
	}

	if(birth_date) {
		const provider = await knex('natural_persons').where('natural_persons.birth_date', birth_date.toString())
		.join('persons', 'natural_persons.person_id', '=', 'persons.id')
		.join('companys', 'natural_persons.company_id', '=', 'companys.id')
		.select('natural_persons.id', 'natural_persons.cpf', 'natural_persons.rg', 'natural_persons.birth_date', 'persons.name', 'persons.phone', 'companys.trade_name', 'persons.created_at')

		if(!provider) return res.status(404).json({ statusCode: 404, message: 'Provider not found' })

		return res.status(200).json(provider)
	}

	return res.status(400).send([])
})

export default providerRoute
