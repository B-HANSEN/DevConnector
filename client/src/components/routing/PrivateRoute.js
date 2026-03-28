// any route that requires user to be logged in
// use Private Route instead of Routes

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const PrivateRoute = ({ auth: { isAuthenticated, loading } }) => {
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)
