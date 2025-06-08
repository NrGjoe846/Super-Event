import React, { useState } from 'react';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import { Venue } from '../services/venueService';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ManageVenuesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleAddVenueClick = () => {
    setSelectedVenue(null);
    setShowForm(true);
  };

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedVenue(null);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedVenue(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to manage venues.</p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Manage Venues
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Add, edit, and manage your event venues with ease.
            </p>
          </header>

          {showForm ? (
            <div className="max-w-2xl mx-auto bg-background shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {selectedVenue ? 'Edit Venue' : 'Add New Venue'}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleFormCancel}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <VenueForm
                venueToEdit={selectedVenue}
                onFormSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <VenueList
              onEditVenue={handleEditVenue}
              onAddVenue={handleAddVenueClick}
              refreshKey={refreshKey}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageVenuesPage;
