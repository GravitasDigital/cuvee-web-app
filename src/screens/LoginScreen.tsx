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
  const [loginMode, setLoginMode] = useState<LoginMode>('guest')

  // Guest login fields
  const [bookingNumber, setBookingNumber] = useState('')
  const [lastName, setLastName] = useState('')

  // Profile login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      { number: 'DEMO', lastName: 'Guest' },
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

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    // Mock validation - in production this would verify against WordPress/database
    const validProfiles = [
      { email: 'john@example.com', password: 'demo123' },
      { email: 'demo@cuvee.com', password: 'password' },
    ]

    const profile = validProfiles.find(
      p => p.email.toLowerCase() === email.toLowerCase() &&
           p.password === password
    )

    if (profile) {
      setIsLoading(true)
      setTimeout(() => {
        onLogin({
          userType: 'profile',
          email: profile.email
        })
      }, 500)
    } else {
      setError('Invalid email or password. Please try again.')
    }
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
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => { setLoginMode('profile'); setError('') }}
                className={`flex-1 py-4 px-6 text-sm font-light uppercase tracking-wide transition-all ${
                  loginMode === 'profile'
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-white/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                Profile User
              </button>
              <button
                onClick={() => { setLoginMode('guest'); setError('') }}
                className={`flex-1 py-4 px-6 text-sm font-light uppercase tracking-wide transition-all ${
                  loginMode === 'guest'
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-white/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                Guest
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {loginMode === 'guest' ? (
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

                  <div className="mb-6">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Last Name
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

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C4A137] text-white py-3 rounded-lg font-light uppercase text-sm tracking-wide hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Access Reservation'}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">Demo Guest Credentials:</p>
                    <p className="text-xs text-blue-600">
                      Number: <span className="font-mono">DEMO</span><br />
                      Last Name: <span className="font-mono">Guest</span>
                    </p>
                  </div>
                </form>
              ) : (
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

                  <div className="mb-6">
                    <label className="block text-xs font-light uppercase tracking-wide text-gray-600 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C4A137] text-white py-3 rounded-lg font-light uppercase text-sm tracking-wide hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">Demo Profile Credentials:</p>
                    <p className="text-xs text-blue-600">
                      Email: <span className="font-mono">demo@cuvee.com</span><br />
                      Password: <span className="font-mono">password</span>
                    </p>
                  </div>
                </form>
              )}
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
