import dayjs from 'dayjs'
import { useAppDispatch } from '../../hooks'
import { deleteEducation } from '../../slices/profileSlice'
import type { Education as EducationType } from '../../types'

interface Props {
  education: EducationType[]
}

const Education = ({ education }: Props) => {
  const dispatch = useAppDispatch()

  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td>
        {dayjs(edu.from).format('DD.MM.YYYY')} -{' '}
        {edu.to === null ? ' Now ' : ` ${dayjs(edu.to).format('DD.MM.YYYY')}`}
      </td>
      <td>
        <button
          onClick={() => dispatch(deleteEducation(edu._id))}
          className='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ))
  return (
    <>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </>
  )
}

export default Education
