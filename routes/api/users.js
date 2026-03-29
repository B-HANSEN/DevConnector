import express from 'express'
import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import { check, validationResult } from 'express-validator'
import User from '../../models/User.js'

const router = express.Router()

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    // return 400 bad request if there are errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      // check if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists.' }] })
      }

      // get users gravatar; force https on the protocol-relative URL gravatar returns
      const avatar = gravatar
        .url(email, { s: '200', r: 'pg', d: 'mm' })
        .replace(/^\/\//, 'https://')

      // create instance of user
      user = new User({ name, email, avatar, password })

      // encrypt password using bcrypt; use 10 rounds as per docs
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      // save to DB
      await user.save()

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
