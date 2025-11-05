import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, MapPin, Clock, DollarSign, Users, TrendingUp, Calendar, Star } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [recentRides, setRecentRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setProfile(profileData)

      // Load recent rides
      const { data: ridesData } = await supabase
        .from('rides')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentRides(ridesData || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Hello, {profile?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-neutral-600">Ready to share a ride and save money?</p>
            </div>
            <Link 
              to="/book"
              className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-lg transition-colors"
            >
              <PlusCircle size={24} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-semantic-success/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-semantic-success" size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Saved</p>
                <p className="text-xl font-bold text-neutral-900">₹{profile?.total_savings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Users className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Shared Rides</p>
                <p className="text-xl font-bold text-neutral-900">{profile?.total_shared_rides || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-semantic-warning/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-semantic-warning" size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Safety Rating</p>
                <p className="text-xl font-bold text-neutral-900">{profile?.safety_rating || 5.0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-semantic-info/20 rounded-lg flex items-center justify-center">
                <Calendar className="text-semantic-info" size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Rides</p>
                <p className="text-xl font-bold text-neutral-900">{profile?.total_rides || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link 
              to="/book"
              className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <PlusCircle className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Book New Ride</p>
                <p className="text-sm text-neutral-600">Find and share a ride</p>
              </div>
            </Link>

            <Link 
              to="/profile"
              className="flex items-center space-x-3 p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-neutral-500 rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Safety Profile</p>
                <p className="text-sm text-neutral-600">Update verification</p>
              </div>
            </Link>

            <Link 
              to="/history"
              className="flex items-center space-x-3 p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-neutral-500 rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Ride History</p>
                <p className="text-sm text-neutral-600">View past trips</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Rides</h2>
            <Link to="/history" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentRides.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto text-neutral-400 mb-4" size={48} />
              <p className="text-neutral-600 mb-4">No rides yet</p>
              <Link 
                to="/book"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Book Your First Ride
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                      <span className="text-sm font-medium text-neutral-900">
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-1">
                      {ride.pickup_location.address} → {ride.dropoff_location.address}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(ride.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">₹{ride.estimated_fare}</p>
                    <Link 
                      to={`/ride/${ride.id}`}
                      className="text-primary-500 hover:text-primary-600 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Savings This Month */}
        <div className="bg-gradient-to-r from-semantic-success to-primary-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Great Savings This Month!</h3>
              <p className="text-primary-100">
                You've saved ₹{(profile?.total_savings || 0) * 0.3} so far. Keep it up!
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{(profile?.total_savings || 0) * 0.3}</p>
              <p className="text-primary-100 text-sm">This month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
