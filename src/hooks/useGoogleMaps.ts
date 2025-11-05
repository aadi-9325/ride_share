import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
    initMap?: () => void
    __googleMapsLoading?: boolean
    __googleMapsLoaded?: boolean
  }
}

// Global state to track loading across all hook instances
let globalIsLoaded = false
let globalIsLoading = false
let globalError: string | null = null
const loadCallbacks: Array<() => void> = []
const errorCallbacks: Array<(error: string) => void> = []

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded)
  const [error, setError] = useState<string | null>(globalError)

  useEffect(() => {
    // If already loaded globally, update local state
    if (globalIsLoaded) {
      setIsLoaded(true)
      return
    }

    // If there's a global error, update local state
    if (globalError) {
      setError(globalError)
      return
    }

    // Check if Google Maps API is already available in window
    if (window.google && window.google.maps && window.google.maps.places) {
      globalIsLoaded = true
      setIsLoaded(true)
      return
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    )

    if (existingScript) {
      // Script exists, wait for it to load
      if (window.google && window.google.maps) {
        globalIsLoaded = true
        setIsLoaded(true)
      } else {
        // Register callback for when it loads
        loadCallbacks.push(() => setIsLoaded(true))
      }
      return
    }

    // If already loading, just register callback
    if (globalIsLoading) {
      loadCallbacks.push(() => setIsLoaded(true))
      errorCallbacks.push((err) => setError(err))
      return
    }

    // Start loading
    globalIsLoading = true
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      const errorMsg = 'Google Maps API key is not configured'
      globalError = errorMsg
      setError(errorMsg)
      globalIsLoading = false
      errorCallbacks.forEach(cb => cb(errorMsg))
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.id = 'google-maps-script'

    script.onload = () => {
      globalIsLoaded = true
      globalIsLoading = false
      setIsLoaded(true)
      
      // Call all registered callbacks
      loadCallbacks.forEach(cb => cb())
      loadCallbacks.length = 0
      errorCallbacks.length = 0
    }

    script.onerror = () => {
      const errorMsg = 'Failed to load Google Maps API'
      globalError = errorMsg
      globalIsLoading = false
      setError(errorMsg)
      
      // Call all error callbacks
      errorCallbacks.forEach(cb => cb(errorMsg))
      loadCallbacks.length = 0
      errorCallbacks.length = 0
    }

    document.head.appendChild(script)

    // Cleanup function
    return () => {
      // Remove this component's callbacks if component unmounts during loading
      const loadIndex = loadCallbacks.indexOf(() => setIsLoaded(true))
      if (loadIndex > -1) loadCallbacks.splice(loadIndex, 1)
      
      const errorIndex = errorCallbacks.indexOf((err) => setError(err))
      if (errorIndex > -1) errorCallbacks.splice(errorIndex, 1)
    }
  }, [])

  return { isLoaded, error }
}
