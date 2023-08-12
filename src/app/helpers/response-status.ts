import { type Response } from 'express'

export function badRequest(res: Response, message: string): Response {
  return res.status(400).json({ message })
}

export function ok(res: Response, data: any): Response {
  return res.status(200).json(data)
}

export function serverError(res: Response): Response {
  return res.status(500).json({ error: 'Server Error' })
}

export function unauthorized(res: Response): Response {
  return res.status(401).json({ message: 'Unauthorized' })
}
