'use strict'
const Recipient = use('App/Models/Recipient')
class RecipientController {
  async index () {
    const recipient = await Recipient.all()
    return recipient
  }
  async store ({ request}) {
    const data = request.only(['name','street','number','complement','zip_code','city','state'])
    const recipient = await Recipient.create(data)
    return recipient
  }

  async show ({ params}) {
    const recipient = await Recipient.findOrFail(params.id)
    return recipient
  }
  async update ({ params, request }) {
    const data = request.only(['name','street','complement','zip_code','city','state'])
    const recipient = await Recipient.findOrFail(params.id)
   
    recipient.merge(data)
    await recipient.save()

    return recipient
  }
  async destroy ({ params}) {
    const recipient = await Recipient.findOrFail(params.id)
   await recipient.delete()
  }
}

module.exports = RecipientController
