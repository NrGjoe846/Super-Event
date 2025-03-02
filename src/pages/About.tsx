
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CtaSection } from "../components/CtaSection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About VenueFinder India</h1>
            <p className="text-lg text-gray-600">
              Connecting people with India's most exceptional venues for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2022, VenueFinder India was born from a simple observation: finding the perfect venue for Indian celebrations was unnecessarily complicated. Whether planning a traditional wedding, a corporate event, or a milestone celebration, venue hunting was time-consuming and stressful.
              </p>
              <p className="text-gray-600">
                Our founders experienced this firsthand while planning events across Delhi, Mumbai, and Bangalore. They realized that India's rich venue landscape - from heritage havelis to modern convention centers - needed a platform that could showcase these spaces while simplifying the booking process.
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1604351888999-9ea0a2851e41?q=80&w=2070&auto=format&fit=crop" 
                alt="Indian Wedding Venue" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-10">
              We're on a mission to transform how Indians discover and book venues, making it effortless to find spaces that perfectly match their vision, budget, and requirements. From royal palaces in Rajasthan to beachfront resorts in Goa, we're showcasing India's diverse venue offerings while empowering venue owners to connect with their ideal customers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-lg">
                <div className="bg-brand-blue/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                    <path d="m7.9 20 6.2-16" />
                    <path d="M4 20h16" />
                    <path d="M4 8h3" />
                    <path d="M7 12h3" />
                    <path d="M10 16h3" />
                    <path d="M14 8h3" />
                    <path d="M17 12h3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Curated Selection</h3>
                <p className="text-gray-600">
                  We personally vet every venue across India to ensure quality, authenticity, and service excellence.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <div className="bg-brand-blue/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  Clear pricing information for all venues, with no hidden fees or last-minute surprises.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <div className="bg-brand-blue/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                    <path d="M2 12h20" />
                    <path d="M12 2v20" />
                    <path d="m4.93 4.93 14.14 14.14" />
                    <path d="m19.07 4.93-14.14 14.14" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Pan-India Coverage</h3>
                <p className="text-gray-600">
                  From the Himalayan foothills to coastal Kerala, we feature venues in every region of India.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto max-w-[180px]">
                  <img 
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop"
                    alt="Arjun Sharma" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">Arjun Sharma</h3>
                <p className="text-gray-600">Co-Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto max-w-[180px]">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop" 
                    alt="Priya Patel" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">Priya Patel</h3>
                <p className="text-gray-600">Co-Founder & COO</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto max-w-[180px]">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Rahul Mehta" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">Rahul Mehta</h3>
                <p className="text-gray-600">CTO</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto max-w-[180px]">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" 
                    alt="Meera Reddy" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">Meera Reddy</h3>
                <p className="text-gray-600">Head of Marketing</p>
              </div>
            </div>
          </div>
        </div>
        
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
