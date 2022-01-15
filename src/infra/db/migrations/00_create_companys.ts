import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('Companys', table => {
		table.increments('id').primary()
		table.string('uf').notNullable()
		table.string('nome_fantasia').notNullable()
		table.string('cnpj').notNullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('Companys')
}
