import { Request, Response } from 'express'

import { validateEmptyField, validateEmptyFields } from '../utils'
import { badRequest, ok, serverError } from '../helpers/response-status'
import Proprietie from '../models/Proprietie'
import { emptyField } from '../helpers/response-message'
import Developer from '../models/Developer'

class ProprietieController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        title,
        description,
        type,
        city,
        neighborhood,
        coordinator,
        contact,
        mapsLoc,
        dorms,
        suites,
        area,
        parkingSpaces,
        status,
        materials,
        commission,
        price,
        images,
        videos,
        developerId,
        units
      } = req.body

      if (!validateEmptyFields([
        title,
        description,
        type,
        city,
        neighborhood,
        coordinator,
        contact,
        mapsLoc,
        dorms,
        suites,
        area,
        parkingSpaces,
        status,
        commission,
        price,
        developerId,
      ]) ||
        images.length === 0 ||
        units.length === 0) {
        return badRequest(res, emptyField())
      }

      units.map(({
        id,
        dorms,
        suites,
        bathroons,
        area,
        condominium,
        iptu,
        bankEvaluation,
        itbi,
        registrationFee
      }) => {
        if (!validateEmptyFields([
          id,
          dorms,
          suites,
          bathroons,
          area,
          condominium,
          iptu,
          bankEvaluation,
          itbi,
          registrationFee
        ])) {
          return badRequest(res, 'Something in units is in incorrect format')
        }
      })

      const developer = await Developer.findById(developerId)

      const proprietie = await Proprietie.create({
        title,
        description,
        type,
        city,
        neighborhood,
        coordinator,
        contact,
        mapsLoc,
        dorms,
        suites,
        area,
        parkingSpaces,
        status,
        materials,
        commission,
        price,
        images,
        videos,
        developer,
        units
      })

      return ok(res, proprietie)
    } catch (error) {
      return serverError(res)
    }
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req
      const { id } = params
      const {
        title,
        description,
        type,
        city,
        neighborhood,
        coordinator,
        contact,
        mapsLoc,
        dorms,
        suites,
        area,
        parkingSpaces,
        status,
        materials,
        commission,
        price,
        images,
        videos,
        developerId,
        units
      } = body

      const proprietie = await Proprietie.findById(id)

      if (!proprietie) {
        return badRequest(res, 'Proprietie not found')
      }

      if (validateEmptyField(title)) proprietie.title = title
      if (validateEmptyField(description)) proprietie.description = description
      if (validateEmptyField(type)) proprietie.type = type
      if (validateEmptyField(city)) proprietie.city = city
      if (validateEmptyField(neighborhood)) proprietie.neighborhood = neighborhood
      if (validateEmptyField(coordinator)) proprietie.coordinator = coordinator
      if (validateEmptyField(contact)) proprietie.contact = contact
      if (validateEmptyField(mapsLoc)) proprietie.mapsLoc = mapsLoc
      if (validateEmptyField(dorms)) proprietie.dorms = dorms
      if (validateEmptyField(suites)) proprietie.suites = suites
      if (validateEmptyField(area)) proprietie.area = area
      if (validateEmptyField(parkingSpaces)) proprietie.parkingSpaces = parkingSpaces
      if (validateEmptyField(status)) proprietie.status = status
      if (validateEmptyField(commission)) proprietie.commission = commission
      if (validateEmptyField(price)) proprietie.price = price
      if (validateEmptyField(images)) proprietie.images = images
      if (validateEmptyField(videos)) proprietie.videos = videos
      if (validateEmptyField(materials)) proprietie.materials = materials

      if (validateEmptyField(developerId)) {
        proprietie.developer = await Developer.findById(developerId)
      }
      if (validateEmptyField(units)) proprietie.units = units

      units.map(({
        id,
        dorms,
        suites,
        bathroons,
        area,
        condominium,
        iptu,
        bankEvaluation,
        itbi,
        registrationFee
      }) => {
        if (!validateEmptyFields([
          id,
          dorms,
          suites,
          bathroons,
          area,
          condominium,
          iptu,
          bankEvaluation,
          itbi,
          registrationFee
        ])) {
          return badRequest(res, 'Something in units is in incorrect format')
        }
      })

      await proprietie.save()
      const newProprieties = await Proprietie.findById(id)

      return ok(res, { proprietie: newProprieties })
    } catch (error) {
      return serverError(res)
    }
  }

  public async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const Proprieties = await Proprietie.findById(id).populate('developer')

      if (!Proprieties) {
        return badRequest(res, 'Proprieties not found')
      }

      return ok(res, Proprieties)
    } catch (error) {
      return serverError(res)
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const Proprietiess = await Proprietie.find().populate('developer')

      return ok(res, Proprietiess)
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

      if (!await Proprietie.findById(id)) {
        return badRequest(res, 'Proprietie not found')
      }

      await Proprietie.findByIdAndDelete(id)

      return res.status(204).json()
    } catch (error) {
      return serverError(res)
    }
  }
}

export default ProprietieController