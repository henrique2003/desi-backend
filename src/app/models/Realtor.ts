import { Schema, model, Document } from 'mongoose'

export interface IRealtor extends Document {
  username: string
  password: string
  name: string
  surname: string
  cpf: number
  celphone: string
  email: string
  trainee: boolean
  creci: IS3File
  rg: IS3File
  imageProfile?: IS3File
  supervisorCrecci: string
}

interface IS3File {
  name: String,
  size: Number,
  key: String,
  url: String
}

const RealtorSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  imageProfile: {
    name: String,
    size: Number,
    key: String,
    url: String
  },
  rg: {
    name: String,
    size: Number,
    key: String,
    url: String
  },
  creci: {
    name: String,
    size: Number,
    key: String,
    url: String
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: Number,
    required: true,
    trim: true
  },
  celphone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  trainee: {
    type: Boolean,
    required: true
  },
  supervisorCrecci: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default model<IRealtor>('Realtor', RealtorSchema)