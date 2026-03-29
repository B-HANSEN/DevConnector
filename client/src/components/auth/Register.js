import { useState } from 'react'
import { connect } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { setAlert } from '../../slices/alertSlice'
import { register } from '../../slices/authSlice'

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const { name, email, password, password2 } = formData
  // change state object, copy of formData and then change the name to value of input
  // replace name with [e.target.name] to use for every field
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match.', 'danger')
    } else {
      register({ name, email, password })
    }
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group' style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
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
        <div className='form-group' style={{ position: 'relative' }}>
          <input
            type={showPassword2 ? 'text' : 'password'}
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
          <button
            type='button'
            onClick={() => setShowPassword2(!showPassword2)}
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
            <i className={showPassword2 ? 'fas fa-eye-slash' : 'fas fa-eye'} />
          </button>
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </>
  )
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { setAlert, register })(Register)
