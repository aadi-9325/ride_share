import React, { useState, useCallback, useRef } from 'react'
import { GoogleMapSimple } from '../components/GoogleMapSimple'
import { SimpleLocationInput } from '../components/SimpleLocationInput'
import { MapPin, Navigation, DollarSign, Users, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Navigation as AppNavigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'



export function RideBooking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pickupLocation, setPickupLocation] = useState('')
  const [destinationLocation, setDestinationLocation] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [vehicleType, setVehicleType] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [fareEstimate, setFareEstimate] = useState<any>(null)
  const [estimatedDistance, setEstimatedDistance] = useState(0)



  const calculateFare = async () => {
    if (!pickupCoords || !destinationCoords) {
      toast.error('Please select both pickup and destination locations')
      return
    }

    setLoading(true)
    try {
      // Calculate distance using Haversine formula (simplified)
      const R = 6371 // Earth's radius in km
      const dLat = (destinationCoords.lat - pickupCoords.lat) * Math.PI / 180
      const dLon = (destinationCoords.lng - pickupCoords.lng) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(destinationCoords.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distanceKm = R * c
      
      setEstimatedDistance(distanceKm)

      // Call our fare calculation edge function
      await calculateFareAPI(distanceKm)
    } catch (error) {
      console.error('Error calculating distance:', error)
      toast.error('Failed to calculate fare. Please try again.')
      setLoading(false)
    }
  }

  const calculateFareAPI = async (distance: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('fare-calculation', {
        body: {
          distance: distance,
          participants: 3, // Default to 3 for maximum savings
          vehicleType: vehicleType
        }
      })

      if (error) throw error

      setFareEstimate(data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error calculating fare:', error)
      toast.error('Failed to calculate fare')
      setLoading(false)
    }
  }

  const handleFindMatches = async () => {
    if (!pickupCoords || !destinationCoords) {
      toast.error('Please select both locations first')
      return
    }

    try {
      // Create a ride request
      const { data: ride, error } = await supabase
        .from('rides')
        .insert({
          owner_user_id: user!.id,
          status: 'searching',
          pickup_location: {
            lat: pickupCoords.lat,
            lng: pickupCoords.lng,
            address: pickupLocation
          },
          dropoff_location: {
            lat: destinationCoords.lat,
            lng: destinationCoords.lng,
            address: destinationLocation
          },
          estimated_fare: fareEstimate.costPerPerson,
          notes: `Vehicle: ${vehicleType}, Distance: ${estimatedDistance}km`
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Finding matches for your ride...')
      navigate(`/matching?rideId=${ride.id}`)
    } catch (error) {
      console.error('Error creating ride:', error)
      toast.error('Failed to create ride request')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <AppNavigation />
      
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Book a Ride</h1>
          <p className="text-neutral-600">Enter your pickup and destination to find ride partners</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Location Inputs */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Where are you going?</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pickup Location
              </label>
              <SimpleLocationInput
                value={pickupLocation}
                onChange={setPickupLocation}
                onCoordsChange={setPickupCoords}
                placeholder="Enter pickup location"
                iconColor="#10B981"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Destination
              </label>
              <SimpleLocationInput
                value={destinationLocation}
                onChange={setDestinationLocation}
                onCoordsChange={setDestinationCoords}
                placeholder="Enter destination"
                iconColor="#EF4444"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Type Selection */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Choose Vehicle Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'auto', name: 'Auto Rickshaw', icon: '🛺', price: '₹8/km' },
              { type: 'bike', name: 'Bike Taxi', icon: '🏍️', price: '₹5/km' },
              { type: 'car', name: 'Car', icon: '🚗', price: '₹12/km' },
            ].map((vehicle) => (
              <button
                key={vehicle.type}
                onClick={() => setVehicleType(vehicle.type)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  vehicleType === vehicle.type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-2xl mb-2">{vehicle.icon}</div>
                <div className="text-sm font-medium text-neutral-900">{vehicle.name}</div>
                <div className="text-xs text-neutral-600">{vehicle.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {pickupCoords && destinationCoords && (
            <GoogleMapSimple
              center={{
                lat: (pickupCoords.lat + destinationCoords.lat) / 2,
                lng: (pickupCoords.lng + destinationCoords.lng) / 2
              }}
              markers={[
                { position: pickupCoords, title: 'Pickup', type: 'pickup' },
                { position: destinationCoords, title: 'Destination', type: 'destination' }
              ]}
              style={{ height: '300px' }}
            />
          )}
          {!pickupCoords && !destinationCoords && (
            <div className="h-80 flex items-center justify-center bg-neutral-50">
              <div className="text-center text-neutral-500">
                <MapPin className="mx-auto mb-2" size={48} />
                <p>Select pickup and destination to see the route</p>
              </div>
            </div>
          )}
          {pickupCoords && !destinationCoords && (
            <GoogleMapSimple
              center={pickupCoords}
              markers={[{ position: pickupCoords, title: 'Pickup', type: 'pickup' }]}
              style={{ height: '300px' }}
            />
          )}
          {!pickupCoords && destinationCoords && (
            <GoogleMapSimple
              center={destinationCoords}
              markers={[{ position: destinationCoords, title: 'Destination', type: 'destination' }]}
              style={{ height: '300px' }}
            />
          )}
        </div>

        {/* Fare Estimate */}
        {pickupCoords && destinationCoords && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Fare Estimate</h3>
              <button
                onClick={calculateFare}
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <DollarSign size={18} />
                )}
                <span>{loading ? 'Calculating...' : 'Calculate Fare'}</span>
              </button>
            </div>

            {fareEstimate && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <DollarSign className="mx-auto text-primary-500 mb-2" size={24} />
                  <p className="text-sm text-neutral-600">Per Person</p>
                  <p className="text-2xl font-bold text-primary-500">₹{fareEstimate.costPerPerson}</p>
                </div>
                <div className="text-center p-4 bg-semantic-success/20 rounded-lg">
                  <Users className="mx-auto text-semantic-success mb-2" size={24} />
                  <p className="text-sm text-neutral-600">Savings</p>
                  <p className="text-2xl font-bold text-semantic-success">₹{fareEstimate.savingsPerPerson}</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg col-span-2">
                  <p className="text-sm text-neutral-600 mb-1">Compared to private ride</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    ₹{fareEstimate.soloFare} → ₹{fareEstimate.costPerPerson}
                  </p>
                  <p className="text-sm text-semantic-success">
                    Save {Math.round((fareEstimate.savingsPerPerson / fareEstimate.soloFare) * 100)}% with shared ride!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={handleFindMatches}
            disabled={!fareEstimate}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>Find Ride Partners</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-semantic-info/10 border border-semantic-info/20 rounded-lg p-4">
          <h4 className="font-medium text-semantic-info mb-2">How it works:</h4>
          <ul className="text-sm text-neutral-700 space-y-1">
            <li>• We match you with verified riders going the same way</li>
            <li>• Maximum 3 passengers per ride for comfort</li>
            <li>• Real-time tracking and safety features included</li>
            <li>• Split the fare automatically when ride completes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
