import AboutSection from "../components/home/about-section"
import CarouselSection from "../components/home/carousel-section"
import Footer from "../components/home/footer"
import LoginSection from "../components/home/login-section"
import NavbarHome from "../components/home/navbar-home"

export default function Home() {
  return (
    <>
      <NavbarHome />
      <LoginSection />
      <CarouselSection />
      <AboutSection />
      <Footer />
    </>
  )
}
