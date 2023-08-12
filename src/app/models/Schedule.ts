import { Schema, model, Document } from 'mongoose'

export interface ISchedule extends Document {
  name: string
  image: string
}

const ScheduleSchema = new Schema({
  date: {
    type: Date,
    required: true,
    trim: true,
    unique: true
  },
  hour: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

export default model<ISchedule>('Schedule', ScheduleSchema)