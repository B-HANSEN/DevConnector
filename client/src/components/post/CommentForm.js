import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../../slices/postSlice'

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Leave a comment</h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(addComment(postId, { text }))
          setText('')
        }}
        className='form my-1'
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

export default CommentForm
