import React from 'react'
import { Phone } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

export function EmergencyButton() {
  const { user } = useAuth()

  const handleEmergencyCall = async () => {
    if (!user) return

    // Get user's emergency contact
    const { data: emergencyContact } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .maybeSingle()

    if (emergencyContact?.contact_phone) {
      // In a real app, this would trigger an emergency alert
      window.open(`tel:${emergencyContact.contact_phone}`, '_self')
    } else {
      alert('No emergency contact configured. Please add one in your profile.')
    }
  }

  return (
    <button
      onClick={handleEmergencyCall}
      className="fixed top-4 right-4 z-50 bg-semantic-error hover:bg-semantic-error/90 text-white p-3 rounded-full shadow-lg transition-all duration-200 animate-pulse"
      aria-label="Emergency Contact"
    >
      <Phone size={20} />
    </button>
  )
}
