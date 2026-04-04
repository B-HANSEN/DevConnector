import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import Spinner from '../layout/Spinner'
import { getPost } from '../../slices/postSlice'
import PostItem from '../posts/PostItem'
import CommentItem from '../post/CommentItem'
import CommentForm from '../post/CommentForm'

const Post = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const { post, loading } = useAppSelector((state) => state.post)

  useEffect(() => {
    if (id) dispatch(getPost(id))
  }, [dispatch, id])

  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to='/posts' className='btn'>
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  )
}

export default Post
