import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar"; // Adjust path as needed
import { Footer } from "../components/Footer"; // Adjust path as needed
import { ButtonCustom } from "../components/ui/button-custom"; // Import ButtonCustom
import { Input } from "../components/ui/input"; // Import Input

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
      // setSearchQuery(""); // Optional: Clear search query after navigating
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16"> {/* Standard padding for navbar */}
        <div className="container mx-auto px-4 md:px-6"> {/* Standard container */}
          <div className="text-center py-16"> {/* Added padding for vertical centering within main */}
            <h1 className="md:text-5xl text-4xl font-bold text-brand-blue mb-8">404 - Page Not Found</h1>
            <p className="md:text-2xl text-xl text-gray-700 mb-10">Oops! Looks like you've ventured into uncharted territory.</p>

            {/* New Search Bar */}
            <div className="max-w-md mx-auto mb-10">
              <form onSubmit={handleSearch}>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for venues..."
                    className="flex-1" // Ensure input takes available space
                  />
                  <ButtonCustom type="submit" variant="outline">
                    Search
                  </ButtonCustom>
                </div>
              </form>
            </div>

            {/* New Links Section */}
            <p className="md:text-lg text-base text-gray-600 mb-4">Or, try one of these pages:</p>
            <div className="flex flex-wrap justify-center sm:gap-6 gap-4 mb-10">
              <Link to="/venues" className="text-brand-blue hover:underline">
                Browse Venues
              </Link>
              <Link to="/events" className="text-brand-blue hover:underline">
                Upcoming Events
              </Link>
              <Link to="/contact" className="text-brand-blue hover:underline">
                Contact Us
              </Link>
            </div>

            <Link to="/">
              <ButtonCustom variant="gold" size="lg">
                Return to Home
              </ButtonCustom>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
