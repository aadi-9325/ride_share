import React, { useEffect, useRef } from 'react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'

interface GoogleMapSimpleProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title?: string
    type?: 'pickup' | 'destination' | 'match'
  }>
  style?: React.CSSProperties
}

declare global {
  interface Window {
    google: any
  }
}

export function GoogleMapSimple({ center, zoom = 12, markers = [], style }: GoogleMapSimpleProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const { isLoaded } = useGoogleMaps()

  useEffect(() => {
    if (!mapRef.current || !window.google || !isLoaded) return

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    })

    mapInstanceRef.current = map

    // Add markers
    markers.forEach((marker, index) => {
      const mapMarker = new window.google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title || `Marker ${index + 1}`,
      })

      // Color code markers based on type
      let color = '#0066FF' // default blue
      if (marker.type === 'pickup') color = '#10B981' // green
      if (marker.type === 'destination') color = '#EF4444' // red

      // Create custom marker icon
      const icon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      }

      mapMarker.setIcon(icon)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, markers, isLoaded])

  return <div ref={mapRef} style={{ width: '100%', height: '300px', ...style }} />
}
