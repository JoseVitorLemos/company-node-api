import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('natural_persons', table => {
		table.increments('id').primary()
		table.string('cpf').notNullable()
		table.string('rg').notNullable()
		table.date('birth_date').notNullable()

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
	return knex.schema.dropTable('natural_person')
}
