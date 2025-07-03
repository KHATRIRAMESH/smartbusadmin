# SmartBus Admin Panel

Independent Next.js admin panel for the SmartBus school bus management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- API server running and accessible
- Environment variables configured

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📋 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Server Configuration
NEXT_PUBLIC_API_URL=https://your-api-server.com
NEXT_PUBLIC_SOCKET_URL=wss://your-api-server.com

# Authentication
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_here

# Google Maps API (for admin panel maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Environment
NODE_ENV=production
```

## 🏗️ Project Structure

```
smartbusadmin/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Super admin dashboard
│   ├── school-admin/      # School admin dashboard
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix UI)
│   ├── auth-screen.tsx   # Authentication screen
│   └── ...
├── lib/                  # Utilities and helpers
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 UI Components

Built with:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Zustand** - Lightweight state management

## 🔧 Development

### Code Quality
```bash
npm run lint
npm run lint:fix
```

### Build Analysis
```bash
npm run analyze
```

### Static Export
```bash
npm run export
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

### Docker
```bash
docker build -t smartbus-admin .
docker run -p 3000:3000 smartbus-admin
```

### Manual Server
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Configure reverse proxy (Nginx/Apache)

## 🔒 Security

- Environment-based configuration
- JWT token management
- CORS protection
- Input validation
- HTTPS only in production

## 📱 Features

### Super Admin Dashboard
- School management
- Administrator management
- System statistics
- Real-time monitoring

### School Admin Dashboard
- Bus management
- Route management
- Student management
- Real-time tracking

## 🔗 API Integration

The admin panel communicates with the SmartBus API server:

- **Authentication**: JWT-based auth
- **Real-time**: WebSocket connections
- **REST API**: CRUD operations
- **Error Handling**: Comprehensive error states

## 🎯 Performance

- **Next.js 15** with App Router
- **React 19** with concurrent features
- **TypeScript** for type safety
- **Optimized builds** with tree shaking
- **Image optimization** with Next.js Image

## 🧪 Testing

```bash
# Add testing framework of your choice
npm install --save-dev jest @testing-library/react
```

## 📊 Analytics

Recommended integrations:
- **Google Analytics** - User behavior
- **Sentry** - Error tracking
- **Vercel Analytics** - Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## 📄 License

MIT License
