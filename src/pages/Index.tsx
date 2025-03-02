
import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Featured } from "../components/Featured";
import { HowItWorks } from "../components/HowItWorks";
import { EventTypes } from "../components/EventTypes";
import { Testimonials } from "../components/Testimonials";
import { CtaSection } from "../components/CtaSection";
import { Footer } from "../components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Featured />
        <HowItWorks />
        <EventTypes />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
