# Super Events -  Venue Booking Platform

Super Events is a comprehensive venue booking platform designed to streamline the process of finding and booking venues for a wide array_of_events across India. Whether you're an event planner organizing a large-scale corporate conference, a couple looking for the perfect wedding backdrop, or an individual hosting a private celebration, Super Events offers a curated selection of venues to meet diverse needs. Our platform aims to simplify venue discovery, enhance booking transparency, and provide users with all the necessary information to make informed decisions for their important occasions.

## Features

- **Venue Discovery**: Browse through a curated selection of venues with detailed information and high-quality images
- **Smart Search**: Filter venues by location, capacity, event type, and amenities
- **Real-time Availability**: Check venue availability and make instant bookings
- **User Authentication**: Secure login system with email/password and guest access options
- **Responsive Design**: Seamless experience across all devices
- **Interactive UI**: Modern, user-friendly interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **UI Components**: Radix UI, Lucide React (for icons)
- **State Management**: React Context, Tanstack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form, Zod
- **Backend & Authentication**: Firebase (Firebase Auth, Firestore, etc.)
- **Build Tool**: Vite
- **Additional Libraries**: Chart.js (for charts), Framer Motion (for animations), Date-fns (for date utility)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd Super Events
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
public/            # Static assets (favicon, images)
src/
├── App.css        # Global styles for App component
├── App.tsx        # Main application component
├── components/    # Reusable UI components
│   ├── ui/        # Shadcn/ui components
│   └── ...        # Custom application components (e.g., Navbar, Footer)
├── contexts/      # React Context providers (e.g., AuthContext)
├── hooks/         # Custom React hooks (e.g., useBooking, useAnalytics)
├── lib/           # Utility functions and Firebase configuration (e.g., utils.ts, firebase.ts)
├── main.tsx       # Entry point of the React application
├── pages/         # Page components for different routes (e.g., Home, Venues, Auth)
├── services/      # Services for external interactions (e.g., venueService, mockUsers)
├── index.css      # Global stylesheets
└── vite-env.d.ts  # TypeScript definitions for Vite
...                # Other configuration files (tailwind.config.ts, vite.config.ts, etc.)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

To deploy this application, you first need to build it for production:

```bash
npm run build
```
This command creates a `dist` folder in the project root, which contains the optimized static assets for your application.

You can deploy this `dist` folder to any static site hosting service. Some popular choices include:

- **Firebase Hosting**: Given the project uses Firebase, Firebase Hosting is a natural fit. You can deploy your site using the Firebase CLI.
  - [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- **Vercel**: Vercel offers seamless deployment for frontend projects with great support for Vite.
  - [Deploy Vite to Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
- **Netlify**: Netlify is another excellent platform for deploying static sites and Vite applications.
  - [Deploy Vite to Netlify](https://docs.netlify.com/integrations/frameworks/vite/)

Choose the provider that best suits your needs. Ensure your environment variables (especially Firebase configuration) are set up correctly in the deployment environment.

## Environment Variables

Create a `.env` file in the root directory with the following variables. These are required for Firebase integration, allowing the application to connect to your Firebase project for services like Authentication, Firestore, and Storage.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id # Optional: For Firebase Analytics
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Vite](https://vitejs.dev/) for the blazing fast build tool
