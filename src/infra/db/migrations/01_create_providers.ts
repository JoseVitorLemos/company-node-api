import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('Providers', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('cpf').notNullable()
		table.string('cnpj').notNullable()
		table.string('phone').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').notNullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('Providers')
}
