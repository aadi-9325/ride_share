import React, { useRef, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'

interface SimpleLocationInputProps {
  value: string
  onChange: (value: string) => void
  onCoordsChange: (coords: { lat: number; lng: number } | null) => void
  placeholder: string
  iconColor?: string
}

declare global {
  interface Window {
    google: any
    initMap?: () => void
  }
}

export function SimpleLocationInput({ 
  value, 
  onChange, 
  onCoordsChange, 
  placeholder, 
  iconColor = '#10B981' 
}: SimpleLocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { isLoaded, error } = useGoogleMaps()

  useEffect(() => {
    // Ensure Places API is fully loaded before initializing Autocomplete
    if (isLoaded && inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name']
        })
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry?.location) {
            onChange(place.formatted_address || place.name || '')
            onCoordsChange({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            })
          }
        })
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error)
      }
    }
  }, [isLoaded, onChange, onCoordsChange])

  return (
    <div className="relative">
      <MapPin className={`absolute left-3 top-3`} size={20} style={{ color: iconColor }} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          // Don't set coordinates on manual typing
          onCoordsChange(null)
        }}
        className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  )
}
