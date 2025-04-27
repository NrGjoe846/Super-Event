import { useState } from "react";
import { ButtonCustom } from "./ui/button-custom";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Newsletter Subscription",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };

  const footerLinks = {
    quickLinks: [
      { label: "Browse Venues", path: "/venues" },
      { label: "Event Types", path: "/events" },
      { label: "Add Venue", path: "/add-venue" },
      { label: "List Your Venue", path: "/list-venue" },
      { label: "Dashboard", path: "/dashboard" },
    ],
    support: [
      { label: "FAQ", path: "/faq" },
      { label: "Contact Us", path: "/contact" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Cancellation Policy", path: "/cancellation" },
    ],
    cities: [
      { label: "Delhi", path: "/venues/delhi" },
      { label: "Mumbai", path: "/venues/mumbai" },
      { label: "Bangalore", path: "/venues/bangalore" },
      { label: "Hyderabad", path: "/venues/hyderabad" },
      { label: "Chennai", path: "/venues/chennai" },
    ],
    social: [
      { label: "Facebook", url: "https://facebook.com" },
      { label: "Twitter", url: "https://twitter.com" },
      { label: "Instagram", url: "https://instagram.com" },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1 - Logo & About */}
            <div className="flex flex-col">
              <Link to="/" className="flex items-center mb-4">
                <span className="text-brand-blue font-bold text-xl">
                  Super<span className="text-brand-gold">Events</span>
                </span>
              </Link>
              <p className="text-gray-600 text-sm mb-6">
                India's premier venue booking platform connecting event planners with exceptional spaces for memorable experiences.
              </p>
              <div className="flex space-x-4 mt-auto">
                {footerLinks.social.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-brand-blue transition-colors"
                    aria-label={social.label}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-brand-blue text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Popular Cities */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Popular Cities</h3>
              <ul className="space-y-3">
                {footerLinks.cities.map((city) => (
                  <li key={city.path}>
                    <Link
                      to={city.path}
                      className="text-gray-600 hover:text-brand-blue text-sm transition-colors"
                    >
                      {city.label}
                    </Link>
                  </li>
                ))}
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
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Super Events. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {footerLinks.support.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-500 hover:text-brand-blue text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
