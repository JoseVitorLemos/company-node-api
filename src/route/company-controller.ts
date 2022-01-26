import { Router } from 'express'
import knex from '../infra/database/connection'
import { CompanyDto } from './dto'
import { validate } from 'class-validator'
import { cnpjValidate, removeSymbols } from '../helper'

const companyController = Router()

companyController.post('/', async (req, res) => {
	const { uf, trade_name, cnpj } = req.body

	if(!cnpjValidate(cnpj)) return res.status(400).json({ statusCode: 400, message: 'invalid cnpj' })

	const repo = new CompanyDto(uf, trade_name, cnpj)

	validate(repo).then(async err => {
		if (err.length) {
			const message = err.map(prop => prop.constraints) 
		  console.log('Invalid params')
			return res.status(400).json({
				statusCode: 400,
				message: message
		  })
		} else {
			try {
				const id = await knex('companys')
				.insert({
					uf,
					trade_name,
					cnpj: removeSymbols(cnpj),
					created_at: new Date(),
				}).returning('id').then(id => id[0])

				const company = await knex('companys').where('id', id).first()

				return res.status(201).json(company)
			} catch (err) {
				console.log(err)
				return res.status(500).send({ statusCode: 500, 	message: 'Company registration failure' })
			}
		}
	})
})

companyController.get('/', async (_req, res) => {
	const company = await knex('*').from('companys')
	if(!company) res.status(404).json({ statusCode: 404, message: 'Company not found' })
	res.status(200).json(company)
})

export default companyController
