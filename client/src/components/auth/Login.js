import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../slices/authSlice'

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData
  // change state object, copy of formData and then change the name to value of input
  // replace name with [e.target.name] to use for every field
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    login(email, password)
  }

  // redirect if logged in
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group' style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#aaa',
            }}
          >
            <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
          </button>
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don&apos;t have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </>
  )
}
// subscribe to Redux and get updates on isAuthenticated
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { login })(Login)
