'use strict'

const Helpers = use('Helpers')
const File = use('App/Models/File')
const Delivery = use('App/Models/Deliveries')

class FileSignatureController {
  async show ({ params, response }) {
    const file = await File.findOrFail(params.id)
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ params, request }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })
      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), { name: fileName })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })
      const delivery = await Delivery.findOrFail(params.id)
      delivery.merge({ file_id: file.id })
      await delivery.save()
      return file
    } catch (error) {

    }
  }
}

module.exports = FileSignatureController
