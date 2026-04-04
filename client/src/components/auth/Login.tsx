import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { login } from '../../slices/authSlice'

const Login = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group' style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            minLength={6}
            value={password}
            onChange={onChange}
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

export default Login
