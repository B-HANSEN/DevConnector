import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import { getProfiles } from '../../slices/profileSlice'

const Profiles = () => {
  const dispatch = useAppDispatch()
  const { profiles, loading } = useAppSelector((state) => state.profile)

  useEffect(() => {
    dispatch(getProfiles())
  }, [dispatch])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop' /> Browse and connect with
            developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Profiles
