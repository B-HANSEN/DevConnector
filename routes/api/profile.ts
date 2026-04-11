import { Hono } from 'hono'
import { z } from 'zod'
import { authMiddleware, type Env } from '../../middleware/auth.js'
import Profile from '../../models/Profile.js'
import User from '../../models/User.js'
import Post from '../../models/Post.js'

const router = new Hono<Env>()

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, async (c) => {
  try {
    const profile = await Profile.findOne({
      user: c.get('user').id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return c.json({ msg: 'There is no profile for this user.' }, 400)
    }

    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

const profileSchema = z.object({
  status: z.string().min(1, 'Status is required.'),
  skills: z.string().min(1, 'Skills is required.'),
  company: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  githubusername: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
})

// @route   POST api/profile
// @desc    Create or update a user's profile
// @access  Private
router.post('/', authMiddleware, async (c) => {
  const body = await c.req.json()
  const result = profileSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
  } = result.data

  const profileFields: Record<string, unknown> = {}
  profileFields.user = c.get('user').id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  // only store a real username, not placeholder values like "n/a"
  if (githubusername && githubusername.trim().toLowerCase() !== 'n/a') {
    profileFields.githubusername = githubusername.trim()
  }
  profileFields.skills = skills.split(',').map((skill) => skill.trim())

  const social: Record<string, string> = {}
  if (youtube) social.youtube = youtube
  if (twitter) social.twitter = twitter
  if (facebook) social.facebook = facebook
  if (linkedin) social.linkedin = linkedin
  if (instagram) social.instagram = instagram
  profileFields.social = social

  try {
    let profile = await Profile.findOne({ user: c.get('user').id })

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: c.get('user').id },
        { $set: profileFields },
        { new: true },
      )
      return c.json(profile)
    }

    profile = new Profile(profileFields)
    await profile.save()
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (c) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    return c.json(profiles)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (c) => {
  try {
    const profile = await Profile.findOne({
      user: c.req.param('user_id'),
    }).populate('user', ['name', 'avatar'])

    if (!profile) return c.json({ msg: 'Profile not found.' }, 400)
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    if ((err as { name?: string }).name === 'CastError') {
      return c.json({ msg: 'Profile not found.' }, 400)
    }
    return c.text('Server Error', 500)
  }
})

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', authMiddleware, async (c) => {
  try {
    await Post.deleteMany({ user: c.get('user').id })
    await Profile.findOneAndDelete({ user: c.get('user').id })
    await User.findOneAndDelete({ _id: c.get('user').id })
    return c.json({ msg: 'User deleted.' })
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  company: z.string().min(1, 'Company is required.'),
  from: z.string().min(1, 'From date is required.'),
  location: z.string().optional(),
  to: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
})

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', authMiddleware, async (c) => {
  const body = await c.req.json()
  const result = experienceSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  const { title, company, location, from, to, current, description } =
    result.data

  try {
    const profile = await Profile.findOne({ user: c.get('user').id })
    if (!profile) return c.json({ msg: 'Profile not found.' }, 400)
    profile.experience.unshift({
      title,
      company,
      location,
      from: new Date(from),
      to: to ? new Date(to) : undefined,
      current,
      description,
    })
    await profile.save()
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', authMiddleware, async (c) => {
  try {
    const profile = await Profile.findOne({ user: c.get('user').id })
    if (!profile) return c.json({ msg: 'Profile not found.' }, 400)
    const removeIndex = profile.experience
      .map((item) => item._id?.toString())
      .indexOf(c.req.param('exp_id'))
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

const educationSchema = z.object({
  school: z.string().min(1, 'School is required.'),
  degree: z.string().min(1, 'Degree is required.'),
  fieldofstudy: z.string().min(1, 'Field of study is required.'),
  from: z.string().min(1, 'From date is required.'),
  to: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
})

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', authMiddleware, async (c) => {
  const body = await c.req.json()
  const result = educationSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  const { school, degree, fieldofstudy, from, to, current, description } =
    result.data

  try {
    const profile = await Profile.findOne({ user: c.get('user').id })
    if (!profile) return c.json({ msg: 'Profile not found.' }, 400)
    profile.education.unshift({
      school,
      degree,
      fieldofstudy,
      from: new Date(from),
      to: to ? new Date(to) : undefined,
      current,
      description,
    })
    await profile.save()
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   DELETE api/profile/education/:edu
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu', authMiddleware, async (c) => {
  try {
    const profile = await Profile.findOne({ user: c.get('user').id })
    if (!profile) return c.json({ msg: 'Profile not found.' }, 400)
    const removeIndex = profile.education
      .map((item) => item._id?.toString())
      .indexOf(c.req.param('edu'))
    profile.education.splice(removeIndex, 1)
    await profile.save()
    return c.json(profile)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (c) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(c.req.param('username'))}/repos?per_page=5&sort=created:asc`,
      {
        headers: {
          'user-agent': 'node.js',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      },
    )
    if (!response.ok) {
      return c.json({ msg: 'No Github profile found' }, 404)
    }
    return c.json(await response.json())
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

export default router
