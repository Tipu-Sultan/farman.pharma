import Hero from '@/components/Hero'
import About from '@/components/About'
import Academics from '@/components/Academics'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Academics />
      <About />
      <Contact />
    </main>
  )
}