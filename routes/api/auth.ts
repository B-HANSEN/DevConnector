import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { authMiddleware, type Env } from '../../middleware/auth.js'
import User from '../../models/User.js'

const router = new Hono<Env>()

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

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Private
router.get('/', authMiddleware, async (c) => {
  try {
    const user = await User.findById(c.get('user').id).select('-password')
    return c.json(user)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server error.', 500)
  }
})

const loginSchema = z.object({
  email: z.string().email('Please include a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', async (c) => {
  const body = await c.req.json()
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  const { email, password } = result.data
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return c.json({ errors: [{ msg: 'Invalid credentials.' }] }, 400)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return c.json({ errors: [{ msg: 'Invalid credentials.' }] }, 400)
    }

    const payload = { user: { id: user.id } }
    const token = await signJwt(payload)
    return c.json({ token })
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server error.', 500)
  }
})

export default router
