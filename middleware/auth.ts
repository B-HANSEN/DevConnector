import { createMiddleware } from 'hono/factory'
import jwt from 'jsonwebtoken'

export type Env = {
  Variables: {
    user: { id: string }
  }
}

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const token = c.req.header('x-auth-token')

  if (!token) {
    return c.json({ msg: 'No token, authorisation denied.' }, 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: { id: string }
    }
    c.set('user', decoded.user)
    await next()
  } catch {
    return c.json({ msg: 'Token is not valid.' }, 401)
  }
})
