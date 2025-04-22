# GatherHaven - Indian Venue Booking Platform

GatherHaven is a modern web application that connects event planners with exceptional venues across India. From traditional weddings to corporate events, find the perfect space for any occasion.

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
- **State Management**: React Context
- **Routing**: React Router v6
- **Form Handling**: React Hook Form, Zod
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Authentication**: Custom auth system (ready for Supabase integration)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd gatherhaven
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
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Page components
├── services/      # API services
└── styles/        # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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
