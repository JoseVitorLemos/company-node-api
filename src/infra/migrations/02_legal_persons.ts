import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('legal_persons', table => {
		table.increments('id').primary()
		table.string('cnpj').nullable()

		table.integer('company_id')
			.notNullable()
			.references('id')
			.inTable('companys')

		table.integer('person_id')
			.notNullable()
			.references('id')
			.inTable('persons')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('legal_persons')
}
