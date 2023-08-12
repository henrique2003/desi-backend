import { Schema, model, Document } from 'mongoose'

export interface IDeveloper extends Document {
  name: string
  image: string
}

const DeveloperSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

export default model<IDeveloper>('Developer', DeveloperSchema)