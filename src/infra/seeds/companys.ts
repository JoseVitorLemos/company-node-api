import { Knex } from 'knex'
import { cnpj } from 'cpf-cnpj-validator'

export const seed = async (knex: Knex): Promise<void> => {
	await knex('companys').insert([
		{ uf: 'TO', trade_name: 'Empresa 1', cnpj: cnpj.generate(), created_at: new Date() },
		{ uf: 'SP', trade_name: 'Empresa 2', cnpj: cnpj.generate(), created_at: new Date() },
		{ uf: 'GO', trade_name: 'Empresa 3', cnpj: cnpj.generate(), created_at: new Date() },
		{ uf: 'RJ', trade_name: 'Empresa 4', cnpj: cnpj.generate(), created_at: new Date() },
		{ uf: 'MG', trade_name: 'Empresa 5', cnpj: cnpj.generate(), created_at: new Date() },
		{ uf: 'AM', trade_name: 'Empresa 6', cnpj: cnpj.generate(), created_at: new Date() }
	])
}
