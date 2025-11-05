import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Phone, Mail, User, Shield } from 'lucide-react'
import { useAuth } from '../lib/auth'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // Validation for sign up
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required')
        }
        if (!formData.phoneNumber.trim()) {
          throw new Error('Phone number is required')
        }

        await signUp(formData.email, formData.password, formData.fullName, formData.phoneNumber)
        toast.success('Account created successfully! Please check your email for verification.')
      } else {
        // Sign in
        await signIn(formData.email, formData.password)
        toast.success('Welcome back!')
      }
      
      navigate(from, { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-neutral-900">RideShare</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-neutral-600">
            {isSignUp 
              ? 'Join thousands saving money on daily rides'
              : 'Sign in to continue your journey'
            }
          </p>
        </div>

        {/* Trust Indicators */}
        {isSignUp && (
          <div className="bg-semantic-success/10 border border-semantic-success/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-semantic-success mb-2">
              <Shield size={18} />
              <span className="font-medium">100% Safe & Secure</span>
            </div>
            <p className="text-sm text-neutral-600">
              Your data is protected with bank-level security. We never share your information.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+91 XXXXX XXXXX"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {isSignUp && (
            <div className="mt-4 text-xs text-neutral-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-500 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:underline">
                Privacy Policy
              </Link>
            </div>
          )}
        </div>

        {/* Features for Sign Up */}
        {isSignUp && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <div className="w-5 h-5 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
              </div>
              <span>Save 60-85% on every ride</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <div className="w-5 h-5 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
              </div>
              <span>Connect with verified riders</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <div className="w-5 h-5 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
              </div>
              <span>24/7 emergency support</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
