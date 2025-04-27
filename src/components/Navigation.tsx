import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const routes = [
    { path: '/home', label: 'Home', public: true },
    { path: '/venues', label: 'Venues', public: true },
    { path: '/events', label: 'Events', public: true },
    { path: '/about', label: 'About', public: true },
    { path: '/contact', label: 'Contact', public: true },
    { path: '/dashboard', label: 'Dashboard', public: false },
    { path: '/add-venue', label: 'Add Venue', public: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    if (!user && !routes.find(route => route.path === path)?.public) {
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div 
            className="text-brand-blue font-bold text-2xl cursor-pointer"
            onClick={() => navigate('/home')}
          >
            Super<span className="text-brand-gold">Events</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {routes.map(route => (
              ((route.public || user) && (
                <span
                  key={route.path}
                  onClick={() => handleNavigation(route.path)}
                  className={`cursor-pointer transition-colors ${
                    isActive(route.path)
                      ? 'text-brand-blue font-medium'
                      : 'text-gray-600 hover:text-brand-blue'
                  }`}
                >
                  {route.label}
                </span>
              ))
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.name}</span>
                <span 
                  className="cursor-pointer text-brand-blue hover:text-brand-blue/80"
                  onClick={() => navigate('/auth')}
                >
                  Logout
                </span>
              </div>
            ) : (
              <span 
                className="cursor-pointer text-brand-blue hover:text-brand-blue/80"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
