import jwt from 'jsonwebtoken'

// access to req/res object, next callback to run to move to next piece of middleware
export default function (req, res, next) {
  // get token from header
  const token = req.header('x-auth-token')

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorisation denied.' })
  }

  // verify token if there is one
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid.' })
  }
}
