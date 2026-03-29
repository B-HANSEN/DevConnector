import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { setAlert } from './alertSlice'
import { clearAuth } from './authSlice'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {},
  },
  reducers: {
    profileLoaded: (state, action) => {
      // response sent back includes the whole profile, add to state
      state.profile = action.payload
      state.loading = false
    },
    profilesLoaded: (state, action) => {
      state.profiles = action.payload
      state.loading = false
    },
    profileError: (state, action) => {
      // payload is object with message and status
      state.error = action.payload
      state.loading = false
    },
    clearProfile: (state) => {
      state.profile = null
      state.repos = []
      state.loading = false
    },
    reposLoaded: (state, action) => {
      state.repos = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    // clear profile whenever auth is wiped (logout or account deletion)
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

// get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me')

    // We found a security flaw in this app.
    // If a guest user browses a dev profile and then registers,
    // the browsed users profile data is still in the "profile" state
    // and the newly registered user then sees and can edit the users info
    dispatch(clearProfile())
    dispatch(profileLoaded(res.data))
  } catch (err) {
    dispatch(
      profileError({
        msg: err.response.statusText,
        // HTTP status: 400 or similar
        status: err.response.status,
      }),
    )
  }
}

// get all profiles
export const getProfiles = () => async (dispatch) => {
  // clean-up prior to getting all profiles
  dispatch(clearProfile())
  try {
    const res = await axios.get('/api/profile')
    dispatch(profilesLoaded(res.data))
  } catch (err) {
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`)
    dispatch(profileLoaded(res.data))
  } catch (err) {
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`)
    dispatch(reposLoaded(res.data))
  } catch (err) {
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// create or update profile
// edit flag avoids creating a separate function for updates
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const res = await axios.post('/api/profile', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      // this route returns all profile data
      dispatch(profileLoaded(res.data))
      dispatch(setAlert(edit ? 'Profile updated.' : 'Profile created.', 'success'))
      if (!edit) navigate('/dashboard')
    } catch (err) {
      err.response.data.errors?.forEach((error) =>
        dispatch(setAlert(error.msg, 'danger')),
      )
      dispatch(
        profileError({ msg: err.response.statusText, status: err.response.status }),
      )
    }
  }

// add experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.put('/api/profile/experience', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
    dispatch(profileLoaded(res.data))
    dispatch(setAlert('Experience added', 'success'))
    navigate('/dashboard')
  } catch (err) {
    err.response.data.errors?.forEach((error) =>
      dispatch(setAlert(error.msg, 'danger')),
    )
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// add education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.put('/api/profile/education', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
    dispatch(profileLoaded(res.data))
    dispatch(setAlert('Education added', 'success'))
    navigate('/dashboard')
  } catch (err) {
    err.response.data.errors?.forEach((error) =>
      dispatch(setAlert(error.msg, 'danger')),
    )
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)
    dispatch(profileLoaded(res.data))
    dispatch(setAlert('Experience removed.', 'success'))
  } catch (err) {
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)
    dispatch(profileLoaded(res.data))
    dispatch(setAlert('Education removed.', 'success'))
  } catch (err) {
    dispatch(
      profileError({ msg: err.response.statusText, status: err.response.status }),
    )
  }
}

// delete account & profile — token identifies which account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can not be undone.')) {
    try {
      await axios.delete('/api/profile')
      dispatch(clearAuth())
      dispatch(setAlert('Your account has been permanently deleted.'))
    } catch (err) {
      dispatch(
        profileError({ msg: err.response.statusText, status: err.response.status }),
      )
    }
  }
}

export default profileSlice.reducer
