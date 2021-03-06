'use strict'

const Deliveries = use('App/Models/Deliveries')
const Recipient = use('App/Models/Recipient')
const Deliveryman = use('App/Models/Deliveryman')
const Mail = use('Mail')

class DeliveryController {
  async index () {
    const delivery = await Deliveries.query()
      .with('recipients')
      .with('deliveryman')
      .with('signature').fetch()
    return delivery
  }

  async store ({ request, response }) {
    try {
      const { product, recipientId, deliverymanId } = request.only(['product', 'recipientId', 'deliverymanId'])
      const recipient = await Recipient.findBy('id', recipientId)
      if (!recipient) {
        return response.status(404).send({ error: { message: 'Destinatário não foi encontrado' } })
      }
      const deliveryman = await Deliveryman.findBy('id', deliverymanId)

      if (!deliveryman) {
        return response.status(404).send({ error: { message: 'Não encontramos esse entregador' } })
      }

      const delivery = await Deliveries.create({
        product,
        recipient_id: recipientId,
        deliveryman_id: deliverymanId
      })

      await Mail.send(
        ['emails.new_delivery'],
        {
          product: delivery.product,
          street: recipient.street,
          number: recipient.number,
          zip_code: recipient.zip_code,
          city: recipient.city,
          state: recipient.state
        },
        message => {
          message
            .to(deliveryman.email)
            .from('logistica@fastfeed.com', 'Logistica | FastFeed')
            .subject('Entrega para você - FastFeed')
        })

      return delivery
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Algo deu errado, verifique as informações passadas' }
      })
    }
  }

  async show ({ params }) {
    const delivery = await Deliveries.findOrFail(params.id)
    await delivery.loadMany(['recipients', 'deliveryman'])
    return delivery
  }

  async update ({ params, request, response }) {
    const { recipientId, deliverymanId } = request.only(['recipient_id', 'deliveryman_id'])
    const delivery = await Deliveries.findOrFail(params.id)
    let recipient = null

    if (recipientId) {
      recipient = await Recipient.findBy('id', recipientId)
      if (!recipient) {
        return response.status(404).send({
          error: { message: 'Destinatário não foi encontrado' }
        })
      }
    }

    if (deliverymanId) {
      const deliveryman = await Deliveryman.findOrFail(deliverymanId)

      if (!recipientId) {
        recipient = await delivery.recipients().fetch()
      }
      await Mail.send(
        ['emails.new_delivery'],
        {
          product: delivery.product,
          street: recipient.street,
          number: recipient.number,
          zip_code: recipient.zip_code,
          city: recipient.city,
          state: recipient.state
        },
        message => {
          message
            .to(deliveryman.email)
            .from('logistica@fastfeed.com', 'Logistica | FastFeed')
            .subject('Entrega para você - FastFeed')
        })
    }
    delivery.merge({ recipient_id: recipientId, deliveryman_id: deliverymanId })
    await delivery.save()
    return delivery
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = DeliveryController
