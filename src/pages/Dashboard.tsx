import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserVenuesRealtime, useVenueStatistics } from "@/hooks/useVenueRealtime";
import { VenueAnalyticsDashboard } from "@/components/VenueAnalyticsDashboard";
import { VenueStatusBadge } from "@/components/VenueStatusBadge";
import { deleteVenue, getVenueBookings } from "@/services/venueService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Eye, Calendar, Heart, TrendingUp, Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';

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
  const { venues, isLoading } = useUserVenuesRealtime();
  const { statistics, isLoading: statsLoading } = useVenueStatistics();
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  // Load bookings for user's venues
  useEffect(() => {
    const loadBookings = async () => {
      if (venues.length === 0) return;
      
      try {
        const allBookings = [];
        for (const venue of venues) {
          if (venue.id) {
            const venueBookings = await getVenueBookings(venue.id);
            const bookingsWithVenue = venueBookings.map(booking => ({
              ...booking,
              venueName: venue.name
            }));
            allBookings.push(...bookingsWithVenue);
          }
        }
        setBookings(allBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    };

    loadBookings();
  }, [venues]);

  // Analytics data
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [30000, 45000, 35000, 50000, 60000, 75000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1
      },
      {
        label: 'Bookings',
        data: [10, 15, 12, 18, 20, 25],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
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
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Set first venue as selected for analytics
    if (venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id!);
    }
  }, [user, navigate, venues, selectedVenueId]);

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm("Are you sure you want to delete this venue? This action cannot be undone.")) return;

    try {
      await deleteVenue(venueId, user?.id);
      toast({
        title: "Venue Deleted",
        description: "The venue has been successfully deleted.",
      });
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
            <ButtonCustom onClick={() => navigate('/auth')} variant="gold">
              Sign In
            </ButtonCustom>
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
                icon={<Plus className="h-4 w-4" />}
              >
                Add New Venue
              </ButtonCustom>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-blue">
                  ₹{statistics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Venues</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-blue">{statistics.approvedVenues}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {statistics.pendingVenues} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-blue">{statistics.totalBookings}</div>
                <p className="text-xs text-green-600 mt-1">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Venues</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-blue">
                  {statistics.totalVenues}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {statistics.rejectedVenues} rejected
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full border-b p-0">
                <TabsTrigger value="overview" className="flex-1 py-4">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="venues" className="flex-1 py-4">
                  My Venues ({venues.length})
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex-1 py-4">
                  Bookings ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 py-4">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                            <div>
                              <p className="font-medium">{booking.venueName}</p>
                              <p className="text-sm text-gray-600">
                                {booking.guest_count} guests
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{booking.total_amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(booking.booking_date), 'PP')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {bookings.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No bookings yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Venues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {venues.slice(0, 5).map((venue) => (
                          <div key={venue.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                            <div className="flex items-center gap-3">
                              <img
                                src={venue.images[0] || 'https://via.placeholder.com/48x48'}
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
                              <VenueStatusBadge status={venue.status || 'pending'} />
                            </div>
                          </div>
                        ))}
                        {venues.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No venues added yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                    {venues.map((venue) => (
                      <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={venue.images[0] || 'https://via.placeholder.com/400x200'}
                            alt={venue.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <VenueStatusBadge status={venue.status || 'pending'} />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold truncate">{venue.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <span>★</span>
                              <span className="text-sm font-medium">{venue.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 truncate">{venue.location}</p>
                          <p className="text-brand-blue font-medium mb-4">
                            ₹{venue.price.toLocaleString()}/day
                          </p>
                          <div className="flex gap-2">
                            <ButtonCustom
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/edit-venue/${venue.id}`)}
                              icon={<Edit className="h-4 w-4" />}
                            >
                              Edit
                            </ButtonCustom>
                            <ButtonCustom
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVenue(venue.id!)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              icon={<Trash2 className="h-4 w-4" />}
                            >
                              Delete
                            </ButtonCustom>
                          </div>
                        </CardContent>
                      </Card>
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
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add Your First Venue
                    </ButtonCustom>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings" className="p-6">
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Venue</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Time</th>
                          <th className="text-left py-3 px-4">Guests</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b">
                            <td className="py-3 px-4">#{booking.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">{booking.venueName}</td>
                            <td className="py-3 px-4">{format(new Date(booking.booking_date), 'PP')}</td>
                            <td className="py-3 px-4">{booking.start_time} - {booking.end_time}</td>
                            <td className="py-3 px-4">{booking.guest_count}</td>
                            <td className="py-3 px-4">₹{booking.total_amount.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                getStatusColor(booking.status)
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600">
                      Bookings for your venues will appear here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="p-6">
                <div className="space-y-6">
                  {/* Venue Selection for Analytics */}
                  {venues.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Venue for Analytics
                      </label>
                      <select
                        value={selectedVenueId || ''}
                        onChange={(e) => setSelectedVenueId(e.target.value)}
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      >
                        {venues.map((venue) => (
                          <option key={venue.id} value={venue.id}>
                            {venue.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Analytics Dashboard */}
                  {selectedVenueId && (
                    <VenueAnalyticsDashboard venueId={selectedVenueId} />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue & Bookings Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Line data={analyticsData} options={analyticsOptions} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Top Performing Venues</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {venues.slice(0, 5).map((venue, index) => (
                            <div key={venue.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                              <img
                                src={venue.images[0] || 'https://via.placeholder.com/48x48'}
                                alt={venue.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{venue.name}</p>
                                <p className="text-sm text-gray-600">{venue.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{venue.price.toLocaleString()}</p>
                                <p className="text-sm text-green-600">Rating: {venue.rating.toFixed(1)}</p>
                              </div>
                            </div>
                          ))}
                          {venues.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No venues to display</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
