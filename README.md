# SmartBus Admin Dashboard

A Next.js web application for managing the SmartBus school bus tracking system.

## Features

- Real-time bus tracking dashboard
- School management
- Route planning and optimization
- Driver management
- Parent and student management
- Analytics and reporting
- Role-based access control
- Dark mode support

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zustand for state management
- Socket.IO for real-time updates
- React Query for data fetching
- React Hook Form for forms
- Zod for validation
- Recharts for analytics

## Project Structure

```
smartbusadmin/
├── app/                # Next.js app router pages
├── components/         # React components
├── lib/               # Utility functions and configs
├── store/             # Global state management
├── types/             # TypeScript definitions
└── public/            # Static assets
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.smartbus.com
NEXT_PUBLIC_SOCKET_URL=wss://api.smartbus.com

# Authentication
NEXT_PUBLIC_AUTH_URL=https://auth.smartbus.com
NEXTAUTH_SECRET=your_nextauth_secret

# Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check` - Run TypeScript checks

## Features in Detail

### Dashboard
- Real-time bus tracking map
- Active buses overview
- Recent alerts and notifications
- Key metrics and statistics
- Quick actions menu

### School Management
- School registration
- Campus management
- Staff administration
- Resource allocation
- Schedule management

### Route Management
- Route creation and editing
- Stop management
- Route optimization
- Schedule planning
- Distance and time calculations

### Driver Management
- Driver profiles
- License management
- Schedule assignment
- Performance tracking
- Document storage

### Student Management
- Student registration
- Bus assignment
- Attendance tracking
- Parent communication
- Route assignment

### Analytics
- Usage statistics
- Route efficiency
- Driver performance
- Attendance reports
- Custom report generation

## Folder Structure Details

### `/app`
- Page components
- API routes
- Layouts
- Error boundaries

### `/components`
- UI components
- Forms
- Tables
- Charts
- Maps

### `/lib`
- API client
- Authentication
- Validation
- Utils
- Constants

### `/store`
- Global state
- Context providers
- Reducers
- Actions

### `/types`
- TypeScript interfaces
- Type definitions
- API types
- Enums

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Building for Production

1. Update environment variables for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t smartbus-admin .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 smartbus-admin
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
