interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isVenueOwner: boolean;
  createdAt: Date;
}

export const mockUsers: User[] = [
  // Regular Users
  {
    id: "user1",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "priya123",
    isVenueOwner: false,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "user2",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    password: "rahul123",
    isVenueOwner: false,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "user3",
    name: "Anjali Patel",
    email: "anjali@example.com",
    password: "anjali123",
    isVenueOwner: false,
    createdAt: new Date("2024-02-01")
  },

  // Venue Owners
  {
    id: "owner1",
    name: "Rajesh Malhotra",
    email: "rajesh.venue@example.com",
    password: "rajesh123",
    isVenueOwner: true,
    createdAt: new Date("2023-12-01")
  },
  {
    id: "owner2",
    name: "Meera Kapoor",
    email: "meera.venue@example.com",
    password: "meera123",
    isVenueOwner: true,
    createdAt: new Date("2023-12-15")
  },
  {
    id: "owner3",
    name: "Arjun Singh",
    email: "arjun.venue@example.com",
    password: "arjun123",
    isVenueOwner: true,
    createdAt: new Date("2024-01-01")
  }
];

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const validateCredentials = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    // Don't return password in response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
};
