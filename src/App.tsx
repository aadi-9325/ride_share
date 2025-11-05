import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { RideBooking } from './pages/RideBooking'
import { UserMatching } from './pages/UserMatching'
import { RideCoordination } from './pages/RideCoordination'
import { PaymentPage } from './pages/PaymentPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book" 
              element={
                <ProtectedRoute>
                  <RideBooking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/matching" 
              element={
                <ProtectedRoute>
                  <UserMatching />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/:rideId" 
              element={
                <ProtectedRoute>
                  <RideCoordination />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/:rideId" 
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FFFFFF',
                color: '#171717',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
