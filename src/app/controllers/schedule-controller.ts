import { Request, Response } from 'express'

import { validateEmptyField } from '../utils'
import { badRequest, ok, serverError } from '../helpers/response-status'
import Schedule from '../models/Schedule'
import { emptyField } from '../helpers/response-message'

class ScheduleController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { date, hour } = req.body

      if (!validateEmptyField(date) || !validateEmptyField(hour)) {
        return badRequest(res, emptyField())
      }

      if (await Schedule.findOne({ date, hour })) {
        return badRequest(res, 'Schedule already exist')
      }

      const schedule = await Schedule.create({
        date,
        hour
      })

      return ok(res, schedule)
    } catch (error) {
      return serverError(res)
    }
  }

  public async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const schedule = await Schedule.findById(id)

      if (!schedule) {
        return badRequest(res, 'Schedule not found')
      }

      return ok(res, schedule)
    } catch (error) {
      return serverError(res)
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const schedule = await Schedule.find()

      return ok(res, schedule)
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

      if (!await Schedule.findById(id)) {
        return badRequest(res, 'Schedule not found')
      }

      await Schedule.findByIdAndDelete(id)

      return res.status(204).json()
    } catch (error) {
      return serverError(res)
    }
  }
}

export default ScheduleController