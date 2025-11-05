import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { GoogleMapSimple } from '../components/GoogleMapSimple'
import { MapPin, Star, Shield, Clock, Users, CheckCircle, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'



export function UserMatching() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rideId = searchParams.get('rideId')
  
  const [matches, setMatches] = useState<any[]>([])
  const [currentRide, setCurrentRide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (rideId) {
      loadRideAndMatches()
    }
  }, [rideId])

  const loadRideAndMatches = async () => {
    if (!rideId || !user) return

    try {
      // Load current ride
      const { data: rideData } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .eq('owner_user_id', user.id)
        .single()

      if (rideData) {
        setCurrentRide(rideData)

        // Get matching users
        const { data, error } = await supabase.functions.invoke('user-matching', {
          body: {
            userLocation: rideData.pickup_location,
            destination: rideData.dropoff_location,
            maxDetour: 3,
            currentUserId: user.id
          }
        })

        if (error) throw error
        
        setMatches(data.data.matches || [])
      }
    } catch (error) {
      console.error('Error loading ride and matches:', error)
      toast.error('Failed to load ride details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRide = async (matchUserId: string) => {
    setJoining(true)
    try {
      // Add user as participant
      const { error } = await supabase
        .from('ride_participants')
        .insert({
          ride_id: rideId!,
          user_id: matchUserId,
          is_owner: false,
          cost_share: currentRide.estimated_fare,
          payment_status: 'pending',
          confirmed_at: new Date().toISOString()
        })

      if (error) throw error

      // Update ride status
      const { error: updateError } = await supabase
        .from('rides')
        .update({
          status: 'matched',
          updated_at: new Date().toISOString()
        })
        .eq('id', rideId!)

      if (updateError) throw updateError

      toast.success('Successfully joined the ride!')
      navigate(`/ride/${rideId}`)
    } catch (error) {
      console.error('Error joining ride:', error)
      toast.error('Failed to join ride')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!currentRide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Ride not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Finding Ride Partners</h1>
              <p className="text-neutral-600">
                {matches.length} potential matches found
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-600">Estimated fare</p>
              <p className="text-xl font-bold text-primary-500">₹{currentRide.estimated_fare}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Route Map */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Route Overview</h3>
          </div>
          {currentRide ? (
            <GoogleMapSimple
              center={{
                lat: (currentRide.pickup_location.lat + currentRide.dropoff_location.lat) / 2,
                lng: (currentRide.pickup_location.lng + currentRide.dropoff_location.lng) / 2
              }}
              markers={[
                { position: currentRide.pickup_location, title: 'Pickup', type: 'pickup' },
                { position: currentRide.dropoff_location, title: 'Destination', type: 'destination' },
                ...matches.map((match, index) => ({
                  position: match.pickup_location,
                  title: `Match ${index + 1}`,
                  type: 'match' as const
                }))
              ]}
              style={{ height: '400px' }}
            />
          ) : (
            <div className="h-96 flex items-center justify-center bg-neutral-50">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Route Info */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-semantic-success rounded-full"></div>
              <span className="text-sm text-neutral-600">Pickup</span>
            </div>
            <div className="flex-1 border-t border-dashed border-neutral-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-semantic-error rounded-full"></div>
              <span className="text-sm text-neutral-600">Destination</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-semantic-success" />
              <span className="text-sm text-neutral-700">{currentRide.pickup_location.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-semantic-error" />
              <span className="text-sm text-neutral-700">{currentRide.dropoff_location.address}</span>
            </div>
          </div>
        </div>

        {/* Potential Matches */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Potential Ride Partners ({matches.length})
          </h3>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center">
              <Users className="mx-auto text-neutral-400 mb-4" size={48} />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">No matches found yet</h4>
              <p className="text-neutral-600 mb-4">
                We're still searching for riders going your way. This usually takes 2-5 minutes.
              </p>
              <button
                onClick={loadRideAndMatches}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Refresh Search
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((match, index) => (
                <div
                  key={match.user_id}
                  className={`bg-white rounded-xl p-6 border transition-all cursor-pointer ${
                    selectedMatch === match.user_id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedMatch(match.user_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {match.profile_image_url ? (
                          <img
                            src={match.profile_image_url}
                            alt={match.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-500 font-semibold">
                              {match.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {match.verification_status === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-semantic-success rounded-full flex items-center justify-center">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-neutral-900">{match.full_name}</h4>
                          {match.verification_status === 'verified' && (
                            <div className="flex items-center space-x-1 bg-semantic-success/20 text-semantic-success px-2 py-1 rounded-full">
                              <Shield size={12} />
                              <span className="text-xs font-medium">Verified</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{match.safety_rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>Pickup in {Math.floor(match.estimated_pickup_time ? (new Date(match.estimated_pickup_time).getTime() - Date.now()) / 60000 : 5)} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{match.detour_km}km detour</span>
                          </div>
                        </div>

                        <div className="text-sm text-neutral-700">
                          <p className="mb-1">
                            <span className="font-medium">From:</span> {match.pickup_location.address}
                          </p>
                          <p>
                            <span className="font-medium">To:</span> {match.dropoff_location.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary-500 mb-2">
                        {Math.round(match.compatibility_score * 100)}% match
                      </div>
                      <div className="text-sm text-neutral-600">
                        ₹{Math.floor(currentRide.estimated_fare * 0.8)} each
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span>Detour: {match.detour_km}km</span>
                        <span>Compatibility: {Math.round(match.compatibility_score * 100)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                          View Profile
                        </button>
                        <button className="bg-semantic-success hover:bg-semantic-success/90 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {matches.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => selectedMatch && handleJoinRide(selectedMatch)}
              disabled={!selectedMatch || joining}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {joining ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Users size={20} />
                  <span>Join Selected Ride Partner</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate(`/ride/${rideId}`)}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 py-3 rounded-lg font-medium transition-colors"
            >
              Continue to Ride Coordination
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
