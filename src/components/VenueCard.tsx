import React, { useState, useRef, useEffect } from "react";
import { ButtonCustom } from "./ui/button-custom";
import { ArrowRight } from "lucide-react";

interface VenueCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  featured?: boolean;
  availability?: string[];
  amenities?: string[];
}

export const VenueCard: React.FC<VenueCardProps> = ({
  id,
  image,
  name,
  location,
  price,
  rating,
  featured = false,
  availability = ["Monday", "Tuesday", "Wednesday"],
  amenities = ["Parking", "WiFi", "Catering"],
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`glass-card overflow-hidden transition-all duration-500 ${
        featured ? "sm:col-span-2" : ""
      } ${isHovered ? "shadow-xl translate-y-[-4px]" : "shadow-md"} ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDetails(false);
      }}
      style={{ transitionDelay: `${Math.random() * 0.3}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          } ${isHovered ? "scale-110 brightness-90" : "scale-100"}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        {featured && (
          <div className="absolute top-3 left-3 bg-brand-gold px-3 py-1 rounded-full text-xs font-medium text-brand-blue animate-pulse-subtle">
            Featured
          </div>
        )}
        
        {/* Quick action buttons that appear on hover */}
        <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <button 
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white text-brand-blue"
            aria-label="Add to wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button 
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white text-brand-blue"
            aria-label="Share venue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD700" stroke="#FFD700" />
            </svg>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        
        {/* Additional venue details that appear when showDetails is true */}
        <div className={`overflow-hidden transition-all duration-300 ${showDetails ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">AVAILABILITY</h4>
              <div className="flex flex-wrap gap-1">
                {availability.map((day, index) => (
                  <span key={index} className="inline-block text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">AMENITIES</h4>
              <div className="flex flex-wrap gap-1">
                {amenities.map((amenity, index) => (
                  <span key={index} className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-brand-blue">₹{price.toLocaleString()}</span>
            <span className="text-sm text-gray-500"> /day</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 hover:text-brand-blue underline"
            >
              {showDetails ? "Less info" : "More info"}
            </button>
            <ButtonCustom 
              variant="primary" 
              size="sm" 
              className="transition-all"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              View Details
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};
