import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios, { type AxiosError } from 'axios'
import { setAlert } from './alertSlice'
import type { Post, Like, Comment } from '../types'
import type { AppDispatch } from '../store'

interface PostError {
  msg: string
  status: number
}

interface PostState {
  posts: Post[]
  post: Post | null
  loading: boolean
  error: Partial<PostError>
}

const initialState: PostState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    postsLoaded: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
      state.loading = false
    },
    postLoaded: (state, action: PayloadAction<Post>) => {
      state.post = action.payload
      state.loading = false
    },
    postAdded: (state, action: PayloadAction<Post>) => {
      state.posts = [action.payload, ...state.posts]
      state.loading = false
    },
    postDeleted: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload)
      state.loading = false
    },
    postError: (state, action: PayloadAction<PostError>) => {
      state.error = action.payload
      state.loading = false
    },
    likesUpdated: (
      state,
      action: PayloadAction<{ id: string; likes: Like[] }>,
    ) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.id
          ? { ...post, likes: action.payload.likes }
          : post,
      )
      state.loading = false
    },
    commentAdded: (state, action: PayloadAction<Comment[]>) => {
      if (state.post) {
        state.post.comments = action.payload
      }
      state.loading = false
    },
    commentRemoved: (state, action: PayloadAction<string>) => {
      if (state.post) {
        state.post.comments = state.post.comments.filter(
          (comment) => comment._id !== action.payload,
        )
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

const toPostError = (err: unknown): PostError => {
  const error = err as AxiosError
  return {
    msg: error.response?.statusText ?? 'Unknown error',
    status: error.response?.status ?? 500,
  }
}

export const getPosts = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get<Post[]>('/api/posts/')
    dispatch(postsLoaded(res.data))
  } catch (err) {
    dispatch(postError(toPostError(err)))
  }
}

export const addLike = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.put<Like[]>(`/api/posts/like/${id}`)
    dispatch(likesUpdated({ id, likes: res.data }))
  } catch (err) {
    dispatch(postError(toPostError(err)))
  }
}

export const removeLike = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.put<Like[]>(`/api/posts/unlike/${id}`)
    dispatch(likesUpdated({ id, likes: res.data }))
  } catch (err) {
    dispatch(postError(toPostError(err)))
  }
}

export const deletePost = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`)
    dispatch(postDeleted(id))
    dispatch(setAlert('Post removed.', 'success'))
  } catch (err) {
    dispatch(postError(toPostError(err)))
  }
}

export const addPost =
  (formData: { text: string }) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post<Post>('/api/posts/', formData)
      dispatch(postAdded(res.data))
      dispatch(setAlert('Post created.', 'success'))
    } catch (err) {
      dispatch(postError(toPostError(err)))
    }
  }

export const getPost = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get<Post>(`/api/posts/${id}`)
    dispatch(postLoaded(res.data))
  } catch (err) {
    dispatch(postError(toPostError(err)))
  }
}

export const addComment =
  (postId: string, formData: { text: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post<Comment[]>(
        `/api/posts/comment/${postId}`,
        formData,
      )
      dispatch(commentAdded(res.data))
      dispatch(setAlert('Comment added.', 'success'))
    } catch (err) {
      dispatch(postError(toPostError(err)))
    }
  }

export const deleteComment =
  (postId: string, commentId: string) => async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
      dispatch(commentRemoved(commentId))
      dispatch(setAlert('Comment removed.', 'success'))
    } catch (err) {
      dispatch(postError(toPostError(err)))
    }
  }

export default postSlice.reducer
