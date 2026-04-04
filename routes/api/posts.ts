import { Hono } from 'hono'
import { z } from 'zod'
import { authMiddleware, type Env } from '../../middleware/auth.js'
import Post from '../../models/Post.js'
import User from '../../models/User.js'

const router = new Hono<Env>()

const textSchema = z.object({
  text: z.string().min(1, 'Text is required'),
})

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', authMiddleware, async (c) => {
  const body = await c.req.json()
  const result = textSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  try {
    const user = await User.findById(c.get('user').id).select('-password')
    if (!user) return c.text('Server Error.', 500)

    const newPost = new Post({
      text: result.data.text,
      name: user.name,
      avatar: user.avatar,
      user: c.get('user').id,
    })

    const post = await newPost.save()
    return c.json(post)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', authMiddleware, async (c) => {
  try {
    // most recent first, i.e. -1 else +1
    const posts = await Post.find().sort({ date: -1 })
    return c.json(posts)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', authMiddleware, async (c) => {
  try {
    const post = await Post.findById(c.req.param('id'))
    if (!post) {
      return c.json({ msg: 'Post not found.' }, 404)
    }
    return c.json(post)
  } catch (err) {
    console.error((err as Error).message)
    // CastError means the id format was invalid, not a server fault
    if ((err as { name?: string }).name === 'CastError') {
      return c.json({ msg: 'Post not found.' }, 404)
    }
    return c.text('Server Error.', 500)
  }
})

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', authMiddleware, async (c) => {
  try {
    const post = await Post.findById(c.req.param('id'))
    if (!post) {
      return c.json({ msg: 'Post not found.' }, 404)
    }
    // only the user that created the post can delete it
    // post.user is an ObjectId; req.user.id is a string
    if (post.user?.toString() !== c.get('user').id) {
      return c.json({ msg: 'User not authorized.' }, 401)
    }
    await post.deleteOne()
    return c.json({ msg: 'Post removed.' })
  } catch (err) {
    console.error((err as Error).message)
    if ((err as { name?: string }).name === 'CastError') {
      return c.json({ msg: 'Post not found.' }, 404)
    }
    return c.text('Server Error.', 500)
  }
})

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', authMiddleware, async (c) => {
  try {
    const post = await Post.findById(c.req.param('id'))
    if (!post) return c.json({ msg: 'Post not found.' }, 404)

    // check if post already liked by this user
    if (post.likes.some((like) => like.user?.toString() === c.get('user').id)) {
      return c.json({ msg: 'Post already liked.' }, 400)
    }
    // if not yet liked, add to the beginning of the likes array
    post.likes.unshift({ user: c.get('user').id as unknown as typeof post.likes[0]['user'] })
    await post.save()
    return c.json(post.likes)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', authMiddleware, async (c) => {
  try {
    const post = await Post.findById(c.req.param('id'))
    if (!post) return c.json({ msg: 'Post not found.' }, 404)

    // check if post has been liked by this user
    if (!post.likes.some((like) => like.user?.toString() === c.get('user').id)) {
      return c.json({ msg: 'Post has not yet been liked.' }, 400)
    }
    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user?.toString())
      .indexOf(c.get('user').id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    return c.json(post.likes)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error', 500)
  }
})

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', authMiddleware, async (c) => {
  const body = await c.req.json()
  const result = textSchema.safeParse(body)
  if (!result.success) {
    return c.json(
      { errors: result.error.issues.map((i) => ({ msg: i.message })) },
      400,
    )
  }

  try {
    const user = await User.findById(c.get('user').id).select('-password')
    const post = await Post.findById(c.req.param('id'))
    if (!user || !post) return c.text('Server Error.', 500)

    // comments are embedded in the post document, not a separate collection
    const newComment = {
      text: result.data.text,
      name: user.name,
      avatar: user.avatar,
      user: c.get('user').id as unknown as typeof post.comments[0]['user'],
    }

    // unshift() adds to the beginning of the comments array
    post.comments.unshift(newComment)
    await post.save()
    return c.json(post.comments)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', authMiddleware, async (c) => {
  try {
    const post = await Post.findById(c.req.param('id'))
    if (!post) return c.json({ msg: 'Post not found.' }, 404)

    // pull out comment
    const comment = post.comments.find(
      (comment) => comment._id?.toString() === c.req.param('comment_id'),
    )
    // ensure comment exists
    if (!comment) {
      return c.json({ msg: 'Comment does not exist.' }, 404)
    }
    // check user
    if (comment.user?.toString() !== c.get('user').id) {
      return c.json({ msg: 'User not authorised' }, 401)
    }
    // get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user?.toString())
      .indexOf(c.get('user').id)
    post.comments.splice(removeIndex, 1)
    await post.save()
    return c.json(post.comments)
  } catch (err) {
    console.error((err as Error).message)
    return c.text('Server Error.', 500)
  }
})

export default router
