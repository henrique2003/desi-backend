import { Request, Response } from 'express'
import { compare, hash } from 'bcrypt'
import validator from 'validator'
import { config } from 'dotenv'
config()

import Realtor from '../models/Realtor'
import {
  awsS3DeleteImage,
  generateToken,
  validateCpf,
  validateEmptyField,
  validateEmptyFields
} from '../utils'
import { badRequest, ok, serverError } from '../helpers/response-status'
import createFileObject from '../helpers/create-file-object'
import { emptyField } from '../helpers/response-message'

class RealtorController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const realtors = await Realtor.find()

      realtors.map(item => item.password = undefined)

      return ok(res, realtors)
    } catch (error) {
      return serverError(res)
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body, files } = req
      let {
        username,
        password,
        name,
        surname,
        cpf,
        celphone,
        email,
        trainee,
        supervisorCrecci
      } = body

      if (!files['creci']) {
        return badRequest(res, 'Creci is required')
      }

      if (!files['rg']) {
        return badRequest(res, 'Rg is required')
      }

      const creci = createFileObject(files['creci'][0])
      const rg = createFileObject(files['rg'][0])

      let imageProfile = undefined
      if (files['imageProfile']) {
        imageProfile = createFileObject(files['imageProfile'][0])
      }

      function deleteAllFiles(): void {
        awsS3DeleteImage(creci.key)
        awsS3DeleteImage(rg.key)
        imageProfile && awsS3DeleteImage(imageProfile.key)
      }

      if (!validateEmptyFields([
        username,
        password,
        name,
        surname,
        cpf,
        celphone,
        email,
        supervisorCrecci
      ])) {
        deleteAllFiles()
        return badRequest(res, emptyField())
      }

      if (typeof Boolean(trainee) !== 'boolean') {
        deleteAllFiles()
        return badRequest(res, 'Invalid format for trainee')
      }

      if (!validateCpf(cpf)) {
        deleteAllFiles()
        return badRequest(res, 'Invalid cpf')
      }

      if (celphone
        .replace('(', '')
        .replace(')', '')
        .replace('-', '')
        .replace('.', '').length !== 11) {
        deleteAllFiles()
        return badRequest(res, 'Invalid celphone')
      }

      if (!validator.isEmail(email)) {
        deleteAllFiles()
        return badRequest(res, 'Invalid email')
      }

      if (await Realtor.findOne({ username })) {
        deleteAllFiles()
        return badRequest(res, 'Username already exists')
      }

      password = await hash(password, 10)

      const realtor = await Realtor.create({
        username,
        password,
        name,
        surname,
        cpf,
        celphone,
        creci,
        rg,
        imageProfile,
        email,
        trainee,
        supervisorCrecci
      })
      realtor.password = undefined

      return ok(res, { token: generateToken(realtor.id, true), realtor })
    } catch (error) {
      return serverError(res)
    }
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    try {
      const { body, files, userId } = req
      let {
        username,
        password,
        name,
        surname,
        cpf,
        celphone,
        email,
        trainee,
        supervisorCrecci
      } = body

      const realtor = await Realtor.findById(userId)

      function deleteAllFiles(): void {
        let creci = realtor.creci.key
        let rg = realtor.rg.key
        let imageProfile = realtor.imageProfile.key

        if (creci) awsS3DeleteImage(`${realtor.creci.key}`)
        if (rg) awsS3DeleteImage(`${realtor.rg.key}`)
        if (imageProfile) awsS3DeleteImage(`${realtor.imageProfile.key}`)
      }

      if (!realtor) {
        deleteAllFiles()
        return badRequest(res, 'Realtor not found')
      }

      if (validateEmptyField(username)) {
        const user = await Realtor.findOne({ username })
        if (user.id !== userId) {
          console.log('user: ');
          console.log(user.id);
          console.log(userId);

          deleteAllFiles()
          return badRequest(res, 'Username already exists')
        }
        realtor.username = username
      }
      if (validateEmptyField(password)) {
        realtor.password = await hash(password, 10)
      }
      if (validateEmptyField(name)) realtor.name = name
      if (validateEmptyField(surname)) realtor.surname = surname
      if (validateEmptyField(supervisorCrecci)) realtor.supervisorCrecci = supervisorCrecci
      if (validateEmptyField(cpf)) {
        if (!validateCpf(cpf)) {
          deleteAllFiles()
          return badRequest(res, 'Invalid cpf')
        }
        realtor.cpf = cpf
      }
      if (validateEmptyField(trainee)) {
        if (typeof Boolean(trainee) !== 'boolean') {
          deleteAllFiles()
          return badRequest(res, 'Invalid trainee')
        }
        realtor.trainee = trainee
      }
      if (validateEmptyField(trainee)) {
        if (celphone
          .replace('(', '')
          .replace(')', '')
          .replace('-', '')
          .replace('.', '').length !== 11) {
          deleteAllFiles()
          return badRequest(res, 'Invalid trainee')
        }
        realtor.celphone = celphone
      }
      if (validateEmptyField(email)) {
        if (!validator.isEmail(email)) {
          deleteAllFiles()
          return badRequest(res, 'Invalid email')
        }
        realtor.email = email
      }

      if (files['creci']) {
        awsS3DeleteImage(`${realtor.creci.key}`)
        realtor.creci = createFileObject(files['creci'][0])
      }

      if (files['rg']) {
        awsS3DeleteImage(`${realtor.rg.key}`)
        realtor.rg = createFileObject(files['rg'][0])
      }

      if (files['imageProfile']) {
        realtor.imageProfile && awsS3DeleteImage(`${realtor.imageProfile.key}`)
        realtor.imageProfile = createFileObject(files['imageProfile'][0])
      }

      await realtor.save()
      const newRealtor = await Realtor.findById(userId)

      newRealtor.password = undefined

      return ok(res, { proprietie: newRealtor })
    } catch (error) {
      return serverError(res)
    }
  }

  public async load(req: Request, res: Response): Promise<Response> {
    try {
      const realtor = await Realtor.findById(req.userId)

      if (!realtor) {
        return badRequest(res, 'Realtor not found')
      }

      realtor.password = undefined

      return ok(res, { realtor })
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

      const realtor = await Realtor.findOne({ username })

      if (!realtor) {
        return badRequest(res, 'Realtor not found')
      }

      if (!await compare(password, realtor.password)) {
        return badRequest(res, 'Realtor or passowrd is invalid')
      }
      realtor.password = undefined

      const token = generateToken(realtor._id, true)

      return ok(res, { realtor, token })
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

      const realtor = await Realtor.findById(id)
      if (!realtor) {
        return badRequest(res, 'Realtor not found')
      }

      await Realtor.findByIdAndDelete(id)

      awsS3DeleteImage(`${realtor.creci.key}`)
      awsS3DeleteImage(`${realtor.rg.key}`)
      realtor.imageProfile && awsS3DeleteImage(`${realtor.imageProfile.key}`)

      return res.status(204).json()
    } catch (error) {
      return serverError(res)
    }
  }
}

export default RealtorController