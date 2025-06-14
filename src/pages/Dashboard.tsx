import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserVenuesEnhanced, deleteVenueEnhanced, isSuperEventsUser } from "@/services/enhancedVenueService";
import { exportVenuesAsJson, clearAllVenueData } from "@/services/jsonVenueService";
import { VenueStatusBadge } from "@/components/VenueStatusBadge";
import { Venue } from "@/services/venueService";
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
import { Eye, Calendar, Heart, TrendingUp, Plus, Edit, Trash2, MapPin, Users, Download, RefreshCw, FileText } from 'lucide-react';

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
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalVenues: 0,
    approvedVenues: 0,
    pendingVenues: 0,
    rejectedVenues: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

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
    loadUserVenues();
  }, [user, navigate]);

  const loadUserVenues = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userVenues = await getUserVenuesEnhanced(user.id, user.email);
      setVenues(userVenues);
      
      // Calculate statistics
      const stats = {
        totalVenues: userVenues.length,
        approvedVenues: userVenues.filter(v => v.status === 'approved').length,
        pendingVenues: userVenues.filter(v => v.status === 'pending').length,
        rejectedVenues: userVenues.filter(v => v.status === 'rejected').length,
        totalBookings: 0, // Mock data
        totalRevenue: userVenues.reduce((sum, venue) => sum + venue.price, 0)
      };
      setStatistics(stats);

      // Show special message for super events user
      if (isSuperEventsUser(user.email) && userVenues.length > 0) {
        toast({
          title: "Your Venues Loaded",
          description: `Found ${userVenues.length} venue(s) from your JSON storage.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading user venues:', error);
      toast({
        title: "Error Loading Venues",
        description: "Failed to load your venues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm("Are you sure you want to delete this venue? This action cannot be undone.")) return;

    try {
      await deleteVenueEnhanced(venueId, user?.id, user?.email);
      toast({
        title: "Venue Deleted",
        description: "The venue has been successfully deleted.",
      });
      loadUserVenues(); // Reload venues
    } catch (error) {
      toast({
        title: "Error Deleting Venue",
        description: "Failed to delete venue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportVenues = () => {
    if (isSuperEventsUser(user?.email)) {
      exportVenuesAsJson();
      toast({
        title: "Venues Exported",
        description: "Your venues have been exported to a JSON file.",
      });
    } else {
      toast({
        title: "Export Not Available",
        description: "JSON export is only available for Super Events users.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (!isSuperEventsUser(user?.email)) {
      toast({
        title: "Clear Data Not Available",
        description: "Data clearing is only available for Super Events users.",
        variant: "destructive",
      });
      return;
    }

    if (confirm("Are you sure you want to clear all venue data? This action cannot be undone.")) {
      clearAllVenueData();
      setVenues([]);
      setStatistics({
        totalVenues: 0,
        approvedVenues: 0,
        pendingVenues: 0,
        rejectedVenues: 0,
        totalBookings: 0,
        totalRevenue: 0
      });
      toast({
        title: "Data Cleared",
        description: "All venue data has been cleared from JSON storage.",
      });
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
                {isSuperEventsUser(user?.email) && (
                  <span className="block text-blue-600 text-sm mt-1">
                    🔒 Super Events User - Your venues are stored in JSON format
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              {isSuperEventsUser(user?.email) && (
                <>
                  <ButtonCustom
                    variant="outline"
                    onClick={handleExportVenues}
                    icon={<Download className="h-4 w-4" />}
                  >
                    Export JSON
                  </ButtonCustom>
                  <ButtonCustom
                    variant="outline"
                    onClick={loadUserVenues}
                    disabled={isLoading}
                    icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
                  >
                    Refresh
                  </ButtonCustom>
                </>
              )}
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
                <TabsTrigger value="analytics" className="flex-1 py-4">
                  Analytics
                </TabsTrigger>
                {isSuperEventsUser(user?.email) && (
                  <TabsTrigger value="settings" className="flex-1 py-4">
                    JSON Settings
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              <VenueStatusBadge status={venue.status || 'approved'} />
                            </div>
                          </div>
                        ))}
                        {venues.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No venues added yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ButtonCustom
                        variant="gold"
                        className="w-full"
                        onClick={() => navigate("/add-venue")}
                        icon={<Plus className="h-4 w-4" />}
                      >
                        Add New Venue
                      </ButtonCustom>
                      <ButtonCustom
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/venues")}
                      >
                        Browse All Venues
                      </ButtonCustom>
                      {isSuperEventsUser(user?.email) && (
                        <>
                          <ButtonCustom
                            variant="outline"
                            className="w-full"
                            onClick={handleExportVenues}
                            icon={<Download className="h-4 w-4" />}
                          >
                            Export Venues to JSON
                          </ButtonCustom>
                          <ButtonCustom
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={handleClearData}
                            icon={<Trash2 className="h-4 w-4" />}
                          >
                            Clear All Data
                          </ButtonCustom>
                        </>
                      )}
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
                            <VenueStatusBadge status={venue.status || 'approved'} />
                          </div>
                          {isSuperEventsUser(user?.email) && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                JSON
                              </span>
                            </div>
                          )}
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

              <TabsContent value="analytics" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {isSuperEventsUser(user?.email) && (
                <TabsContent value="settings" className="p-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Super Events JSON Storage Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">📁 JSON File Storage Mode</h4>
                          <p className="text-blue-800 text-sm mb-4">
                            Your venues are stored in JSON format within the project structure. This allows for persistent storage that's part of the codebase and supports image data as base64 encoded strings.
                          </p>
                          <div className="space-y-2">
                            <ButtonCustom
                              variant="outline"
                              onClick={handleExportVenues}
                              icon={<Download className="h-4 w-4" />}
                              className="w-full"
                            >
                              Export All Venues to JSON File
                            </ButtonCustom>
                            <ButtonCustom
                              variant="outline"
                              onClick={loadUserVenues}
                              disabled={isLoading}
                              icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
                              className="w-full"
                            >
                              Refresh Venue Data from JSON
                            </ButtonCustom>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">✨ Features</h4>
                          <ul className="text-green-800 text-sm space-y-1">
                            <li>• Images stored as base64 encoded data</li>
                            <li>• Data persists across sessions</li>
                            <li>• Part of project file structure</li>
                            <li>• No external database required</li>
                            <li>• Instant venue visibility</li>
                            <li>• Full venue data export capability</li>
                          </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="font-medium text-red-900 mb-2">⚠️ Danger Zone</h4>
                          <p className="text-red-800 text-sm mb-4">
                            This action will permanently delete all your venue data from JSON storage. This cannot be undone.
                          </p>
                          <ButtonCustom
                            variant="outline"
                            onClick={handleClearData}
                            icon={<Trash2 className="h-4 w-4" />}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Clear All Venue Data
                          </ButtonCustom>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
