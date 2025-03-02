
import { ButtonCustom } from "./ui/button-custom";

export const CtaSection = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 rounded-2xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden glass-card">
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Indian Venue?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of event planners who've discovered exceptional venues for unforgettable Indian celebrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonCustom variant="gold" size="lg" className="min-w-[180px]">
                Get Started
              </ButtonCustom>
              <ButtonCustom variant="outline" size="lg" className="min-w-[180px]">
                List Your Venue
              </ButtonCustom>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
