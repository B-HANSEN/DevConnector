import dayjs from 'dayjs'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { Link } from 'react-router-dom'
import { deleteComment } from '../../slices/postSlice'
import type { Comment } from '../../types'

interface Props {
  postId: string
  comment: Comment
}

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
}: Props) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {dayjs(date).format('YYYY/MM/DD')}</p>
        {!auth.loading && user === auth.user?._id && (
          <button
            onClick={() => dispatch(deleteComment(postId, _id))}
            type='button'
            className='btn btn-danger'
          >
            <i className='fas fa-times' />
          </button>
        )}
      </div>
    </div>
  )
}

export default CommentItem
