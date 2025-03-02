
import { useState } from "react";
import { ButtonCustom } from "./ui/button-custom";
import { Link } from "react-router-dom";

export const Footer = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
    // Add subscription logic here
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 - Logo & About */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-brand-blue font-bold text-xl">gather<span className="text-brand-gold">haven</span></span>
            </Link>
            <p className="text-gray-600 text-sm mb-6">
              Premium venue booking platform connecting event planners with exceptional spaces for memorable experiences.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/venues" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Browse Venues</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Event Types</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/list-venue" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">List Your Venue</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Help & Support */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-gray-600 hover:text-brand-blue text-sm transition-colors">Cancellation Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for venue inspirations and special offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  required
                />
              </div>
              <ButtonCustom type="submit" variant="primary" size="sm" className="w-full">
                Subscribe
              </ButtonCustom>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} gatherhaven. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-brand-blue text-sm mr-4 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-brand-blue text-sm transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
