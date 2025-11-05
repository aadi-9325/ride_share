import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DollarSign, CreditCard, Smartphone, Wallet, Star, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export function PaymentPage() {
  const { rideId } = useParams<{ rideId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [ride, setRide] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (rideId) {
      loadRideAndPaymentData()
    }
  }, [rideId])

  const loadRideAndPaymentData = async () => {
    if (!rideId || !user) return

    try {
      // Load ride details
      const { data: rideData } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single()

      setRide(rideData)

      // Load participants with payment info
      const { data: participantsData } = await supabase
        .from('ride_participants')
        .select(`
          *,
          user_profiles!inner(full_name)
        `)
        .eq('ride_id', rideId)

      setParticipants(participantsData || [])
    } catch (error) {
      console.error('Error loading payment data:', error)
      toast.error('Failed to load payment details')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const userParticipant = participants.find(p => p.user_id === user?.id)
      if (!userParticipant) throw new Error('Participant not found')

      // Create payment transaction
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          ride_id: rideId!,
          user_id: user!.id,
          amount: userParticipant.cost_share,
          payment_method: paymentMethod,
          status: 'processing',
          payment_date: new Date().toISOString()
        })

      if (error) throw error

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update payment status
      await supabase
        .from('payment_transactions')
        .update({ status: 'completed' })
        .eq('ride_id', rideId!)
        .eq('user_id', user!.id)

      // Update participant payment status
      await supabase
        .from('ride_participants')
        .update({ payment_status: 'completed' })
        .eq('ride_id', rideId!)
        .eq('user_id', user!.id)

      // Update total savings for user
      const currentProfile = await supabase
        .from('user_profiles')
        .select('total_savings, total_shared_rides, total_rides')
        .eq('user_id', user!.id)
        .single()

      if (currentProfile.data) {
        await supabase
          .from('user_profiles')
          .update({ 
            total_savings: currentProfile.data.total_savings + (userParticipant.cost_share * 2),
            total_shared_rides: currentProfile.data.total_shared_rides + 1,
            total_rides: currentProfile.data.total_rides + 1
          })
          .eq('user_id', user!.id)
      }

      toast.success('Payment completed successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
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

  const currentUserParticipant = participants.find(p => p.user_id === user?.id)

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Complete Payment</h1>
          <p className="text-neutral-600">Secure payment for your shared ride</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Ride Summary */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ride Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">From</span>
              <span className="font-medium">{ride.pickup_location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">To</span>
              <span className="font-medium">{ride.dropoff_location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Vehicle</span>
              <span className="font-medium capitalize">{ride.notes?.split(',')[0]?.split(':')[1]?.trim() || 'Auto'}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-neutral-600">Total Distance</span>
              <span className="font-medium">{ride.notes?.split(',')[1]?.trim() || '15km'}</span>
            </div>
          </div>
        </div>

        {/* Participants and Cost Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {participant.user_profiles.profile_image_url ? (
                    <img
                      src={participant.user_profiles.profile_image_url}
                      alt={participant.user_profiles.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-500 text-sm font-semibold">
                        {participant.user_profiles.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-neutral-900">
                      {participant.user_profiles.full_name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {participant.payment_status === 'completed' ? (
                        <span className="flex items-center space-x-1 text-semantic-success">
                          <CheckCircle size={14} />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500">Pending</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">₹{participant.cost_share}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Ride Cost</span>
              <span>₹{ride.actual_fare || ride.estimated_fare * 3}</span>
            </div>
          </div>
        </div>

        {/* Your Payment */}
        {currentUserParticipant && (
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Your Payment</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-primary-900">₹{currentUserParticipant.cost_share}</p>
                <p className="text-primary-700">Your share of the ride</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-700">Compared to private ride</p>
                <p className="text-lg font-semibold text-primary-900 line-through">
                  ₹{(currentUserParticipant.cost_share * 3)}
                </p>
              </div>
            </div>
            
            <div className="bg-semantic-success/20 border border-semantic-success/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-semantic-success">
                <Star size={16} />
                <span className="font-medium">
                  You saved ₹{(currentUserParticipant.cost_share * 2)} on this ride!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using UPI apps like GPay, PhonePe' },
              { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, MasterCard, RuPay' },
              { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'Paytm, Amazon Pay, etc.' },
            ].map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`${
                      paymentMethod === method.id ? 'text-primary-500' : 'text-neutral-400'
                    }`} size={24} />
                    <div>
                      <p className={`font-medium ${
                        paymentMethod === method.id ? 'text-primary-900' : 'text-neutral-900'
                      }`}>
                        {method.name}
                      </p>
                      <p className="text-sm text-neutral-600">{method.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Ride Fare</span>
              <span>₹{currentUserParticipant?.cost_share}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Platform Fee</span>
              <span className="text-semantic-success">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax</span>
              <span>₹0</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-primary-500">₹{currentUserParticipant?.cost_share}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-semantic-info/10 border border-semantic-info/20 rounded-lg p-4">
          <h4 className="font-medium text-semantic-info mb-2">Secure Payment</h4>
          <p className="text-sm text-neutral-700">
            Your payment is secured with bank-level encryption. We never store your card details.
            All transactions are processed through certified payment gateways.
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <DollarSign size={20} />
              <span>Pay ₹{currentUserParticipant?.cost_share} Securely</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
