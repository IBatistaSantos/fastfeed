'use strict'
const File = use('App/Models/File')
const Deliveryman = use('App/Models/Deliveryman')
const Helpers = use('Helpers')

class FileController {
    async show ({params, response}) {
        const file = await File.findOrFail(params.id)
        return response.download(Helpers.tmpPath(`uploads/${file.file}`))
    }
    async store ({params, request}) {
        try {
            switch (request.url()) {
                case `/files/avatar/${params.id}`:
                    if(!request.file('file'))return

                    const upload = request.file('file',{size: '2mb'})
                    const fileName = `${Date.now()}.${upload.subtype}`

                    await upload.move(Helpers.tmpPath('uploads'),{ name: fileName })

                    if(!upload.moved()) {
                        throw upload.error()
                    }

                    const file = await File.create({
                        file: fileName,
                        name: upload.clientName,
                        type: upload.type,
                        subtype: upload.subtype
                    })
                   const deliveryman = await Deliveryman.findOrFail(params.id)
                    deliveryman.merge({file_id:file.id})
                    await deliveryman.save()
                    return file

                    case `/files/signature/${params.id}`:
                        break
                default:
                    break;
            }
        } catch (error) {

        }
    }
}

module.exports = FileController
