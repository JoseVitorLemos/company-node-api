import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('Companys', table => {
		table.increments('id').primary()
		table.string('uf').notNullable()
		table.string('trade_name').notNullable()
		table.string('cnpj').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()
		})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('Companys')
}
