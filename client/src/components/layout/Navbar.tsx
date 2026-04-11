import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { logout } from '../../slices/authSlice'
import styles from './Navbar.module.css'

const Navbar = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth)

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/' onClick={() => dispatch(logout())}>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  )

  return (
    <nav className={`${styles.navbar} bg-dark`}>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && isAuthenticated && user && (
        <p className={styles.navbarGreeting}>
          Hi {user.name.split(' ').slice(0, 1)}!
        </p>
      )}
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  )
}

export default Navbar
