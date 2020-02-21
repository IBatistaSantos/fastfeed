'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliveriesSchema extends Schema {
  up () {
    this.create('deliveries', (table) => {
      table.increments()
      table.string('product').notNullable()
      table.integer('recipient_id')
        .unsigned()
        .references('id')
        .inTable('recipients')
        .notNullable()

      table.integer('deliveryman_id')
      .unsigned()
      .references('id')
      .inTable('deliverymen')
      .notNullable()

      table.integer('file_id').unsigned().references('id').inTable('files')
      table.timestamp('canceled_at')
      table.timestamp('start_at')
      table.timestamp('end_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('deliveries')
  }
}

module.exports = DeliveriesSchema
