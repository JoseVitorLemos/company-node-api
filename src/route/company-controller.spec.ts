import request from 'supertest'
import knex from '../infra/database/connection'
import app from '../config/app'
import { cnpj } from 'cpf-cnpj-validator'

describe('Company Controller', () => {
	const server = request(app)

	afterAll(() => knex.destroy())

	const mockCompany = {
		uf: 'TO',
		trade_name: 'Empresa 1', 
		cnpj: cnpj.generate()
	}

	describe('POST', () => {
		test('Should return 201 if trying create company with valid values', async () => {
			const { body, statusCode } = await server
			.post('/company')
			.send(mockCompany)

			expect(statusCode).toBe(201)
			expect(body.id).toBeTruthy()
			expect(body.created_at).toBeTruthy()
			expect(body.uf).toBe(mockCompany.uf)
			expect(body.trade_name).toBe(mockCompany.trade_name)
			expect(body.cnpj).toBe(mockCompany.cnpj)
		})	
	})
})


