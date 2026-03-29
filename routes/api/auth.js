import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import { check, validationResult } from 'express-validator'
import auth from '../../middleware/auth.js'
import User from '../../models/User.js'

const router = express.Router()

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Private — auth middleware as 2nd argument validates the token
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error.')
  }
})

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Password is required.').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    // return 400 bad request if there are errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })

      // check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials.' }] })
      }

      // compare plain text pw with encrypted pw from user object from db
      // use the same generic message for both cases so we don't leak whether an email is registered
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials.' }] })
      }

      // return json webtoken
      const payload = { user: { id: user.id } }
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        // expire in 100 hours in dev; tighten in production
        { expiresIn: 360000 },
        // callback: check for error or send token back to client
        (err, token) => {
          if (err) throw err
          res.json({ token })
        },
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error.')
    }
  },
)

export default router
