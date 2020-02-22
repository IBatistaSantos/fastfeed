'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {parseISO, format} = require('date-fns')
class Deliveries extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeSave', async (deliveriesInstance) => {
      if (deliveriesInstance.dirty.start_at) {
        deliveriesInstance.start_at = parseISO(deliveriesInstance.start_at)
      }
      if (deliveriesInstance.dirty.end_at) {
        deliveriesInstance.end_at = parseISO(deliveriesInstance.end_at)
      }
      if (deliveriesInstance.dirty.canceled_at) {
        deliveriesInstance.canceled_at = parseISO(deliveriesInstance.canceled_at)
      }

    })
  }
    recipients() {
        return this.belongsTo('App/Models/Recipient')
    }

    deliveryman() {
        return this.belongsTo('App/Models/Deliveryman')
    }

    signature () {
       return  this.belongsTo('App/Models/File')
    }
}

module.exports = Deliveries
