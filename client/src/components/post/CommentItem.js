import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { deleteComment } from '../../slices/postSlice'

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment,
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
      {/* make sure that actual user who made the comment is logged in user */}
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={(e) => deleteComment(postId, _id)}
          type='button'
          className='btn btn-danger'
        >
          <i className='fas fa-times' />
        </button>
      )}
    </div>
  </div>
)
const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)
