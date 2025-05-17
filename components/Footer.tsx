import styles from './Footer.module.css'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <>
      <footer className={styles.footer}>
        <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
      </footer>
    </>
  )
}

export default Footer 