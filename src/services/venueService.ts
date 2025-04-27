import { toast } from "@/hooks/use-toast";

export interface VenueFormData {
  name: string;
  location: string;
  price: string;
  description: string;
  capacity: string;
  amenities: string[];
  availability: string[];
  images: string[];
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  capacity: string;
  featured: boolean;
  rating: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  images: string[];
  amenities: string[];
  availability: string[];
}

// Mock venues data
const mockVenues: Venue[] = [
  {
    id: "v1",
    name: "Taj Palace Banquet Hall",
    location: "New Delhi, India",
    description: "A luxurious banquet hall featuring crystal chandeliers, marble floors, and state-of-the-art amenities. Perfect for grand weddings and corporate events.",
    price: 75000,
    capacity: "100-500",
    featured: true,
    rating: 4.9,
    owner_id: "owner1",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Valet Parking", "Catering", "DJ System", "Air Conditioning", "WiFi"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v2",
    name: "Marine Drive Convention Center",
    location: "Mumbai, Maharashtra",
    description: "A modern convention center with panoramic sea views, perfect for conferences, exhibitions, and large-scale events.",
    price: 65000,
    capacity: "200-1000",
    featured: true,
    rating: 4.7,
    owner_id: "owner1",
    created_at: "2024-01-02",
    updated_at: "2024-01-02",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Conference Facilities", "AV Equipment", "Catering", "Parking", "Security"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "v3",
    name: "Royal Rajputana Heritage",
    location: "Jaipur, Rajasthan",
    description: "An authentic heritage property with traditional Rajasthani architecture, perfect for destination weddings and cultural events.",
    price: 82000,
    capacity: "150-400",
    featured: true,
    rating: 4.8,
    owner_id: "owner2",
    created_at: "2024-01-03",
    updated_at: "2024-01-03",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
    ],
    amenities: ["Heritage Tours", "Traditional Decor", "Catering", "Accommodation", "Pool"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v4",
    name: "Mysore Palace Gardens",
    location: "Mysore, Karnataka",
    description: "A royal garden venue with the backdrop of illuminated Mysore Palace, ideal for grand celebrations and cultural events.",
    price: 120000,
    capacity: "300-800",
    featured: true,
    rating: 4.9,
    owner_id: "owner2",
    created_at: "2024-01-04",
    updated_at: "2024-01-04",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Garden Lighting", "Royal Decor", "Catering", "Valet Parking", "Security"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v5",
    name: "Kerala Backwaters Resort",
    location: "Kochi, Kerala",
    description: "A serene waterfront venue with traditional Kerala architecture, perfect for intimate weddings and corporate retreats.",
    price: 95000,
    capacity: "50-200",
    featured: false,
    rating: 4.6,
    owner_id: "owner3",
    created_at: "2024-01-05",
    updated_at: "2024-01-05",
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Boat Tours", "Spa", "Accommodation", "Restaurant", "WiFi"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v6",
    name: "Bangalore Tech Hub",
    location: "Bangalore, Karnataka",
    description: "Ultra-modern event space in the heart of India's Silicon Valley, equipped with cutting-edge technology for corporate events.",
    price: 55000,
    capacity: "100-300",
    featured: false,
    rating: 4.5,
    owner_id: "owner1",
    created_at: "2024-01-06",
    updated_at: "2024-01-06",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop"
    ],
    amenities: ["High-speed Internet", "Video Conferencing", "Catering", "Parking", "Tech Support"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "v7",
    name: "Goa Beach Resort",
    location: "North Goa, Goa",
    description: "Beachfront venue with stunning sunset views, perfect for destination weddings and beach parties.",
    price: 88000,
    capacity: "100-400",
    featured: true,
    rating: 4.7,
    owner_id: "owner2",
    created_at: "2024-01-07",
    updated_at: "2024-01-07",
    images: [
      "https://images.unsplash.com/photo-1578530332818-6ba472e67b9f?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2074&auto=format&fit=crop"
    ],
    amenities: ["Beach Access", "Pool", "Bar Service", "Accommodation", "Water Sports"],
    availability: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v8",
    name: "Himalayan Retreat",
    location: "Manali, Himachal Pradesh",
    description: "Mountain resort venue with breathtaking views, ideal for destination weddings and corporate retreats.",
    price: 72000,
    capacity: "80-250",
    featured: false,
    rating: 4.6,
    owner_id: "owner3",
    created_at: "2024-01-08",
    updated_at: "2024-01-08",
    images: [
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Mountain Views", "Bonfire", "Accommodation", "Adventure Activities", "Spa"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v9",
    name: "Udaipur Lake Palace",
    location: "Udaipur, Rajasthan",
    description: "Luxury heritage venue on Lake Pichola, offering royal Rajasthani experience for weddings and events.",
    price: 150000,
    capacity: "200-600",
    featured: true,
    rating: 4.9,
    owner_id: "owner1",
    created_at: "2024-01-09",
    updated_at: "2024-01-09",
    images: [
      "https://images.unsplash.com/photo-1573731321031-d8f9c95dd2d5?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601961405399-801fb1f34581?q=80&w=2072&auto=format&fit=crop"
    ],
    amenities: ["Boat Transfer", "Royal Butler", "Luxury Suites", "Traditional Entertainment", "Spa"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v10",
    name: "Chennai Convention Complex",
    location: "Chennai, Tamil Nadu",
    description: "Modern convention center with multiple halls and outdoor spaces for large-scale events.",
    price: 68000,
    capacity: "300-1200",
    featured: false,
    rating: 4.5,
    owner_id: "owner2",
    created_at: "2024-01-10",
    updated_at: "2024-01-10",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Multiple Halls", "Exhibition Space", "Catering", "Parking", "Technical Support"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "v11",
    name: "Kolkata Heritage Manor",
    location: "Kolkata, West Bengal",
    description: "Colonial-era mansion with vintage charm, perfect for elegant soirées and cultural events.",
    price: 58000,
    capacity: "100-300",
    featured: false,
    rating: 4.6,
    owner_id: "owner3",
    created_at: "2024-01-11",
    updated_at: "2024-01-11",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Period Furniture", "Garden", "Catering", "Valet Parking", "Cultural Programs"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v12",
    name: "Hyderabad Pearl Palace",
    location: "Hyderabad, Telangana",
    description: "Opulent venue with Nizami architecture, ideal for grand weddings and royal celebrations.",
    price: 92000,
    capacity: "250-800",
    featured: true,
    rating: 4.8,
    owner_id: "owner1",
    created_at: "2024-01-12",
    updated_at: "2024-01-12",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Royal Decor", "Multiple Halls", "Catering", "Valet Parking", "Traditional Welcome"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v13",
    name: "Pune Eco Retreat",
    location: "Pune, Maharashtra",
    description: "Sustainable event space surrounded by nature, perfect for eco-friendly celebrations.",
    price: 45000,
    capacity: "50-200",
    featured: false,
    rating: 4.5,
    owner_id: "owner2",
    created_at: "2024-01-13",
    updated_at: "2024-01-13",
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    ],
    amenities: ["Solar Power", "Organic Catering", "Nature Trails", "Recycling", "Workshop Space"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v14",
    name: "Amritsar Golden Plaza",
    location: "Amritsar, Punjab",
    description: "Contemporary venue with traditional Punjab hospitality, ideal for weddings and celebrations.",
    price: 65000,
    capacity: "200-600",
    featured: false,
    rating: 4.7,
    owner_id: "owner3",
    created_at: "2024-01-14",
    updated_at: "2024-01-14",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Traditional Decor", "Punjabi Cuisine", "Dance Floor", "Valet Parking", "DJ System"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v15",
    name: "Ahmedabad Heritage Haveli",
    location: "Ahmedabad, Gujarat",
    description: "Restored haveli with intricate architecture, perfect for traditional Gujarati celebrations.",
    price: 78000,
    capacity: "150-400",
    featured: true,
    rating: 4.8,
    owner_id: "owner1",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Traditional Architecture", "Courtyard", "Gujarati Cuisine", "Cultural Programs", "Accommodation"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"]
  },
  {
    id: "v16",
    name: "Lucknow Nawabi Palace",
    location: "Lucknow, Uttar Pradesh",
    description: "Historic venue with Nawabi charm, ideal for royal weddings and cultural events.",
    price: 85000,
    capacity: "200-500",
    featured: false,
    rating: 4.7,
    owner_id: "owner2",
    created_at: "2024-01-16",
    updated_at: "2024-01-16",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Mughlai Cuisine", "Royal Decor", "Traditional Music", "Valet Parking", "Heritage Tours"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v17",
    name: "Indore Celebration Hub",
    location: "Indore, Madhya Pradesh",
    description: "Modern banquet facility with multiple halls and outdoor spaces for diverse events.",
    price: 52000,
    capacity: "100-400",
    featured: false,
    rating: 4.5,
    owner_id: "owner3",
    created_at: "2024-01-17",
    updated_at: "2024-01-17",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Multiple Halls", "Outdoor Space", "Catering", "Parking", "DJ System"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v18",
    name: "Bhubaneswar Temple View",
    location: "Bhubaneswar, Odisha",
    description: "Unique venue with temple architecture backdrop, perfect for traditional celebrations.",
    price: 48000,
    capacity: "100-300",
    featured: false,
    rating: 4.6,
    owner_id: "owner1",
    created_at: "2024-01-18",
    updated_at: "2024-01-18",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Temple View", "Traditional Decor", "Odia Cuisine", "Cultural Programs", "Parking"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v19",
    name: "Chandigarh Modern Center",
    location: "Chandigarh, Punjab",
    description: "Contemporary event space with clean architecture and modern amenities.",
    price: 62000,
    capacity: "150-500",
    featured: false,
    rating: 4.6,
    owner_id: "owner2",
    created_at: "2024-01-19",
    updated_at: "2024-01-19",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Modern Design", "AV Equipment", "Catering", "Parking", "Business Center"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "v20",
    name: "Srinagar Lake Resort",
    location: "Srinagar, Kashmir",
    description: "Scenic lakeside venue with mountain views, perfect for intimate celebrations.",
    price: 95000,
    capacity: "50-200",
    featured: true,
    rating: 4.8,
    owner_id: "owner3",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Lake View", "Kashmiri Cuisine", "Boat Rides", "Accommodation", "Heating"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v21",
    name: "Nagpur Orange County",
    location: "Nagpur, Maharashtra",
    description: "Sprawling venue surrounded by orange orchards, ideal for outdoor events.",
    price: 42000,
    capacity: "100-300",
    featured: false,
    rating: 4.5,
    owner_id: "owner1",
    created_at: "2024-01-21",
    updated_at: "2024-01-21",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Orchard View", "Outdoor Space", "Local Cuisine", "Parking", "Farm Tours"],
    availability: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "v22",
    name: "Coimbatore Green Meadows",
    location: "Coimbatore, Tamil Nadu",
    description: "Eco-friendly venue with lush gardens and sustainable practices.",
    price: 55000,
    capacity: "100-400",
    featured: false,
    rating: 4.6,
    owner_id: "owner2",
    created_at: "2024-01-22",
    updated_at: "2024-01-22",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Garden Space", "Organic Catering", "Solar Power", "Parking", "Nature Walks"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v23",
    name: "Varanasi Ganga View",
    location: "Varanasi, Uttar Pradesh",
    description: "Spiritual venue overlooking the Ganges, perfect for traditional ceremonies.",
    price: 68000,
    capacity: "100-300",
    featured: true,
    rating: 4.7,
    owner_id: "owner3",
    created_at: "2024-01-23",
    updated_at: "2024-01-23",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["River View", "Traditional Decor", "Spiritual Ceremonies", "Boat Access", "Cultural Programs"],
    availability: ["Monday", "Wednesday", "Thursday", "Friday", "Sunday"]
  },
  {
    id: "v24",
    name: "Raipur Heritage Hall",
    location: "Raipur, Chhattisgarh",
    description: "Restored heritage property with modern amenities for all types of events.",
    price: 45000,
    capacity: "100-350",
    featured: false,
    rating: 4.5,
    owner_id: "owner1",
    created_at: "2024-01-24",
    updated_at: "2024-01-24",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: ["Heritage Architecture", "Modern Facilities", "Local Cuisine", "Parking", "Cultural Shows"],
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "v25",
    name: "Vizag Beach Resort",
    location: "Visakhapatnam, Andhra Pradesh",
    description: "Beachfront venue with modern amenities and stunning sea views.",
    price: 72000,
    capacity: "150-450",
    featured: false,
    rating: 4.6,
    owner_id: "owner2",
    created_at: "2024-01-25",
    updated_at: "2024-01-25",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2073&auto=format&fit=crop"
    ],
    amenities: ["Beach Access", "Sea View", "Seafood Cuisine", "Pool", "Water Sports"],
    availability: ["Monday", "Tuesday", "Friday", "Saturday", "Sunday"]
  }
];

