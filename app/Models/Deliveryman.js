'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Deliveryman extends Model {
    
    avatar () {
        return this.belongsTo('App/Models/File')
    }
}

module.exports = Deliveryman
