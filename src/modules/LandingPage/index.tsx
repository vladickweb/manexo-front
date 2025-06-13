import { useState } from "react";

import { LoginModal } from "@/components/Login/LoginModal";
import { About } from "@/modules/LandingPage/components/About";
import { FAQ } from "@/modules/LandingPage/components/FAQ";
import { Features } from "@/modules/LandingPage/components/Features";
import { Footer } from "@/modules/LandingPage/components/Footer";
import { Header } from "@/modules/LandingPage/components/Header";
import { Hero } from "@/modules/LandingPage/components/Hero";
import { Testimonials } from "@/modules/LandingPage/components/Testimonials";

export const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Features />
        <About />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </div>
  );
};
