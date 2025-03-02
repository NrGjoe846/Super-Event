
import { useState, useEffect, useRef } from "react";
import { VenueCard } from "./VenueCard";
import { ButtonCustom } from "./ui/button-custom";

export const Featured = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const venues = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1590596724152-f8aa7b67e637?q=80&w=2072&auto=format&fit=crop",
      name: "Taj Palace Banquet Hall",
      location: "New Delhi, India",
      price: 75000,
      rating: 4.9,
      featured: true
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1582972431171-5087a815018b?q=80&w=2070&auto=format&fit=crop",
      name: "Marine Drive Convention",
      location: "Mumbai, Maharashtra",
      price: 65000,
      rating: 4.7
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1601959124933-71e57ba8f7de?q=80&w=2071&auto=format&fit=crop",
      name: "Royal Rajputana Heritage",
      location: "Jaipur, Rajasthan",
      price: 82000,
      rating: 4.8
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
      name: "Mysore Palace Gardens",
      location: "Mysore, Karnataka",
      price: 120000,
      rating: 4.9
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1586132527833-6fa4ea92429c?q=80&w=2070&auto=format&fit=crop",
      name: "Kerala Backwaters Resort",
      location: "Kochi, Kerala",
      price: 95000,
      rating: 4.6
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="bg-brand-blue/5 text-brand-blue text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">Featured Venues</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Exceptional Spaces for Indian Celebrations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of stunning venues perfect for all Indian celebrations - from grand weddings to corporate events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {venues.map((venue, index) => (
            <div 
              key={venue.id} 
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <VenueCard {...venue} />
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <ButtonCustom variant="outline" size="lg" className="mx-auto">
            View All Venues
          </ButtonCustom>
        </div>
      </div>
    </section>
  );
};
