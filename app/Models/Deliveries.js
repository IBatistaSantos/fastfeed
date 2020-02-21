'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Deliveries extends Model {

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
