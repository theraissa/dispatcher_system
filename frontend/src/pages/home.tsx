import NavbarHome from "../components/home/navbar-home"
import LoginSection from "../components/home/login-section"
import CarouselSection from "../components/home/carousel-section"
import AboutSection from "../components/home/about-section"
import Footer from "../components/home/footer"

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
