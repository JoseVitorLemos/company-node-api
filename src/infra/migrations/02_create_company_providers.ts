import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('companys_providers', table => {
		table.increments('id').primary()

		table.integer('company_id')
			.notNullable()
			.references('id')
			.inTable('companys')

		table.integer('provider_id')
			.notNullable()
			.references('id')
			.inTable('providers')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('companys_providers')
}
