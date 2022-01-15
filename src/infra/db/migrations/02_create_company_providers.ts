import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('companys_providers', table => {
		table.increments('id').primary()
		table.string('company_id')
			.notNullable()
			.references('id')
			.inTable('Companys')
		table.string('provider_id')
			.notNullable()
			.references('id')
			.inTable('Providers')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('companys_providers')
}
