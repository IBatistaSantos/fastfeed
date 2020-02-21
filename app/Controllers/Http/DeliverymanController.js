'use strict'
const Deliveryman = use('App/Models/Deliveryman')
class DeliverymanController {
  async index () {
    const deliveryman = await Deliveryman.query().with('avatar').fetch()
    return deliveryman
  }

  async store ({ request }) {
    const data = request.only(['name', 'at'])
    const deliveryman = await Deliveryman.create(data)
    return deliveryman
  }

  async show ({ params}) {
    const deliveryman = await Deliveryman.findOrFail(params.id)
    return deliveryman
  }

  async update ({ params, request }) {
    const data = request.only(['name', 'email'])
    const deliveryman = await Deliveryman.findOrFail(params.id)

    deliveryman.merge(data)
    await deliveryman.save()
    return deliveryman
  }
  async destroy ({ params }) {
    const deliveryman = await Deliveryman.findOrFail(params.id)
    await deliveryman.delete()
  }
}

module.exports = DeliverymanController
