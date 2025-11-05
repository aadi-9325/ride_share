import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Users, Zap, DollarSign, CheckCircle, Star } from 'lucide-react'

export function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Find compatible riders heading the same way'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Verified users and emergency features'
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Save up to 60-85% on your rides'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Quick ride coordination and pickup'
    }
  ]

  const benefits = [
    'Save ₹500-1000 per ride',
    'Only verified users',
    'Live ride tracking',
    'Emergency support',
    'Transparent pricing',
    'Instant matching'
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Delhi',
      text: 'I save ₹800 every day sharing rides to work. The app is safe and reliable.',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      location: 'Bangalore',
      text: 'Great way to meet people and save money. Love the safety features.',
      rating: 5
    },
    {
      name: 'Anjali Singh',
      location: 'Mumbai',
      text: 'The cost savings are amazing. I use it for all my daily commutes.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Users className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900">RideShare</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Share Rides,{' '}
              <span className="text-primary-500">Split Costs</span>,{' '}
              <span className="text-semantic-success">Save Money</span>
            </h2>
            
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join the smart way to travel. Match with verified riders heading your way and save up to 60-85% on every ride.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/auth"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors w-full sm:w-auto"
              >
                Start Saving Now
              </Link>
              <div className="text-sm text-neutral-500">
                No fees • Instant matching • Safe rides
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-semantic-success" size={16} />
                <span>Verified Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-semantic-success" size={16} />
                <span>Emergency Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="text-semantic-success" size={16} />
                <span>Real-time Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              See How Much You Can Save
            </h3>
            <p className="text-lg text-neutral-600">
              Compare costs for common routes in major Indian cities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-xl p-6 text-center">
              <h4 className="font-semibold text-neutral-900 mb-2">Delhi to Gurgaon</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Private Auto</span>
                  <span className="font-medium">₹450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-semantic-success">Shared Ride</span>
                  <span className="font-semibold text-semantic-success">₹150</span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-semantic-success font-bold">Save ₹300 (67%)</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 text-center">
              <h4 className="font-semibold text-neutral-900 mb-2">Mumbai to Navi Mumbai</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Private Auto</span>
                  <span className="font-medium">₹380</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-semantic-success">Shared Ride</span>
                  <span className="font-semibold text-semantic-success">₹120</span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-semantic-success font-bold">Save ₹260 (68%)</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 text-center">
              <h4 className="font-semibold text-neutral-900 mb-2">Bangalore to Electronic City</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Private Auto</span>
                  <span className="font-medium">₹520</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-semantic-success">Shared Ride</span>
                  <span className="font-semibold text-semantic-success">₹170</span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-semantic-success font-bold">Save ₹350 (67%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose RideShare?
            </h3>
            <p className="text-lg text-neutral-600">
              Built with safety, convenience, and savings in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-500" size={24} />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">{feature.title}</h4>
                  <p className="text-neutral-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Everything You Need for Safe, Affordable Rides
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-semantic-success flex-shrink-0" size={18} />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-neutral-900 mb-4">
                Ready to Start Saving?
              </h4>
              <p className="text-neutral-600 mb-6">
                Join thousands of users already saving money on their daily commutes.
              </p>
              <Link 
                to="/auth"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              What Our Users Say
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                  <div className="text-sm text-neutral-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Start Saving Money Today
          </h3>
          <p className="text-primary-100 text-lg mb-8">
            Join the ride-sharing revolution. Safe, smart, and affordable travel awaits.
          </p>
          <Link 
            to="/auth"
            className="bg-white hover:bg-neutral-50 text-primary-500 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={18} />
                </div>
                <h4 className="text-xl font-semibold">RideShare</h4>
              </div>
              <p className="text-neutral-400">
                Smart ride-sharing for modern India. Save money, meet people, protect the environment.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>Smart Matching</li>
                <li>Safety Features</li>
                <li>Cost Savings</li>
                <li>Real-time Tracking</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>Help Center</li>
                <li>Safety Guidelines</li>
                <li>Contact Us</li>
                <li>Emergency Support</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 RideShare. All rights reserved. Made with ❤️ for India.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
