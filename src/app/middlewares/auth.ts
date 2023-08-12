import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { unauthorized } from '../helpers/response-status'

const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const authHeaders = req.header('Authorization')

  if (!authHeaders) {
    return unauthorized(res)
  }

  const [, token] = authHeaders.split('Bearer ')

  if (!token) {
    return unauthorized(res)
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET_ID) as { id: string }
    req.userId = decoded.id

    next()
  } catch (error) {
    return unauthorized(res)
  }
}

export default auth