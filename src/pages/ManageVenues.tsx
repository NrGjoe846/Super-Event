import React, { useState } from 'react';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import { Venue } from '../services/venueService';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui
import { PlusCircle, X } from 'lucide-react';

const ManageVenuesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger list refresh

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
    setRefreshKey(prevKey => prevKey + 1); // Increment key to trigger refresh
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedVenue(null);
  };

  return (
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
  );
};

export default ManageVenuesPage;
```
