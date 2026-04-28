import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Mission from './components/Mission'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Divider from './components/Divider'

function App() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Header />
      <main className="flex-grow flex flex-col items-center w-full">
        <Hero />
        <Divider />
        <About />
        <Services />
        <Mission />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
