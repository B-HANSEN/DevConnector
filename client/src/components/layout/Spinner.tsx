import spinner from './spinner.gif'
import styles from './Spinner.module.css'

const Spinner = () => (
  <img
    src={spinner}
    className={styles.spinner}
    alt='Loading...'
  />
)

export default Spinner
