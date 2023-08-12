import { Request, Response, NextFunction } from 'express'

import { badRequest, unauthorized } from '../helpers/response-status'
import Admin from '../models/Admin'

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const id = req.userId

    if (!id) {
      return badRequest(res, 'Required userId')
    }

    const admin = await Admin.findById(id)

    if (!admin) {
      return badRequest(res, 'Unauthorized')
    }

    next()
  } catch (error) {
    return unauthorized(res)
  }
}

export default isAdmin