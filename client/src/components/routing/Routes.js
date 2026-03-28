import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../auth/Register'
import Login from '../auth/Login'
import Alert from '../layout/Alert'
import Dashboard from '../dashboard/Dashboard'
import CreateProfile from '../profile-forms/CreateProfile'
import EditProfile from '../profile-forms/EditProfile'
import AddExperience from '../profile-forms/AddExperience'
import AddEducation from '../profile-forms/AddEducation'
import Profiles from '../profiles/Profiles'
import Profile from '../profile/Profile'
import Posts from '../posts/Posts'
import Post from '../post/Post'
import NotFound from '../layout/NotFound'
import PrivateRoute from '../routing/PrivateRoute'

const AppRoutes = () => {
  return (
    <section className='container'>
      <Alert />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profiles' element={<Profiles />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-profile' element={<CreateProfile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/add-experience' element={<AddExperience />} />
          <Route path='/add-education' element={<AddEducation />} />
          <Route path='/posts' element={<Posts />} />
          <Route path='/posts/:id' element={<Post />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </section>
  )
}

export default AppRoutes
