import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
    initMap?: () => void
  }
}

// Global state to track loading across all hook instances
let globalIsLoaded = false
let globalIsLoading = false
let globalError: string | null = null
const loadCallbacks: Array<() => void> = []
const errorCallbacks: Array<(error: string) => void> = []

// Helper function to check if Google Maps API is fully loaded including Places
function isGoogleMapsFullyLoaded(): boolean {
  return !!(
    window.google &&
    window.google.maps &&
    window.google.maps.places &&
    window.google.maps.places.Autocomplete &&
    window.google.maps.Marker
  )
}

// Helper function to wait for Google Maps Places API to be ready
function waitForPlacesAPI(callback: () => void, errorCallback: (error: string) => void, attempts = 0) {
  const maxAttempts = 50 // 5 seconds max wait (50 * 100ms)
  
  if (isGoogleMapsFullyLoaded()) {
    callback()
    return
  }
  
  if (attempts >= maxAttempts) {
    errorCallback('Timeout waiting for Google Maps Places API')
    return
  }
  
  setTimeout(() => {
    waitForPlacesAPI(callback, errorCallback, attempts + 1)
  }, 100)
}

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

    // Check if Google Maps API is already fully available
    if (isGoogleMapsFullyLoaded()) {
      globalIsLoaded = true
      setIsLoaded(true)
      return
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    )

    if (existingScript) {
      // Script exists, check if fully loaded or wait
      if (isGoogleMapsFullyLoaded()) {
        globalIsLoaded = true
        setIsLoaded(true)
      } else {
        // Register callback to wait for full loading
        waitForPlacesAPI(
          () => {
            globalIsLoaded = true
            setIsLoaded(true)
          },
          (err) => {
            globalError = err
            setError(err)
          }
        )
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
      // Wait for Places API to be fully ready
      waitForPlacesAPI(
        () => {
          globalIsLoaded = true
          globalIsLoading = false
          setIsLoaded(true)
          
          // Call all registered callbacks
          loadCallbacks.forEach(cb => cb())
          loadCallbacks.length = 0
          errorCallbacks.length = 0
        },
        (err) => {
          globalError = err
          globalIsLoading = false
          setError(err)
          
          // Call all error callbacks
          errorCallbacks.forEach(cb => cb(err))
          loadCallbacks.length = 0
          errorCallbacks.length = 0
        }
      )
    }

    script.onerror = () => {
      const errorMsg = 'Failed to load Google Maps API script'
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
      const loadIndex = loadCallbacks.findIndex(cb => cb.toString() === (() => setIsLoaded(true)).toString())
      if (loadIndex > -1) loadCallbacks.splice(loadIndex, 1)
      
      const errorIndex = errorCallbacks.findIndex(cb => cb.toString() === ((err: string) => setError(err)).toString())
      if (errorIndex > -1) errorCallbacks.splice(errorIndex, 1)
    }
  }, [])

  return { isLoaded, error }
}
