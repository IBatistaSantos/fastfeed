'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliverymanSchema extends Schema {
  up () {
    this.create('deliverymen', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.integer('avatar_id').unsigned().references('id').inTable('files')
      table.timestamps()
    })
  }

  down () {
    this.drop('deliverymen')
  }
}

module.exports = DeliverymanSchema
