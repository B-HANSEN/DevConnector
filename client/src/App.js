import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { loadUser } from './actions/auth'
import './App.css'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import AppRoutes from './components/routing/Routes'
import store from './store'
import setAuthToken from './utils/setAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/*' element={<AppRoutes />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
