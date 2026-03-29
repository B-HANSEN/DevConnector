import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import { addLike, removeLike, deletePost } from '../../actions/post'

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  showActions,
}) => (
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

      {/* render actions only in post component, but not in comment component; reuse other code for both components */}
      {showActions && (
        <>
          <button
            onClick={() =>
              likes.find((like) => like.user === auth.user._id)
                ? removeLike(_id)
                : addLike(_id)
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
          {/* post user vs login user must match */}
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={(e) => deletePost(_id)}
              // disabled={user !== auth.user._id}
              type='button'
              className={'btn btn-danger'}
              // className={user !== auth.user._id ? 'btn btn-danger' : 'btn btn-grey'}
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </>
      )}
    </div>
  </div>
)

PostItem.defaultProps = {
  showActions: true,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem,
)
