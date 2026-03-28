import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import AppRoutes from './components/routing/Routes'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  // corresponds to componentDidMount; add [] to let it run only once and avoid infinite loop:
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
