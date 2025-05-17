import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { SupabaseProvider } from '../contexts/SupabaseContext'

function Application({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}

export default Application 