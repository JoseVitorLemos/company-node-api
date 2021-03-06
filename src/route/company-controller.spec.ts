import request from 'supertest'
import knex from '../infra/database/connection'
import app from '../config/app'
import { cnpj } from 'cpf-cnpj-validator'

describe('Company Controller', () => {
	const server = request(app)

	afterAll(async () => { 
		knex.destroy()
	})

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

		test('Should return 400 if uf is no provided', async () => {
			const { body, statusCode } = await server 
			.post('/company')
			.send({ 
				trade_name: 'Empresa 1', 
				cnpj: cnpj.generate(), 
			})
			expect(statusCode).toBe(400)
			expect(body.message).toEqual([
			  {
			    isString: 'uf must be a string',
			    isLength: 'uf must be two characters'
			  }
			])
		})		

		test('Should return 400 if trade name is no provided', async () => {
			const { body, statusCode } = await server 
			.post('/company')
			.send({ 
				uf: 'TO',	
				cnpj: cnpj.generate(), 
			})
			expect(statusCode).toBe(400)
			expect(body.message).toEqual([{
				isLength: "trade_name must be longer than or equal to 4 characters", 
				isString: "trade_name must be a string"
			}
			])
		})	

		test('Should return 400 if cnpj is no provided', async () => {
			const { body, statusCode } = await server 
			.post('/company')
			.send({ 
				uf: 'TO',	
				trade_name: 'Empresa 1', 
				created_at: new Date() 
			})
			expect(statusCode).toBe(400)
			expect(body.message).toBe('invalid cnpj')
		})	
	})

	describe('GET', () => {
		let id: number

		beforeEach(async () => {
			const { body } = await server.post('/company').send(mockCompany)
			id = body.id
		})

		test('Should return 200 if find company success', async () => {
			const { body, statusCode } = await request(app).get('/company')

			expect(statusCode).toBe(200)
			expect(body).toBeTruthy()
		})

		test('Should return 200 if sucesss deleting', async () => {
			const { statusCode, text, body } = await server.delete(`/company/${id}`)

			expect(statusCode).toBe(200)
			expect(text).toStrictEqual(`"\Company with id ${id} deleted successfully\"`)
		})
	})
})
