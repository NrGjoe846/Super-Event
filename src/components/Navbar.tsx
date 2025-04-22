import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ButtonCustom } from "./ui/button-custom";
import { Search, X } from "lucide-react";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log({ searchQuery });
    setIsSearchOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/80 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-brand-blue font-bold text-2xl">
              gather<span className="text-brand-gold">haven</span>
            </span>
          </Link>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className="text-gray-800 hover:text-brand-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/venues"
              className="text-gray-800 hover:text-brand-blue transition-colors"
            >
              Venues
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-brand-blue transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-brand-blue transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isSearchOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for venues..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
              <ButtonCustom
                type="submit"
                variant="gold"
                icon={<Search className="h-4 w-4" />}
              >
                Search
              </ButtonCustom>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};
