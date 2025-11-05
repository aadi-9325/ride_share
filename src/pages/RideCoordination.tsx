import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleMapSimple } from '../components/GoogleMapSimple'
import { MapPin, Phone, MessageCircle, Navigation, Clock, Users, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Navigation as AppNavigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'



export function RideCoordination() {
  const { rideId } = useParams<{ rideId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [ride, setRide] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (rideId) {
      loadRideData()
      // Subscribe to real-time updates
      const subscription = supabase
        .channel(`ride-${rideId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'chat_messages', filter: `ride_id=eq.${rideId}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMessages(prev => [...prev, payload.new])
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [rideId])

  const loadRideData = async () => {
    if (!rideId || !user) return

    try {
      // Load ride details
      const { data: rideData } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single()

      setRide(rideData)

      // Load participants
      const { data: participantsData } = await supabase
        .from('ride_participants')
        .select(`
          *,
          user_profiles!inner(*)
        `)
        .eq('ride_id', rideId)

      setParticipants(participantsData || [])

      // Load messages
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user_profiles!inner(full_name)
        `)
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true })

      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error loading ride data:', error)
      toast.error('Failed to load ride details')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !rideId) return

    setSendingMessage(true)
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          ride_id: rideId,
          sender_id: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleEmergency = async () => {
    // In a real app, this would trigger emergency protocols
    const confirmed = window.confirm('This will alert your emergency contacts and our support team. Continue?')
    if (confirmed) {
      toast.success('Emergency alert sent. Help is on the way.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!ride) {
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
      <AppNavigation />
      
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Ride {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </h1>
              <p className="text-neutral-600">
                {ride.pickup_location.address} → {ride.dropoff_location.address}
              </p>
            </div>
            <button
              onClick={handleEmergency}
              className="bg-semantic-error hover:bg-semantic-error/90 text-white p-3 rounded-lg transition-colors"
              title="Emergency Help"
            >
              <AlertTriangle size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Ride Status */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Ride Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              ride.status === 'matched' ? 'bg-primary-100 text-primary-800' :
              ride.status === 'confirmed' ? 'bg-semantic-success/20 text-semantic-success' :
              ride.status === 'in_progress' ? 'bg-semantic-info/20 text-semantic-info' :
              'bg-neutral-100 text-neutral-800'
            }`}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </span>
          </div>

          {ride.driver_name && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Driver Details</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{ride.driver_name}</p>
                  <p className="text-sm text-neutral-600">Vehicle: {ride.vehicle_number}</p>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Route Map */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Live Tracking</h3>
          </div>
          {ride ? (
            <GoogleMapSimple
              center={{
                lat: (ride.pickup_location.lat + ride.dropoff_location.lat) / 2,
                lng: (ride.pickup_location.lng + ride.dropoff_location.lng) / 2
              }}
              markers={[
                { position: ride.pickup_location, title: 'Pickup', type: 'pickup' },
                { position: ride.dropoff_location, title: 'Destination', type: 'destination' },
                ...(ride.driver_id ? [{
                  position: {
                    lat: (ride.pickup_location.lat + ride.dropoff_location.lat) / 2,
                    lng: (ride.pickup_location.lng + ride.dropoff_location.lng) / 2
                  },
                  title: 'Driver',
                  type: 'match' as const
                }] : [])
              ]}
              style={{ height: '300px' }}
            />
          ) : (
            <div className="h-80 flex items-center justify-center bg-neutral-50">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
            <Users size={20} />
            <span>Ride Participants ({participants.length})</span>
          </h3>
          
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {participant.user_profiles.profile_image_url ? (
                    <img
                      src={participant.user_profiles.profile_image_url}
                      alt={participant.user_profiles.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-500 font-semibold">
                        {participant.user_profiles.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-neutral-900">
                      {participant.user_profiles.full_name}
                      {participant.is_owner && (
                        <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                          Host
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Safety: {participant.user_profiles.safety_rating}/5.0
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary-500">₹{participant.cost_share}</p>
                  <p className="text-sm text-neutral-600 capitalize">{participant.payment_status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Ride Chat</span>
            </h3>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user?.id ? 'text-primary-100' : 'text-neutral-500'
                    }`}>
                      {message.user_profiles.full_name} • {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-neutral-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {sendingMessage ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {ride.status === 'completed' && (
          <button
            onClick={() => navigate(`/payment/${rideId}`)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>Complete Payment</span>
            <Navigation size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
