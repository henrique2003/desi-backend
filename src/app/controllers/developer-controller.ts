import { Request, Response } from 'express'

import { validateEmptyField } from '../utils'
import { badRequest, ok, serverError } from '../helpers/response-status'
import Developer from '../models/Developer'
import { emptyField } from '../helpers/response-message'

class DeveloperController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, image } = req.body

      if (!validateEmptyField(name) || !validateEmptyField(image)) {
        return badRequest(res, emptyField())
      }

      if (await Developer.findOne({ name })) {
        return badRequest(res, 'Developer already exist')
      }

      const developer = await Developer.create({
        name,
        image
      })

      if (!developer) {
        return badRequest(res, 'Developer not found')
      }

      return ok(res, developer)
    } catch (error) {
      return serverError(res)
    }
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req
      const { id } = params
      const { name, image } = body

      const developer = await Developer.findById(id)

      if (!developer) {
        return badRequest(res, 'Developer not found')
      }

      if (validateEmptyField(name) && await Developer.findOne({ name })) {
        return badRequest(res, 'Developer already exist with this name')
      }

      if (validateEmptyField(name)) developer.name = name
      if (validateEmptyField(image)) developer.image = image

      await developer.save()
      const newDeveloper = await Developer.findById(id)

      return ok(res, newDeveloper)
    } catch (error) {
      return serverError(res)
    }
  }

  public async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const developer = await Developer.findById(id)

      if (!developer) {
        return badRequest(res, 'Developer not found')
      }

      return ok(res, developer)
    } catch (error) {
      return serverError(res)
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const developers = await Developer.find()

      return ok(res, developers)
    } catch (error) {
      return serverError(res)
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!id) {
        return badRequest(res, 'Required id')
      }

      if (!await Developer.findById(id)) {
        return badRequest(res, 'Developer not found')
      }

      await Developer.findByIdAndDelete(id)

      return res.status(204).json()
    } catch (error) {
      return serverError(res)
    }
  }
}

export default DeveloperController