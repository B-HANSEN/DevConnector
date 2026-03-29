import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { setAlert } from './alertSlice'

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    post: null,
    loading: true,
    error: {},
  },
  reducers: {
    postsLoaded: (state, action) => {
      state.posts = action.payload
      state.loading = false
    },
    postLoaded: (state, action) => {
      state.post = action.payload
      state.loading = false
    },
    postAdded: (state, action) => {
      // latest post on top
      state.posts = [action.payload, ...state.posts]
      state.loading = false
    },
    postDeleted: (state, action) => {
      // payload is the post id
      state.posts = state.posts.filter((post) => post._id !== action.payload)
      state.loading = false
    },
    postError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    likesUpdated: (state, action) => {
      // check which post to update by id, then replace its likes array
      state.posts = state.posts.map((post) =>
        post._id === action.payload.id
          ? { ...post, likes: action.payload.likes }
          : post,
      )
      state.loading = false
    },
    commentAdded: (state, action) => {
      state.post = { ...state.post, comments: action.payload }
      state.loading = false
    },
    commentRemoved: (state, action) => {
      state.post = {
        ...state.post,
        comments: state.post.comments.filter(
          (comment) => comment._id !== action.payload,
        ),
      }
      state.loading = false
    },
  },
})

export const {
  postsLoaded,
  postLoaded,
  postAdded,
  postDeleted,
  postError,
  likesUpdated,
  commentAdded,
  commentRemoved,
} = postSlice.actions

// get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts/')
    dispatch(postsLoaded(res.data))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// add like — id refers to postId
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`)
    // return: id of post + updated likes array
    dispatch(likesUpdated({ id, likes: res.data }))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// remove like — id refers to postId
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`)
    dispatch(likesUpdated({ id, likes: res.data }))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`)
    dispatch(postDeleted(id))
    dispatch(setAlert('Post removed.', 'success'))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/posts/', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
    dispatch(postAdded(res.data))
    dispatch(setAlert('Post created.', 'success'))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`)
    dispatch(postLoaded(res.data))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, {
      headers: { 'Content-Type': 'application/json' },
    })
    dispatch(commentAdded(res.data))
    dispatch(setAlert('Comment added.', 'success'))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

// delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
    dispatch(commentRemoved(commentId))
    dispatch(setAlert('Comment removed.', 'success'))
  } catch (err) {
    dispatch(postError({ msg: err.response.statusText, status: err.response.status }))
  }
}

export default postSlice.reducer
