import jwt from 'jsonwebtoken'
import 'dotenv/config'

export default function generateToken(userId: string, isExpires: boolean): string {
  if (!isExpires) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_ID)
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_ID, { expiresIn: 8600 })
}