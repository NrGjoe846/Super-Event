import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getVenuesByOwner, deleteVenue } from "@/services/venueService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("venues");
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([
    {
      id: "1",
      venueName: "Sample Venue",
      date: "2024-03-15",
      time: "14:00",
      status: "confirmed",
      amount: 25000
    }
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    loadVenues();
  }, [user, navigate]);

  const loadVenues = async () => {
    try {
      const userVenues = await getVenuesByOwner(user.id);
      setVenues(userVenues);
    } catch (error) {
      toast({
        title: "Error loading venues",
        description: "Failed to load your venues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      await deleteVenue(venueId, user.id);
      toast({
        title: "Venue Deleted",
        description: "The venue has been successfully deleted.",
      });
      loadVenues();
    } catch (error) {
      toast({
        title: "Error Deleting Venue",
        description: "Failed to delete venue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}!
              </p>
            </div>
            <ButtonCustom
              variant="gold"
              onClick={() => navigate("/add-venue")}
            >
              Add New Venue
            </ButtonCustom>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-2">Total Venues</h3>
              <p className="text-3xl font-bold text-brand-blue">
                {venues.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-2">Active Bookings</h3>
              <p className="text-3xl font-bold text-brand-blue">
                {bookings.filter(b => b.status === "confirmed").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-brand-blue">
                ₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full border-b">
                <TabsTrigger value="venues" className="flex-1">
                  My Venues
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex-1">
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="venues" className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading venues...</p>
                  </div>
                ) : venues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue: any) => (
                      <div key={venue.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <img
                          src={venue.images[0]}
                          alt={venue.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                          <p className="text-gray-600 text-sm mb-4">{venue.location}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-brand-blue font-medium">
                              ₹{venue.price.toLocaleString()}/day
                            </p>
                            <div className="flex gap-2">
                              <ButtonCustom
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/edit-venue/${venue.id}`)}
                              >
                                Edit
                              </ButtonCustom>
                              <ButtonCustom
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteVenue(venue.id)}
                              >
                                Delete
                              </ButtonCustom>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No Venues Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start by adding your first venue to Super Events
                    </p>
                    <ButtonCustom
                      variant="gold"
                      onClick={() => navigate("/add-venue")}
                    >
                      Add Your First Venue
                    </ButtonCustom>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings" className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Venue</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Time</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-3 px-4">{booking.venueName}</td>
                          <td className="py-3 px-4">{booking.date}</td>
                          <td className="py-3 px-4">{booking.time}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">₹{booking.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <ButtonCustom variant="outline" size="sm">
                              View Details
                            </ButtonCustom>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on bringing you detailed analytics and insights about your venues and bookings.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
