import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('persons', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('phone').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('persons')
}
