import { useState, useEffect, useRef } from "react";
import { VenueCard } from "./VenueCard";
import { ButtonCustom } from "./ui/button-custom";

export const Featured = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const venues = [
    {
      id: "1",
      image: "https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg",
      name: "Taj Palace Banquet Hall",
      location: "New Delhi, India",
      price: 75000,
      rating: 4.9,
      featured: true
    },
    {
      id: "2",
      image: "https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg",
      name: "Marine Drive Convention",
      location: "Mumbai, Maharashtra",
      price: 65000,
      rating: 4.7
    },
    {
      id: "3",
      image: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
      name: "Royal Rajputana Heritage",
      location: "Jaipur, Rajasthan",
      price: 82000,
      rating: 4.8
    },
    {
      id: "4",
      image: "https://images.pexels.com/photos/2291462/pexels-photo-2291462.jpeg",
      name: "Mysore Palace Gardens",
      location: "Mysore, Karnataka",
      price: 120000,
      rating: 4.9
    },
    {
      id: "5",
      image: "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg",
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
