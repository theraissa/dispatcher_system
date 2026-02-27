import Navbar from "../components/home/Navbar.tsx"
import LoginSection from "../components/home/LoginSection.tsx"
import CarouselSection from "../components/home/CarouselSection.tsx"
import AboutSection from "../components/home/AboutSection.tsx"
import Footer from "../components/home/Footer.tsx"
import "../styles/home.css"

export default function Home() {
  return (
    <>
      <Navbar />
      <LoginSection />
      <CarouselSection />
      <AboutSection />
      <Footer />
    </>
  );
}
