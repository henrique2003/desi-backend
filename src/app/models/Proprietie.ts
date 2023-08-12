import { Schema, model, Document } from 'mongoose'
import { IDeveloper } from './Developer'

export interface IProprietie extends Document {
  title: string
  description: string
  type: string
  city: string
  neighborhood: string
  coordinator: string
  contact: string
  mapsLoc: string
  dorms: string
  suites: string
  area: string
  parkingSpaces: string
  status: string
  materials?: string[]
  commission: string
  price: string
  images: string[]
  videos?: string[]
  developer: IDeveloper
  units: IUnits[]
}

interface IUnits {
  id: string
  dorms: string
  suits: string
  bathroons: string
  area: string
  condominium: string
  iptu: string
  bankEvaluation: string
  itbi: string
  registrationFee: string
}

const ProprietieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true
  },
  coordinator: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  mapsLoc: {
    type: String,
    required: true,
    trim: true
  },
  dorms: {
    type: String,
    required: true,
    trim: true
  },
  suites: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  parkingSpaces: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  materials: [{
    type: String,
    trim: true
  }],
  commission: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true,
    trim: true
  }],
  videos: [{
    type: String,
    trim: true
  }],
  developer: {
    type: 'ObjectId',
    ref: 'Developer'
  },
  units: [{
    id: {
      type: String,
      required: true,
      trim: true
    },
    dorms: {
      type: String,
      required: true,
      trim: true
    },
    suites: {
      type: String,
      required: true,
      trim: true
    },
    bathroons: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    condominium: {
      type: String,
      required: true,
      trim: true
    },
    iptu: {
      type: String,
      required: true,
      trim: true
    },
    bankEvaluation: {
      type: String,
      required: true,
      trim: true
    },
    itbi: {
      type: String,
      required: true,
      trim: true
    },
    registrationFee: {
      type: String,
      required: true,
      trim: true
    },
  }]
}, {
  timestamps: true
})

export default model<IProprietie>('Proprietie', ProprietieSchema)