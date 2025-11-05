import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Phone, Mail, Camera, Shield, Star, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showEmergencyForm, setShowEmergencyForm] = useState(false)
  const [emergencyForm, setEmergencyForm] = useState({
    contact_name: '',
    contact_phone: '',
    relationship: '',
    is_primary: false
  })

  useEffect(() => {
    loadProfileData()
  }, [user])

  const loadProfileData = async () => {
    if (!user) return

    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profileData)

      // Load emergency contacts
      const { data: contactsData } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })

      setEmergencyContacts(contactsData || [])
    } catch (error) {
      console.error('Error loading profile data:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUpdating(true)
    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string

          // Call edge function to upload image
          const { data, error } = await supabase.functions.invoke('profile-image-upload', {
            body: {
              imageData: base64Data,
              fileName: `profile-${Date.now()}.${file.name.split('.').pop()}`
            }
          })

          if (error) throw error

          // Update local state
          setProfile(prev => ({
            ...prev,
            profile_image_url: data.data.publicUrl
          }))

          toast.success('Profile image updated successfully!')
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
        } finally {
          setUpdating(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Failed to process image')
      setUpdating(false)
    }
  }

  const addEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          ...emergencyForm
        })

      if (error) throw error

      toast.success('Emergency contact added successfully!')
      setShowEmergencyForm(false)
      setEmergencyForm({
        contact_name: '',
        contact_phone: '',
        relationship: '',
        is_primary: false
      })
      loadProfileData() // Reload to show new contact
    } catch (error) {
      console.error('Error adding emergency contact:', error)
      toast.error('Failed to add emergency contact')
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
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
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
          <p className="text-neutral-600">Manage your account and safety settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-start space-x-6">
            <div className="relative">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-500" size={32} />
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <Camera className="text-white" size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={updating}
                />
              </label>
              {updating && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" className="border-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-neutral-600 mb-2">{profile?.email}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium">{profile?.safety_rating || 5.0}</span>
                  <span className="text-sm text-neutral-600">Safety Rating</span>
                </div>
                {profile?.verification_status === 'verified' && (
                  <div className="flex items-center space-x-1 bg-semantic-success/20 text-semantic-success px-2 py-1 rounded-full">
                    <Shield size={14} />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-neutral-600">Total Savings</p>
              <p className="text-2xl font-bold text-semantic-success">₹{profile?.total_savings || 0}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-neutral-200 text-center">
            <p className="text-2xl font-bold text-neutral-900">{profile?.total_shared_rides || 0}</p>
            <p className="text-sm text-neutral-600">Shared Rides</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200 text-center">
            <p className="text-2xl font-bold text-neutral-900">{profile?.total_rides || 0}</p>
            <p className="text-sm text-neutral-600">Total Rides</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200 text-center">
            <p className="text-2xl font-bold text-neutral-900">{profile?.safety_rating || 5.0}</p>
            <p className="text-sm text-neutral-600">Avg Rating</p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Emergency Contacts</h3>
            <button
              onClick={() => setShowEmergencyForm(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Add Contact
            </button>
          </div>

          {emergencyContacts.length === 0 ? (
            <p className="text-neutral-600 text-center py-4">No emergency contacts added yet</p>
          ) : (
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{contact.contact_name}</p>
                    <p className="text-sm text-neutral-600">
                      {contact.contact_phone} • {contact.relationship}
                    </p>
                  </div>
                  {contact.is_primary && (
                    <span className="px-2 py-1 bg-semantic-success/20 text-semantic-success text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Contact Form */}
        {showEmergencyForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add Emergency Contact</h3>
              <form onSubmit={addEmergencyContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyForm.contact_name}
                    onChange={(e) => setEmergencyForm({...emergencyForm, contact_name: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={emergencyForm.contact_phone}
                    onChange={(e) => setEmergencyForm({...emergencyForm, contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={emergencyForm.relationship}
                    onChange={(e) => setEmergencyForm({...emergencyForm, relationship: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={emergencyForm.is_primary}
                    onChange={(e) => setEmergencyForm({...emergencyForm, is_primary: e.target.checked})}
                    className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="is_primary" className="text-sm text-neutral-700">
                    Set as primary contact
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyForm(false)}
                    className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-2 rounded-lg transition-colors"
                  >
                    {updating ? <LoadingSpinner size="sm" /> : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Settings</h3>
          <div className="space-y-3">
            <Link
              to="/settings"
              className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="text-neutral-400" size={20} />
                <span className="text-neutral-900">App Settings</span>
              </div>
              <span className="text-neutral-400">›</span>
            </Link>
            <Link
              to="/help"
              className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="text-neutral-400" size={20} />
                <span className="text-neutral-900">Help & Support</span>
              </div>
              <span className="text-neutral-400">›</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-between w-full p-3 hover:bg-neutral-50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="text-neutral-400" size={20} />
                <span className="text-semantic-error">Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
