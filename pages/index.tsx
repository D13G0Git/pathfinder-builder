import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.tsx</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Home 