import { useState, useEffect } from 'react'
import { UserType } from '../utils/auth'

interface LoginScreenProps {
  onLogin: (userData: {
    userType: UserType
    email?: string
    bookingNumber?: string
    lastName?: string
  }) => void
  onBack?: () => void
}

type LoginMode = 'profile' | 'guest'

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loginMode] = useState<LoginMode>('guest')

  // Guest login fields
  const [bookingNumber, setBookingNumber] = useState('')
  const [lastName, setLastName] = useState('')

  // Profile login fields
  const [email, setEmail] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!bookingNumber || !lastName) {
      setError('Please enter both confirmation number and last name')
      return
    }

    // Mock validation - in production this would verify against database
    const validBookings = [
      { number: 'CUVC12345', lastName: 'Smith' },
      { number: 'CUVC67890', lastName: 'Johnson' },
      { number: '1234', lastName: 'Guest' },
    ]

    const booking = validBookings.find(
      b => b.number.toLowerCase() === bookingNumber.toLowerCase() &&
           b.lastName.toLowerCase() === lastName.toLowerCase()
    )

    if (booking) {
      setIsLoading(true)
      setTimeout(() => {
        onLogin({
          userType: 'guest',
          bookingNumber: booking.number,
          lastName: booking.lastName
        })
      }, 500)
    } else {
      setError('Reservation not found. Please check your confirmation number and last name.')
    }
  }

  const handleProfileLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Demo mode - accept any email for testing with real HubSpot data
    // In production this would verify against WordPress/database
    setIsLoading(true)
    setTimeout(() => {
      onLogin({
        userType: 'profile',
        email: email.toLowerCase()
      })
    }, 500)
  }

  return (
    <div className="h-screen overflow-hidden relative flex flex-col">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 animate-gradient-slow"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1F2937]/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.1); }
        }
        .animate-gradient-slow { background-size: 200% 200%; animation: gradient-slow 15s ease infinite; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
      `}</style>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center px-6">
        {/* Back Button */}
        {onBack && (
          <div className="absolute top-6 left-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm uppercase tracking-wide font-light">Back</span>
            </button>
          </div>
        )}

        <div className={`w-full max-w-md transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://www.cuvee.com/wp-content/themes/cuvee/assets/img/logo.webp"
              alt="Cuvee"
              className="h-12 mx-auto mb-6"
            />
            <h1 className="text-3xl font-light uppercase tracking-widest text-gray-800 mb-2">Welcome</h1>
            <p className="text-sm font-light text-gray-600">Access your luxury stay</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 space-y-8">
              {/* Profile User Section */}
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wide text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Profile User
                </h2>
                <form onSubmit={handleProfileLogin}>
                  <div className="mb-4">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  {error && loginMode === 'profile' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e3a5f] text-white py-3 rounded-lg font-light uppercase text-sm tracking-wide hover:shadow-xl hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && loginMode === 'profile' ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Demo Mode:</strong> Enter any email from HubSpot to see real Voyage Passport data. No password required.
                    </p>
                  </div>
                </form>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                  <span className="px-4 bg-white/80 text-gray-500 font-light">Or</span>
                </div>
              </div>

              {/* Guest Section */}
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wide text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Guest
                </h2>
                <form onSubmit={handleGuestLogin}>
                  <div className="mb-4">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Confirmation Number
                    </label>
                    <input
                      type="text"
                      value={bookingNumber}
                      onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                      placeholder="CUVC12345"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all uppercase"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Primary Guest Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  {error && loginMode === 'guest' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e3a5f] text-white py-3 rounded-lg font-light uppercase text-sm tracking-wide hover:shadow-xl hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && loginMode === 'guest' ? 'Verifying...' : 'Access Reservation'}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">Demo Guest Credentials:</p>
                    <p className="text-xs text-blue-600">
                      Number: <span className="font-mono">1234</span><br />
                      Last Name: <span className="font-mono">Guest</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className={`text-center text-xs text-gray-500 mt-6 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Questions? Contact our concierge team
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
