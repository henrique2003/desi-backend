import { Request, Response, NextFunction } from 'express'

import { badRequest, unauthorized } from '../helpers/response-status'
import Realtor from '../models/Realtor'

const isRealtor = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const id = req.userId

    if (!id) {
      return badRequest(res, 'Required userId')
    }

    const realtor = await Realtor.findById(id)

    if (!realtor) {
      return badRequest(res, 'Unauthorized')
    }

    next()
  } catch (error) {
    return unauthorized(res)
  }
}

export default isRealtor