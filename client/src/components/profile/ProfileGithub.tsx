import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getGithubRepos } from '../../slices/profileSlice'
import Spinner from '../layout/Spinner'
import styles from './ProfileGithub.module.css'

interface Props {
  username: string
}

const ProfileGithub = ({ username }: Props) => {
  const dispatch = useAppDispatch()
  const repos = useAppSelector((state) => state.profile.repos)

  useEffect(() => {
    dispatch(getGithubRepos(username))
  }, [dispatch, username])

  return (
    <div className={styles.profileGithub}>
      <h2 className='text-primary my-1'>Github Repos</h2>
      {repos.length === 0 ? (
        <Spinner />
      ) : (
        repos.map((repo) => (
          <div key={repo.id} className={`${styles.repo} bg-white p-1 my-1`}>
            <div>
              <h4>
                <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'> Stars: {repo.stargazers_count}</li>
                <li className='badge badge-dark'> Watchers: {repo.watchers_count}</li>
                <li className='badge badge-light'> Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ProfileGithub
