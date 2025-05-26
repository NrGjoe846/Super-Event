import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllVenues as getVenuesByOwner, deleteVenue } from "@/services/venueService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([
    {
      id: "1",
      venueName: "Sample Venue",
      customerName: "John Doe",
      date: "2024-03-15",
      time: "14:00",
      status: "confirmed",
      amount: 25000
    }
  ]);

  // Analytics data
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 45000, 35000, 50000, 60000, 75000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Bookings',
        data: [10, 15, 12, 18, 20, 25],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const analyticsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Performance'
      }
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                Welcome back, {user?.name}! Here's your venue management overview.
              </p>
            </div>
            <div className="flex gap-3">
              <ButtonCustom
                variant="outline"
                onClick={() => navigate("/venues")}
              >
                View All Venues
              </ButtonCustom>
              <ButtonCustom
                variant="gold"
                onClick={() => navigate("/add-venue")}
              >
                Add New Venue
              </ButtonCustom>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-brand-blue">
                ₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Active Venues</h3>
              <p className="text-3xl font-bold text-brand-blue">{venues.length}</p>
              <p className="text-sm text-gray-600 mt-2">Across {venues.length} locations</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-brand-blue">{bookings.length}</p>
              <p className="text-sm text-green-600 mt-2">+5% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Rating</h3>
              <p className="text-3xl font-bold text-brand-blue">4.8</p>
              <p className="text-sm text-gray-600 mt-2">From 150 reviews</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full border-b p-0">
                <TabsTrigger value="overview" className="flex-1 py-4">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="venues" className="flex-1 py-4">
                  My Venues
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex-1 py-4">
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 py-4">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div>
                            <p className="font-medium">{booking.venueName}</p>
                            <p className="text-sm text-gray-600">{booking.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{booking.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{format(new Date(booking.date), 'PP')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Popular Venues</h3>
                    <div className="space-y-4">
                      {venues.slice(0, 5).map((venue: any) => (
                        <div key={venue.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <img
                              src={venue.images[0]}
                              alt={venue.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{venue.name}</p>
                              <p className="text-sm text-gray-600">{venue.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{venue.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{venue.bookings || 0} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

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
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{venue.name}</h3>
                            <span className="bg-brand-blue/10 text-brand-blue text-xs px-2 py-1 rounded-full">
                              {venue.bookings || 0} bookings
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{venue.location}</p>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{venue.rating.toFixed(1)}</span>
                            <span className="text-gray-500">({venue.reviews || 0} reviews)</span>
                          </div>
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
                        <th className="text-left py-3 px-4">Booking ID</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Venue</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-3 px-4">#{booking.id}</td>
                          <td className="py-3 px-4">{booking.customerName}</td>
                          <td className="py-3 px-4">{booking.venueName}</td>
                          <td className="py-3 px-4">{format(new Date(booking.date), 'PP')}</td>
                          <td className="py-3 px-4">₹{booking.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(booking.status)
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue & Bookings</h3>
                    <Line data={analyticsData} options={analyticsOptions} />
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Venues</h3>
                    <div className="space-y-4">
                      {venues.slice(0, 5).map((venue: any, index) => (
                        <div key={venue.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{venue.name}</p>
                            <p className="text-sm text-gray-600">{venue.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{venue.price.toLocaleString()}</p>
                            <p className="text-sm text-green-600">+15% this month</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
