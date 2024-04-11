import { type Response } from 'express'

export function error(err: any, res: Response) {
    const e = err as { status?: number, message: string }
    console.error(err)
    res.status(err.status ?? 500).json({ error: typeof e.status === 'number' ? e.message : 'Server error' })
}