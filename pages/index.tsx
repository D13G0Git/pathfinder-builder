import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import type { NextPage } from 'next'
import Auth from '@components/Auth'
import Profile from '@components/Profile'
import { useSupabase } from '../contexts/SupabaseContext'

const Home: NextPage = () => {
  const { user } = useSupabase();

  return (
    <div className="container">
      <Head>
        <title>App con Supabase</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Next.js + Supabase" />
        <p className="description">
          {user 
            ? 'Gestiona tu perfil a continuación' 
            : 'Regístrate o inicia sesión para comenzar'}
        </p>
        
        {user ? <Profile /> : <Auth />}
      </main>

      <Footer />
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  )
}

export default Home 