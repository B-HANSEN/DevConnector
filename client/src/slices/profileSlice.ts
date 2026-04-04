import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios, { type AxiosError } from 'axios'
import type { NavigateFunction } from 'react-router-dom'
import { setAlert } from './alertSlice'
import { clearAuth } from './authSlice'
import type { Profile, GithubRepo } from '../types'
import type { AppDispatch } from '../store'

interface ProfileError {
  msg: string
  status: number
}

interface ProfileState {
  profile: Profile | null
  profiles: Profile[]
  repos: GithubRepo[]
  loading: boolean
  error: Partial<ProfileError>
}

const initialState: ProfileState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileLoaded: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
      state.loading = false
    },
    profilesLoaded: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload
      state.loading = false
    },
    profileError: (state, action: PayloadAction<ProfileError>) => {
      state.error = action.payload
      state.loading = false
    },
    clearProfile: (state) => {
      state.profile = null
      state.repos = []
      state.loading = false
    },
    reposLoaded: (state, action: PayloadAction<GithubRepo[]>) => {
      state.repos = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, (state) => {
      state.profile = null
      state.repos = []
      state.loading = false
    })
  },
})

export const {
  profileLoaded,
  profilesLoaded,
  profileError,
  clearProfile,
  reposLoaded,
} = profileSlice.actions

const toProfileError = (err: unknown): ProfileError => {
  const error = err as AxiosError
  return {
    msg: error.response?.statusText ?? 'Unknown error',
    status: error.response?.status ?? 500,
  }
}

export const getCurrentProfile = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get<Profile>('/api/profile/me')
    dispatch(clearProfile())
    dispatch(profileLoaded(res.data))
  } catch (err) {
    dispatch(profileError(toProfileError(err)))
  }
}

export const getProfiles = () => async (dispatch: AppDispatch) => {
  dispatch(clearProfile())
  try {
    const res = await axios.get<Profile[]>('/api/profile')
    dispatch(profilesLoaded(res.data))
  } catch (err) {
    dispatch(profileError(toProfileError(err)))
  }
}

export const getProfileById =
  (userId: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.get<Profile>(`/api/profile/user/${userId}`)
      dispatch(profileLoaded(res.data))
    } catch (err) {
      dispatch(profileError(toProfileError(err)))
    }
  }

export const getGithubRepos =
  (username: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.get<GithubRepo[]>(
        `/api/profile/github/${username}`,
      )
      dispatch(reposLoaded(res.data))
    } catch (err) {
      dispatch(profileError(toProfileError(err)))
    }
  }

export const createProfile =
  (
    formData: Record<string, string>,
    navigate: NavigateFunction,
    edit = false,
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post<Profile>('/api/profile', formData)
      dispatch(profileLoaded(res.data))
      dispatch(setAlert(edit ? 'Profile updated.' : 'Profile created.', 'success'))
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ errors?: { msg: string }[] }>
      error.response?.data.errors?.forEach((e) =>
        dispatch(setAlert(e.msg, 'danger')),
      )
      dispatch(profileError(toProfileError(err)))
    }
  }

export const addExperience =
  (formData: Record<string, string | boolean>, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.put<Profile>('/api/profile/experience', formData)
      dispatch(profileLoaded(res.data))
      dispatch(setAlert('Experience added', 'success'))
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ errors?: { msg: string }[] }>
      error.response?.data.errors?.forEach((e) =>
        dispatch(setAlert(e.msg, 'danger')),
      )
      dispatch(profileError(toProfileError(err)))
    }
  }

export const addEducation =
  (formData: Record<string, string | boolean>, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.put<Profile>('/api/profile/education', formData)
      dispatch(profileLoaded(res.data))
      dispatch(setAlert('Education added', 'success'))
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ errors?: { msg: string }[] }>
      error.response?.data.errors?.forEach((e) =>
        dispatch(setAlert(e.msg, 'danger')),
      )
      dispatch(profileError(toProfileError(err)))
    }
  }

export const deleteExperience =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.delete<Profile>(`/api/profile/experience/${id}`)
      dispatch(profileLoaded(res.data))
      dispatch(setAlert('Experience removed.', 'success'))
    } catch (err) {
      dispatch(profileError(toProfileError(err)))
    }
  }

export const deleteEducation =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.delete<Profile>(`/api/profile/education/${id}`)
      dispatch(profileLoaded(res.data))
      dispatch(setAlert('Education removed.', 'success'))
    } catch (err) {
      dispatch(profileError(toProfileError(err)))
    }
  }

export const deleteAccount = () => async (dispatch: AppDispatch) => {
  if (window.confirm('Are you sure? This can not be undone.')) {
    try {
      await axios.delete('/api/profile')
      dispatch(clearAuth())
      dispatch(setAlert('Your account has been permanently deleted.', 'success'))
    } catch (err) {
      dispatch(profileError(toProfileError(err)))
    }
  }
}

export default profileSlice.reducer
