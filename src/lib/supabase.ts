import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone_number: string
  phone_verified: boolean
  email?: string
  profile_image_url?: string
  date_of_birth?: string
  gender?: string
  emergency_contact?: string
  emergency_contact_name?: string
  verification_status: string
  safety_rating: number
  total_rides: number
  total_shared_rides: number
  total_savings: number
  preferred_payment_method?: string
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  owner_user_id: string
  status: string
  pickup_location: {
    lat: number
    lng: number
    address: string
  }
  dropoff_location: {
    lat: number
    lng: number
    address: string
  }
  estimated_fare: number
  actual_fare?: number
  driver_id?: string
  driver_name?: string
  driver_phone?: string
  vehicle_number?: string
  pickup_time?: string
  completed_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RideParticipant {
  id: string
  ride_id: string
  user_id: string
  is_owner: boolean
  pickup_order?: number
  cost_share?: number
  payment_status: string
  joined_at: string
  confirmed_at?: string
}

export interface PaymentTransaction {
  id: string
  ride_id: string
  user_id: string
  amount: number
  payment_method?: string
  razorpay_payment_id?: string
  razorpay_order_id?: string
  status: string
  payment_date?: string
  created_at: string
}

export interface ChatMessage {
  id: string
  ride_id: string
  sender_id: string
  message: string
  message_type: string
  created_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  contact_name: string
  contact_phone: string
  relationship?: string
  is_primary: boolean
  created_at: string
}
