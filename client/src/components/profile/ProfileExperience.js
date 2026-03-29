import dayjs from 'dayjs'

const ProfileExperience = ({
  experience: { company, title, from, to, description },
}) => (
  <div>
    <h3 className='text-dark'>{company}</h3>
    <p>
      {dayjs(from).format('YYYY/MM/DD')} -{' '}
      {!to ? 'Now' : dayjs(to).format('YYYY/MM/DD')}
    </p>
    <p>
      <strong>Position: </strong> {title}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
)
export default ProfileExperience
