import { useState, useEffect } from "react";
import { ButtonCustom } from "./ui/button-custom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
      title: "Exceptional Corporate Events",
      description: "Host impactful business meetings and conferences in India's premier venues and heritage properties.",
    },
    {
      image: "https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg",
      title: "Celebrate Special Moments",
      description: "Create unforgettable experiences for traditional Indian weddings, birthdays, and cultural celebrations.",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleExploreVenues = () => {
    navigate("/venues");
  };

  const handleListVenue = () => {
    navigate("/add-venue");
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-shadow animate-slide-down">
              {slides[activeSlide].title}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-down" style={{animationDelay: '200ms'}}>
              {slides[activeSlide].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-down" style={{animationDelay: '400ms'}}>
              <ButtonCustom 
                variant="gold" 
                size="lg" 
                className="min-w-[180px]"
                onClick={handleExploreVenues}
              >
                Explore Venues
              </ButtonCustom>
              <ButtonCustom 
                variant="outline" 
                size="lg" 
                className="min-w-[180px] border-white text-white hover:bg-white/10"
                onClick={handleListVenue}
              >
                List Your Venue
              </ButtonCustom>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              activeSlide === index
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
