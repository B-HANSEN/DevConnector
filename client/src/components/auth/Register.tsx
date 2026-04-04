import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setAlert } from '../../slices/alertSlice'
import { register } from '../../slices/authSlice'

const Register = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const { name, email, password, password2 } = formData
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match.', 'danger'))
    } else {
      dispatch(register({ name, email, password }))
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
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group form-group-password'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            value={password}
            onChange={onChange}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='password-toggle'
          >
            <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
          </button>
        </div>
        <div className='form-group form-group-password'>
          <input
            type={showPassword2 ? 'text' : 'password'}
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={onChange}
          />
          <button
            type='button'
            onClick={() => setShowPassword2(!showPassword2)}
            className='password-toggle'
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

export default Register
