import Navbar from "../components/home/Navbar"
import LoginSection from "../components/home/LoginSection"
import CarouselSection from "../components/home/CarouselSection"
import AboutSection from "../components/home/AboutSection"
import Footer from "../components/home/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <LoginSection />
      <CarouselSection />
      <AboutSection />
      <Footer />
    </>
  )
}
