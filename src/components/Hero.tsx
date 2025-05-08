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
      image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=2036&auto=format&fit=crop",
      title: "Exceptional Corporate Events",
      description: "Host impactful business meetings and conferences in India's premier venues and heritage properties.",
    },
    {
      image: "https://images.unsplash.com/photo-1598386651573-9232cc0c2d6c?q=80&w=2070&auto=format&fit=crop",
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
    setIsSearchModalOpen(true);
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
                onClick={() => navigate("/venues")}
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

      {/* Venue Search Modal */}
      <VenueSearchModal 
        isOpen={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen} 
        onSearch={(filters) => {
          navigate("/venues", { state: { filters } });
        }}
      />
    </section>
  );
};

interface VenueSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: any) => void;
}

interface SearchFilters {
  accessType: string;
  eventName: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  activities: string[];
}

const VenueSearchModal: React.FC<VenueSearchModalProps> = ({ isOpen, onOpenChange, onSearch }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    accessType: "public",
    eventName: "",
    location: "",
    date: "",
    time: "",
    capacity: 50,
    activities: []
  });
  
  const availableActivities = [
    "Catering", "Bar Service", "DJ/Music", "Decoration", 
    "Photography", "Valet Parking", "Accommodation", "Outdoor Space"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleActivityToggle = (activity: string) => {
    setFilters(prev => {
      const activities = [...prev.activities];
      if (activities.includes(activity)) {
        return { ...prev, activities: activities.filter(a => a !== activity) };
      } else {
        return { ...prev, activities: [...activities, activity] };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSearch(filters);
      onOpenChange(false);
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Venue</h2>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-full flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-500"
              }`}>1</div>
              <div className={`flex-1 h-1 ${currentStep >= 2 ? "bg-brand-blue" : "bg-gray-200"}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-500"
              }`}>2</div>
              <div className={`flex-1 h-1 ${currentStep >= 3 ? "bg-brand-blue" : "bg-gray-200"}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-500"
              }`}>3</div>
            </div>
          </div>
          
          {/* Step 1: Event Type & Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Access Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessType"
                      value="public"
                      checked={filters.accessType === "public"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Public Event
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessType"
                      value="private"
                      checked={filters.accessType === "private"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Private Event
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={filters.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter your event name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Location, Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Enter city or area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filters.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={filters.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Capacity & Activities */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Capacity: {filters.capacity} guests
                </label>
                <input
                  type="range"
                  id="capacity"
                  name="capacity"
                  min="10"
                  max="1000"
                  step="10"
                  value={filters.capacity}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10</span>
                  <span>500</span>
                  <span>1000</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities & Services
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableActivities.map(activity => (
                    <label key={activity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.activities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="mr-2"
                      />
                      {activity}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <ButtonCustom
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </ButtonCustom>
            
            <ButtonCustom
              variant="gold"
              onClick={handleNext}
            >
              {currentStep < 3 ? "Next" : "Search Venues"}
            </ButtonCustom>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
