# RideShare Platform Documentation

## Overview

RideShare is a comprehensive ride-sharing platform that allows users to share rides and split costs, built with modern web and mobile technologies.

## 🚗 Features

- **Smart Ride Matching**: Find compatible riders heading the same direction
- **Cost Sharing**: Split ride costs among multiple passengers
- **Real-time Tracking**: Live ride coordination and tracking
- **Safety Features**: Emergency contacts and verification system
- **Payment Integration**: Secure payment processing with multiple methods
- **Cross-platform**: Web application and mobile app support

## 🏗️ Architecture

### Web Application
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Maps**: Google Maps API integration
- **State Management**: React Context + Hooks

### Mobile Application
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Backend**: Same Supabase backend as web app

## 🚀 Getting Started

### Web Application

```bash
cd web-app
npm install
npm run dev
```

### Mobile Application

```bash
cd mobile-app
npm install
npm start
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **user_profiles**: User information and verification
- **rides**: Ride details and status
- **ride_participants**: Users participating in rides
- **payment_transactions**: Payment records
- **chat_messages**: Ride coordination messages
- **emergency_contacts**: Safety contacts

## 🔒 Environment Variables

### Web Application
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Mobile Application
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 📱 Supported Platforms

- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: iOS and Android via React Native

## 🛡️ Security Features

- User verification system
- Emergency contact management
- Real-time ride tracking
- Secure payment processing
- Data encryption and protection

## 🗂️ Project Structure

```
rideshare-platform/
├── web-app/              # React web application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and configurations
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
├── mobile-app/          # React Native mobile app
│   ├── src/
│   │   ├── screens/     # Mobile app screens
│   │   ├── components/  # Reusable mobile components
│   │   └── navigation/  # Navigation configuration
│   └── assets/          # App icons and media
├── supabase/            # Database schema and functions
└── docs/               # Additional documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.