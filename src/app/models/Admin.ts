import { Schema, model, Document } from 'mongoose'

export interface IAdmin extends Document {
  username: string
  password: string
}

const AdminSchema = new Schema({
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
  }
}, {
  timestamps: true
})

export default model<IAdmin>('Admin', AdminSchema)