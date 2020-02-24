'use strict'
const Delivery = use('App/Models/Deliveries')
const { parseISO, getHours } = require('date-fns')
class ControlDeliverymanController {
  async index ({ params }) {
    const delivery = await Delivery.query().where({
      deliveryman_id: params.id,
      end_at: null,
      canceled_at: null
    }).fetch()
    return delivery
  }

  async store ({ request, response, params }) {
    const { startAt, endAt, canceledAt } = request.only(['start_at', 'end_at', 'canceled_at'])
    const delivery = await Delivery.findOrFail(params.id)

    if (endAt && delivery.start_at === null) {
      return response.status(400).send({
        error: {
          message:
        'Você não pode finalizar uma entrega sem antes tirar a encomendas'
        }
      })
    }
    const numberPackage = await Delivery.query()
      .where('start_at', parseISO(startAt)).fetch()

    if (numberPackage.toJSON().length >= 5) {
      return response.status(400).send({
        error: { message: 'Você já fez 5 entregadas hoje' }
      })
    }

    if (startAt) {
      if (!(getHours(parseISO(startAt)) >= 8 && getHours(parseISO(startAt)) <= 18)) {
        return response.status(400).send({
          error: {
            message: 'Você só pode retirar encomendas das 08 ás 18hrs'
          }
        })
      }
    }

    delivery.merge({
      start_at: startAt,
      end_at: endAt,
      canceled_at: canceledAt
    })
    await delivery.save()
    return delivery
  }
}

module.exports = ControlDeliverymanController
