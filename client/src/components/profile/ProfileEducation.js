import dayjs from 'dayjs'

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, from, to, description },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      {dayjs(from).format('YYYY/MM/DD')} -{' '}
      {!to ? ' Now' : ` ${dayjs(to).format('YYYY/MM/DD')}`}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      <strong>Field of Study: </strong> {fieldofstudy}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
)
export default ProfileEducation
