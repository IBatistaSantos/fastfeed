'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions','SessionController.store')

Route.resource('users', 'UserController')
  .except(['update', 'destroy']).apiOnly()

Route.put('users','UserController.update').middleware('auth')
Route.delete('users','UserController.destroy').middleware('auth')  

Route.resource('recipients', 'RecipientController').middleware('auth').apiOnly()
Route.resource('deliveryman', 'DeliverymanController').middleware('auth').apiOnly()

Route.resource('deliveries', 'DeliveryController').middleware('auth').apiOnly()


Route.post('files/avatar/:id', 'FileController.store').middleware('auth')
Route.get('files/avatar/:id', 'FileController.show')