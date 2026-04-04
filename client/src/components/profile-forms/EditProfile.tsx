import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { createProfile, getCurrentProfile } from '../../slices/profileSlice'
import Spinner from '../layout/Spinner'
import type { Profile } from '../../types'

type ProfileFormData = {
  company: string
  website: string
  location: string
  status: string
  skills: string
  githubusername: string
  bio: string
  twitter: string
  facebook: string
  linkedin: string
  youtube: string
  instagram: string
}

// Outer container — fetches profile and shows spinner until ready
const EditProfile = () => {
  const dispatch = useAppDispatch()
  const { profile, loading } = useAppSelector((state) => state.profile)

  useEffect(() => {
    dispatch(getCurrentProfile())
  }, [dispatch])

  if (loading || !profile) return <Spinner />

  return <EditProfileForm profile={profile} />
}

// Inner form — only mounts after profile is loaded, so useState can initialize from props
const EditProfileForm = ({ profile }: { profile: Profile }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const initialData: ProfileFormData = {
    company: profile.company ?? '',
    website: profile.website ?? '',
    location: profile.location ?? '',
    status: profile.status ?? '',
    skills: profile.skills?.join(',') ?? '',
    githubusername: profile.githubusername ?? '',
    bio: profile.bio ?? '',
    twitter: profile.social?.twitter ?? '',
    facebook: profile.social?.facebook ?? '',
    linkedin: profile.social?.linkedin ?? '',
    youtube: profile.social?.youtube ?? '',
    instagram: profile.social?.instagram ?? '',
  }

  const [formData, setFormData] = useState<ProfileFormData>(initialData)
  const [isDirty, setIsDirty] = useState(false)
  const [displaySocialInputs, toggleSocialInputs] = useState(false)

  const {
    company, website, location, status, skills,
    githubusername, bio, twitter, facebook, linkedin, youtube, instagram,
  } = formData

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const updated = { ...formData, [e.target.name]: e.target.value }
    setFormData(updated)
    setIsDirty(
      Object.keys(updated).some(
        (key) =>
          updated[key as keyof ProfileFormData] !==
          initialData[key as keyof ProfileFormData],
      ),
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(createProfile(formData, navigate, true))
  }

  return (
    <>
      <h1 className='large text-primary'>Edit Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Let&apos;s get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <select name='status' value={status} onChange={onChange}>
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Director'>Director</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Instructor'>Instructor or Teacher</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>Give us an idea of where you are at in your career</small>
        </div>
        <div className='form-group'>
          <input type='text' placeholder='Company' name='company' value={company} onChange={onChange} />
          <small className='form-text'>Could be your own company or one you work for</small>
        </div>
        <div className='form-group'>
          <input type='text' placeholder='Website' name='website' value={website} onChange={onChange} />
          <small className='form-text'>Could be your own or a company website</small>
        </div>
        <div className='form-group'>
          <input type='text' placeholder='Location' name='location' value={location} onChange={onChange} />
          <small className='form-text'>City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className='form-group'>
          <input type='text' placeholder='* Skills' name='skills' value={skills} onChange={onChange} />
          <small className='form-text'>
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input type='text' placeholder='Github Username' name='githubusername' value={githubusername} onChange={onChange} />
          <small className='form-text'>
            If you want your latest repos and a Github link, include your username
          </small>
        </div>
        <div className='form-group'>
          <textarea placeholder='A short bio of yourself' name='bio' value={bio} onChange={onChange}></textarea>
          <small className='form-text'>Tell us a little about yourself</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            {displaySocialInputs ? 'Hide Social Network Links' : 'Add Social Network Links'}
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x'></i>
              <input type='text' placeholder='Twitter URL' name='twitter' value={twitter} onChange={onChange} />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x'></i>
              <input type='text' placeholder='Facebook URL' name='facebook' value={facebook} onChange={onChange} />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x'></i>
              <input type='text' placeholder='YouTube URL' name='youtube' value={youtube} onChange={onChange} />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x'></i>
              <input type='text' placeholder='Linkedin URL' name='linkedin' value={linkedin} onChange={onChange} />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x'></i>
              <input type='text' placeholder='Instagram URL' name='instagram' value={instagram} onChange={onChange} />
            </div>
          </>
        )}

        <button
          type='submit'
          className='btn btn-primary my-1'
          disabled={!isDirty}
          style={{ opacity: isDirty ? 1 : 0.4, cursor: isDirty ? 'pointer' : 'not-allowed' }}
        >
          Save
        </button>
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </>
  )
}

export default EditProfile
