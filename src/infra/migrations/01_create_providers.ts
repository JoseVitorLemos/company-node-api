import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('providers', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('cpf').nullable()
		table.string('cnpj').nullable()
		table.string('phone').notNullable()
		table.date('birth_date').nullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('providers')
}
