'use strict'

const Deliveries = use('App/Models/Deliveries')
const Recipient = use('App/Models/Recipient')
const Deliveryman = use('App/Models/Deliveryman')
const Mail = use('Mail')

class DeliveryController {
  async index () {
    const delivery = await Delivery.query().with('recipients').with('deliveryman').fetch()
    return delivery
  }
  async store ({ request, response }) {
    try {
      const {product, recipient_id, deliveryman_id} = request.only(['product','recipient_id','deliveryman_id'])
      console.log(recipient_id, deliveryman_id)
    const recipient = await Recipient.findBy('id',recipient_id)
    if(!recipient) {
      return response.status(404).send({error: {message: 'Destinatário não foi encontrado'}})
    }
    const deliveryman = await Deliveryman.findBy('id',deliveryman_id)

    if(!deliveryman) {
      return response.status(404).send({error: {message: 'Não encontramos esse entregador'}})
    }

    const delivery = await Deliveries.create({
      product,
      recipient_id,
      deliveryman_id
    })
    console.log(delivery)


    await Mail.send(
      ['emails.new_delivery'],
      {
        product: delivery.product,
        street: recipient.street,
        number:recipient.number,
        zip_code:recipient.zip_code,
        city:recipient.city,
        state:recipient.state
     },
      message => {
        message
        .to(deliveryman.email)
        .from('logistica@fastfeed.com','Logistica | FastFeed')
        .subject('Entrega para você - FastFeed')
      })

      return delivery

    } catch (error) {
      return response.status(error.status).send({error: {
        message: 'Algo deu errado, verifique as informações passadas'}})

    }
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }
  async destroy ({ params, request, response }) {
  }
}

module.exports = DeliveryController
