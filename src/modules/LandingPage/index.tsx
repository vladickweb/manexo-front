import { About } from "@/modules/LandingPage/components/About";
import { Features } from "@/modules/LandingPage/components/Features";
import { Footer } from "@/modules/LandingPage/components/Footer";
import { Header } from "@/modules/LandingPage/components/Header";
import { Hero } from "@/modules/LandingPage/components/Hero";

export const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <About />
      <Footer />
    </div>
  );
};
