import { Hono } from 'hono'
import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../../models/User.js'

const router = new Hono()

const signJwt = (payload: object): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: 360000 },
      (err, token) => {
        if (err || !token) reject(err ?? new Error('No token generated'))
        else resolve(token)
      },
    )
  })

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please include a valid email'),
  password: z
    .string()
    .min(6, 'Please enter a password with 6 or more characters'),
})

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', async (c) => {
  const body = await c.req.json()
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  const { name, email, password } = result.data

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return c.json({ errors: [{ msg: 'User already exists.' }] }, 400)
    }

    // get users gravatar; force https on the protocol-relative URL gravatar returns
    const avatar = gravatar
      .url(email, { s: '200', r: 'pg', d: 'mm' })
      .replace(/^\/\//, 'https://')

    const user = new User({ name, email, avatar, password })

    // encrypt password using bcrypt; use 10 rounds as per docs
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    const payload = { user: { id: user.id } }
    const token = await signJwt(payload)
    return c.json({ token })
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server error.', 500)
  }
})

export default router
