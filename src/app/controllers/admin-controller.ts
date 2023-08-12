import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { config } from 'dotenv'
config()

import Admin from '../models/Admin'
import { generateToken, validateEmptyField } from '../utils'
import { badRequest, ok, serverError } from '../helpers/response-status'
import { emptyField } from '../helpers/response-message'

class AdminController {
  // public async create(req: Request, res: Response): Promise<Response> {
  //   try {
  //     req.body.password = await hash(req.body.password, 10)

  //     const admin = await Admin.create(req.body)

  //     return res.status(200).json(admin)
  //   } catch (error) {
  //     return res.status(500).json('Server Error')
  //   }
  // }

  public async load(req: Request, res: Response): Promise<Response> {
    try {
      const admin = await Admin.findById(req.userId)
      admin.password = undefined

      if (!admin) {
        return badRequest(res, 'Admin not found')
      }

      return ok(res, { admin })
    } catch (error) {
      return serverError(res)
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body

      if (!validateEmptyField(username) ?? !validateEmptyField(password)) {
        return badRequest(res, emptyField())
      }

      const admin = await Admin.findOne({ username })

      if (!admin) {
        return badRequest(res, 'Admin not found')
      }

      if (!await compare(password, admin.password)) {
        return badRequest(res, 'Admin or passowrd is invalid')
      }
      admin.password = undefined

      const token = generateToken(admin._id, true)

      return ok(res, { admin, token })
    } catch (error) {
      return serverError(res)
    }
  }
}

export default AdminController