import dayjs from 'dayjs'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { Link } from 'react-router-dom'
import { addLike, deletePost, removeLike } from '../../slices/postSlice'
import type { Post } from '../../types'

interface Props {
  post: Post
  showActions?: boolean
}

const PostItem = ({ post: { _id, text, name, avatar, user, likes, comments, date }, showActions = true }: Props) => {
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

        {showActions && (
          <>
            <button
              onClick={() =>
                likes.find((like) => like.user === auth.user?._id)
                  ? dispatch(removeLike(_id))
                  : dispatch(addLike(_id))
              }
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-up'></i>{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user?._id && (
              <button
                onClick={() => dispatch(deletePost(_id))}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times'></i>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PostItem
