import { Link } from 'react-router-dom'
import type { Profile } from '../../types'
import styles from './ProfileItem.module.css'

interface Props {
  profile: Profile
}

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}: Props) => {
  return (
    <div className={`${styles.profile} bg-light`}>
      <img src={avatar} className='round-img' alt='' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          {' '}
          View Profile
        </Link>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check' /> {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileItem
