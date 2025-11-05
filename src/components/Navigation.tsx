import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, PlusCircle, MessageCircle, User, LogOut } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { EmergencyButton } from './EmergencyButton'

export function Navigation() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: PlusCircle, label: 'Book Ride', path: '/book' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  // Don't show navigation on auth pages
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null
  }

  return (
    <>
      <EmergencyButton />
      
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-500 bg-primary-50' 
                    : 'text-neutral-500 hover:text-primary-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
          
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-neutral-500 hover:text-semantic-error transition-colors"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </>
  )
}
