# RideShare Mobile App

A React Native mobile application for ride sharing and cost splitting, built with Expo and TypeScript.

## 📱 Features

- **User Authentication**: Secure login/signup with Supabase
- **Ride Booking**: Find and book shared rides
- **Real-time Tracking**: Live ride coordination and tracking
- **Cost Calculator**: Automatic cost splitting among passengers
- **Profile Management**: Complete user profile with verification
- **Safety Features**: Emergency contacts and real-time sharing
- **Push Notifications**: Ride updates and matching alerts
- **Biometric Authentication**: Secure app access with Face ID/Touch ID

## 🏗️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Tabs)
- **Backend**: Supabase (Database, Auth, Storage)
- **Maps**: React Native Maps
- **State Management**: React Context + Hooks
- **Styling**: React Native StyleSheet

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your phone (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadi-9325/ride_share.git
   cd ride_share/mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR with Expo Go
   - **Android**: Press `a` in the terminal or scan QR with Expo Go
   - **Web**: Press `w` in the terminal

## 📋 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start on web browser
- `npm run build:android` - Build for Android (requires EAS CLI)
- `npm run build:ios` - Build for iOS (requires EAS CLI)

## 🗂️ Project Structure

```
mobile-app/
├── App.tsx                 # Main app component with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── assets/                # App icons, splash screens, etc.
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── screens/           # App screens
    │   ├── LandingScreen.tsx
    │   ├── AuthScreen.tsx
    │   ├── DashboardScreen.tsx
    │   ├── BookingScreen.tsx
    │   └── ProfileScreen.tsx
    ├── components/        # Reusable UI components
    ├── navigation/        # Navigation configuration
    ├── services/          # API and business logic
    ├── types/            # TypeScript type definitions
    └── utils/            # Utility functions
```

## 🔧 Configuration

### Expo Configuration (app.json)

The app uses Expo for cross-platform development with the following features:
- **Location Services**: For ride tracking and matching
- **Camera Access**: For profile photo capture
- **Push Notifications**: For ride updates
- **Biometric Authentication**: For secure access
- **Custom Icons**: App icons and splash screens

### Supabase Integration

The mobile app integrates with the same Supabase backend as the web application:
- **Authentication**: User login/signup
- **Database**: User profiles, rides, and transactions
- **Real-time**: Live ride tracking and chat
- **Storage**: Profile images and ride photos

## 📱 App Screens

### 1. Landing Screen
- Welcome screen with app introduction
- Quick feature highlights
- Call-to-action for registration

### 2. Authentication Screen
- Login/signup form
- Email and password authentication
- Social login options (future)

### 3. Dashboard Screen
- User greeting and quick stats
- Recent ride activity
- Total savings summary
- Quick action buttons

### 4. Booking Screen
- Pickup and destination input
- Date and time selection
- Quick location shortcuts
- Recent route history

### 5. Profile Screen
- User profile and verification status
- Ride statistics
- Account settings
- Support and help options

## 🔒 Security Features

- **Biometric Authentication**: Face ID / Touch ID
- **Secure Storage**: Expo SecureStore for sensitive data
- **Token Management**: Automatic token refresh
- **Data Encryption**: End-to-end encryption for sensitive data

## 🗺️ Location Services

- **Real-time Location**: GPS tracking for ride coordination
- **Geofencing**: Automatic pickup/dropoff detection
- **Location History**: Saved frequent locations
- **Privacy Controls**: Granular location permissions

## 🔔 Push Notifications

- **Ride Updates**: Status changes and driver info
- **Matching Alerts**: New ride matches
- **Payment Notifications**: Transaction confirmations
- **Safety Alerts**: Emergency contact notifications

## 🚀 Building for Production

### Android
```bash
npm install -g @expo/cli eas-cli
eas build --platform android
```

### iOS
```bash
npm install -g @expo/cli eas-cli
eas build --platform ios
```

### EAS Configuration

The app is configured for EAS Build in `app.json`:
- **Project ID**: `rideshare-mobile-project`
- **Build Profiles**: Development and production builds
- **Auto-submit**: Configured for app store deployment

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependency conflicts**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS simulator issues**
   ```bash
   npx expo install --fix
   ```

### Development Tips

- Use Expo Go for quick testing
- Enable remote debugging for inspection
- Use TypeScript strict mode for better type safety
- Test on both iOS and Android regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the main repository for details.

## 🙏 Acknowledgments

- Built with Expo and React Native
- UI components inspired by modern mobile design
- Backend powered by Supabase
- Maps integration with React Native Maps