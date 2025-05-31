import { ButtonCustom } from "./ui/button-custom";

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-brand-blue text-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Hear from event planners and venue owners who've experienced the Super Events difference
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover-scale">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Sarah Johnson</h4>
                <p className="text-white/70 text-sm">Event Planner</p>
              </div>
            </div>
            <p className="italic text-white/90">
              "Super Events made organizing our company retreat so simple. The venue recommendation tool helped us find the perfect lakeside location that impressed everyone."
            </p>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover-scale">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                  alt="Michael Chen" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Michael Chen</h4>
                <p className="text-white/70 text-sm">Venue Owner</p>
              </div>
            </div>
            <p className="italic text-white/90">
              "Since listing my downtown event space on Super Events, bookings have increased by 70%. The platform's intuitive calendar and payment system saves me hours of admin work."
            </p>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover-scale">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" 
                  alt="Jessica Martinez" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Jessica Martinez</h4>
                <p className="text-white/70 text-sm">Recent Bride</p>
              </div>
            </div>
            <p className="italic text-white/90">
              "Planning a wedding is stressful enough, but Super Events made venue selection a breeze. We found our dream garden location and handled all booking details in one afternoon!"
            </p>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
