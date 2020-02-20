'use strict'

const Delivery = use('App/Models/Delivery')
const Recipient = use('App/Models/Recipient')
const Deliveryman = use('App/Models/Deliveryman')

class DeliveryController {
  async index ({ request, response, view }) {
    const delivery = await Delivery.query().with('recipients').with('deliveryman').fetch()
    return delivery
  }
  async store ({ request, response }) {
    const {product, recipient_id, deliveryman_id} = request.only(['product','recipient_id','deliveryman_id'])
    
    const recipient = await Recipient.findBy('id',recipient_id)
    if(!recipient) {
      return response.status(404).send({error: {message: 'Destinatário não foi encontrado'}})
    }
 
    const deliveryman = await Deliveryman.findBy('id',deliveryman_id)
    if(!deliveryman) {
      return response.status(404).send({error: {message: 'Não encontramos esse entregador'}})
    }

    const delivery = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id
    })
    return delivery
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }
  async destroy ({ params, request, response }) {
  }
}

module.exports = DeliveryController