type VenueSubscriber = (venues: Venue[]) => void;
const subscribers = new Set<VenueSubscriber>();

export const subscribeToVenues = (subscriber: VenueSubscriber) => {
  subscribers.add(subscriber);

  // Set up real-time subscription
  const subscription = supabase
    .channel('venues_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'venues'
      },
      async () => {
        // Fetch updated venues when changes occur
        const venues = await getAllVenues();
        subscribers.forEach(sub => sub(venues));
      }
    )
    .subscribe();

  return () => {
    subscribers.delete(subscriber);
    subscription.unsubscribe();
  };
};

// Modified to return mock data for development
export const getAllVenues = async (): Promise<Venue[]> => {
  return mockVenues;
};

export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  return mockVenues.filter(venue => venue.owner_id === ownerId);
};

export const getVenueById = async (id: string): Promise<Venue> => {
  const venue = mockVenues.find(v => v.id === id);
  if (!venue) throw new Error("Venue not found");
  return venue;
};

export const addVenue = async (formData: VenueFormData, ownerId: string): Promise<Venue> => {
  const newVenue: Venue = {
    id: `v${mockVenues.length + 1}`,
    name: formData.name,
    location: formData.location,
    description: formData.description,
    price: parseInt(formData.price),
    capacity: formData.capacity,
    featured: false,
    rating: 0,
    owner_id: ownerId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: formData.images,
    amenities: formData.amenities,
    availability: formData.availability,
  };

  mockVenues.push(newVenue);
  return newVenue;
};

export const updateVenue = async (
  venueId: string,
  ownerId: string,
  updates: Partial<VenueFormData>
): Promise<Venue> => {
  const index = mockVenues.findIndex(v => v.id === venueId && v.owner_id === ownerId);
  if (index === -1) throw new Error("Venue not found");

  mockVenues[index] = {
    ...mockVenues[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  return mockVenues[index];
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  const index = mockVenues.findIndex(v => v.id === venueId && v.owner_id === ownerId);
  if (index === -1) throw new Error("Venue not found");
  mockVenues.splice(index, 1);
};
