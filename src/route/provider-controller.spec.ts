import request from 'supertest'
import knex from '../infra/database/connection'
import app from '../config/app'
import { cpf, cnpj } from 'cpf-cnpj-validator'

describe('Company Controller', () => {
	const server = request(app)

	afterAll(async () => { 
		knex.destroy()
	})

	const naturalPerson = {
		name: 'any_name',
		cpf: cpf.generate(),
		rg: 'any_rg', 
		phone: '63999999', 
		birth_date: '1995-05-05',
		company_id: 1
	}

	describe('POST', () => {
		test.only('Should return 201 if create natural person provider', async () => {
			const { body, statusCode } = await server
			.post('/provider')
			.send(naturalPerson)

			expect(statusCode).toBe(201)
			expect(body.id).toBeTruthy()
			expect(body.cpf).toBe(naturalPerson.cpf)
			expect(body.rg).toBe(naturalPerson.rg)
			expect(body.phone).toBe(naturalPerson.phone)
			expect(body.birth_date).toBeTruthy()
			expect(body.trade_name).toBeTruthy()
			expect(body.created_at).toBeTruthy()
		})	
	})	
})	


