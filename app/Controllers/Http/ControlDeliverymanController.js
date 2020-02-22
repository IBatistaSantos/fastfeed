'use strict'
const Delivery = use('App/Models/Deliveries')
const {parseISO} = require('date-fns')
class ControlDeliverymanController {
  async index ({params}) {
    const delivery = await Delivery.query().where({'deliveryman_id':params.id,
  'end_at':null,
  'canceled_at':null
  }).fetch()
    return delivery
  }

  async store ({request, response, params}) {
    const {start_at, end_at, canceled_at} = request.only(['start_at','end_at','canceled_at'])
    const delivery = await Delivery.findOrFail(params.id)

    if(end_at && delivery.start_at===null) {
        return response.status(400).send({error : {message:
        'Você não pode finalizar uma entrega sem antes tirar a encomendas'
        }})
    }
    const numberPackage = await Delivery.query()
    .where('start_at', parseISO(start_at)).fetch()

    if(numberPackage.toJSON().length >= 5) {
      return response.status(400).send({error: {
        message: 'Você já fez 5 entregadas hoje'}})
    }

      delivery.merge({
        start_at,
        end_at,
        canceled_at
      })
      await delivery.save()
      return delivery
  }
}

module.exports = ControlDeliverymanController
