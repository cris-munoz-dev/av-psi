import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Mission from '../components/Mission'
import Contact from '../components/Contact'
import Divider from '../components/Divider'
import KeyHabilitiesAccordion from '../components/KeyHabilitiesAccordion'

const Landing = () => {
  return (
    <>
      <Hero />
      <Divider />
      <About />
      <Services />
      <KeyHabilitiesAccordion />
      <Mission />
      <Contact />
    </>
  )
}

export default Landing;
