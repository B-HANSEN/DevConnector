import { useState } from 'react'
import { useAppDispatch } from '../../hooks'
import { addComment } from '../../slices/postSlice'

interface Props {
  postId: string
}

const CommentForm = ({ postId }: Props) => {
  const dispatch = useAppDispatch()
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
          cols={30}
          rows={5}
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
