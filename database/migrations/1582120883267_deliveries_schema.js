'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliveriesSchema extends Schema {
  up () {
    this.create('deliveries', (table) => {
      table.increments()
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
      table.integer('signature_id').unsigned().references('id').inTable('files')
      table.string('product').notNullable()
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
