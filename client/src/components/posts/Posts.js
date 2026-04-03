import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'
import { getPosts } from '../../slices/postSlice'
import PostForm from './PostForm'

const Posts = () => {
  const dispatch = useDispatch()
  const { posts, loading } = useSelector((state) => state.post)

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch])

  return loading ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community
      </p>
      <PostForm />
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </>
  )
}

export default Posts
