import { useState, useEffect } from "react";
import { ButtonCustom } from "./ui/button-custom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAuthClick = (type: 'signin' | 'signup') => {
    navigate('/auth');
    // In a real app, you might pass a parameter to set which form to show
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/90 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/home" className="flex items-center">
          <span className="text-brand-blue font-bold text-2xl">gather<span className="text-brand-gold">haven</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/home" className="text-gray-800 hover:text-brand-blue font-medium text-sm transition-colors duration-300">
            Home
          </Link>
          <Link to="/venues" className="text-gray-800 hover:text-brand-blue font-medium text-sm transition-colors duration-300">
            Venues
          </Link>
          <Link to="/events" className="text-gray-800 hover:text-brand-blue font-medium text-sm transition-colors duration-300">
            Event Types
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-brand-blue font-medium text-sm transition-colors duration-300">
            About
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700">
                {user?.isGuest ? "Guest User" : `Hi, ${user?.name}`}
              </span>
              <ButtonCustom variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </ButtonCustom>
            </>
          ) : (
            <>
              <ButtonCustom variant="outline" size="sm" onClick={() => handleAuthClick('signin')}>
                Sign In
              </ButtonCustom>
              <ButtonCustom variant="primary" size="sm" onClick={() => handleAuthClick('signup')}>
                Sign Up
              </ButtonCustom>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col space-y-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-brand-blue transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-brand-blue transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-brand-blue transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      }`}>
        <div className="h-full flex flex-col pt-20 pb-6 px-6">
          <nav className="flex flex-col space-y-6 items-center text-center mb-auto">
            <Link to="/home" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/venues" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
              Venues
            </Link>
            <Link to="/events" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
              Event Types
            </Link>
            <Link to="/about" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
          </nav>
          
          <div className="flex flex-col space-y-4 w-full mt-8">
            {isAuthenticated ? (
              <>
                <div className="text-center mb-2">
                  <span className="text-gray-700">
                    {user?.isGuest ? "Guest User" : `Hi, ${user?.name}`}
                  </span>
                </div>
                <ButtonCustom 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sign Out
                </ButtonCustom>
              </>
            ) : (
              <>
                <ButtonCustom 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAuthClick('signin');
                  }}
                >
                  Sign In
                </ButtonCustom>
                <ButtonCustom 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAuthClick('signup');
                  }}
                >
                  Sign Up
                </ButtonCustom>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};