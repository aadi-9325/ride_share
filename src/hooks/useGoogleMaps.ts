import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google: any
    initMap?: () => void
  }
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) {
      setIsLoaded(true)
      return
    }

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      loadedRef.current = true
      return
    }

    // Create and load the script only once
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
      loadedRef.current = true
    }

    script.onerror = () => {
      setError('Failed to load Google Maps API')
    }

    document.head.appendChild(script)

    return () => {
      // Don't remove the script as it might be used by other components
      // We only want to prevent multiple loading
    }
  }, [])

  return { isLoaded, error }
}