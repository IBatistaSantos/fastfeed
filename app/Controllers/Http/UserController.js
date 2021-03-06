'use strict'
const User = use('App/Models/User')
class UserController {
  async index () {
    const user = await User.query().fetch()
    return user
  }

  async store ({ request }) {
    const data = request.only(['name', 'email', 'password'])
    const user = await User.create(data)
    return user
  }

  async show ({ params }) {
    const user = await User.findOrFail(params.id)
    return user
  }

  async update ({ request, auth }) {
    const data = request.only(['name', 'email', 'password'])
    const user = await User.findOrFail(auth.user.id)

    user.merge(data)
    await user.save()

    return user
  }

  async destroy ({ auth }) {
    const user = await User.findOrFail(auth.user.id)
    user.delete()
  }
}

module.exports = UserController
