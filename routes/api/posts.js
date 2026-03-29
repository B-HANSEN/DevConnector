import express from 'express'
import { check, validationResult } from 'express-validator'
import auth from '../../middleware/auth.js'
import Post from '../../models/Post.js'
import User from '../../models/User.js'

const router = express.Router()

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      // instantiate a new Post from the model
      const newPost = new Post({
        // text coming from body:
        text: req.body.text,
        // rest coming from user:
        name: user.name,
        avatar: user.avatar,
        // user coming from request:
        user: req.user.id,
      })

      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error.')
    }
  },
)

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // most recent first, i.e. -1 else +1
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error.')
  }
})

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    // CastError means the id format was invalid, not a server fault
    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Post not found.' })
    }
    res.status(500).send('Server Error.')
  }
})

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' })
    }
    // only the user that created the post can delete it
    // post.user is an ObjectId; req.user.id is a string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' })
    }
    await post.deleteOne()
    res.json({ msg: 'Post removed.' })
  } catch (err) {
    console.error(err.message)
    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Post not found.' })
    }
    res.status(500).send('Server Error.')
  }
})

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if post already liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked.' })
    }
    // if not yet liked, add to the beginning of the likes array
    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if post has been liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked.' })
    }
    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)

      // comments are embedded in the post document, not a separate collection
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      // unshift() adds to the beginning of the comments array
      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error.')
    }
  },
)

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id,
    )
    // ensure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist.' })
    }
    // check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorised' })
    }
    // get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)
    post.comments.splice(removeIndex, 1)
    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error.')
  }
})

export default router
