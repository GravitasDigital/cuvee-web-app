import { useState, useEffect } from 'react'
import { isGuestUser, isAuthenticated } from '../utils/auth'

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
  onLogout?: () => void
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const isGuest = isGuestUser()
  const isLoggedIn = isAuthenticated()

  // Trigger entrance animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const experiences = [
    {
      title: 'Private Air',
      description: 'TRAVEL MADE SIMPLE',
      subtitle: 'Explore Cuvée Private Air',
      image: 'https://www.cuvee.com/wp-content/uploads/2025/11/jettt.png',
      link: 'https://www.cuvee.com/private-air/',
    },
    {
      title: 'Ski Chalets',
      description: 'CHALETS DESIGNED FOR THE SLOPES',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/07/header-usa.webp',
      link: 'https://www.cuvee.com/destinations/mountain-getaways/',
    },
    {
      title: 'Beach Getaways',
      description: 'WHERE THE WATER IS WARMEST THIS WINTER',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/07/Oahu-Break-Mobile.webp',
      link: 'https://www.cuvee.com/destinations/coastal-escapes/',
    },
  ]

  // Auto-rotate slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % experiences.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [experiences.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % experiences.length)
  }

  return (
    <div className="h-screen overflow-hidden relative flex flex-col">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 animate-gradient-slow"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1F2937]/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo - Animated Entrance */}
        <div className={`bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="w-8"></div>
            <img src="https://www.cuvee.com/wp-content/themes/cuvee/assets/img/logo.webp" alt="Cuvee" className="h-7" />
            {isLoggedIn && onLogout ? (
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <div className="w-8"></div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Experiences Slider with Ken Burns Effect */}
          <section className={`flex-shrink-0 transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ height: '45vh' }}>
            <div className="relative h-full overflow-hidden group">
              <style>{`
                @keyframes kenburns {
                  0% { transform: scale(1) translate(0, 0); }
                  100% { transform: scale(1.1) translate(-5%, -5%); }
                }
                @keyframes slideInFromLeft {
                  0% { transform: translateX(-100%); opacity: 0; }
                  100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutToRight {
                  0% { transform: translateX(0); opacity: 1; }
                  100% { transform: translateX(100%); opacity: 0; }
                }
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
                .animate-kenburns { animation: kenburns 20s ease-in-out infinite alternate; }
                .animate-slide-in { animation: slideInFromLeft 0.8s ease-out forwards; }
                .animate-gradient-slow { background-size: 200% 200%; animation: gradient-slow 15s ease infinite; }
                .animate-float { animation: float 20s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
                .ripple { position: relative; overflow: hidden; }
                .ripple::after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.5);
                  transform: translate(-50%, -50%);
                  transition: width 0.6s, height 0.6s;
                }
                .ripple:active::after {
                  width: 300px;
                  height: 300px;
                }
              `}</style>
              {experiences.map((exp, index) => (
                <a
                  key={index}
                  href={exp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center ${index === currentSlide ? 'animate-kenburns' : ''}`}
                    style={{ backgroundImage: `url(${exp.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-12 overflow-hidden">
                      <div className={`max-w-sm w-full ${index === currentSlide ? 'animate-slide-in' : ''}`}>
                        <h3 className="text-3xl font-light uppercase tracking-widest mb-3 text-center drop-shadow-lg h-12 flex items-center justify-center">
                          {exp.subtitle ? exp.description : exp.title}
                        </h3>
                        {exp.subtitle ? (
                          <p className="text-sm font-light tracking-wide opacity-90 text-center drop-shadow-md">
                            {exp.subtitle}
                          </p>
                        ) : (
                          <p className="text-sm font-light tracking-wide opacity-90 text-center drop-shadow-md h-10 flex items-center justify-center">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}

              {/* Navigation Buttons */}
              <button
                onClick={goToPrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/30"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/30"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {experiences.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all hover:scale-110 active:scale-95 ${
                      index === currentSlide
                        ? 'bg-[#D4AF37] w-6'
                        : 'bg-white/50 hover:bg-white/80 w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Login / Account Section */}
          {!isLoggedIn ? (
            // Show elegant login card when not logged in
            <section className={`flex-shrink-0 px-4 pt-4 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#D4AF37] to-[#C0A062] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light uppercase tracking-wide text-gray-800 mb-2">Your Cuvée Account</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Sign in to access your reservations, view your Voyage Passport rewards, and manage your preferences.</p>
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white py-3 px-6 rounded-lg font-light uppercase text-sm tracking-wide hover:shadow-xl hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] ripple"
                >
                  Sign In
                </button>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Access available for both profile users and guests with confirmation numbers
                  </p>
                </div>
              </div>
            </section>
          ) : (
            // Show My Reservations and Voyage Passport buttons when logged in
            <section className={`flex-shrink-0 px-4 pt-4 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex gap-3 mb-0">
                <button
                  onClick={() => onNavigate('reservations')}
                  className="flex-1 bg-[#1e3a5f] p-4 rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 ripple overflow-hidden relative"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[#D4AF37]/50">
                      <img
                        src="https://www.cuvee.com/wp-content/uploads/2024/07/header-usa.webp"
                        alt="Your Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-light uppercase tracking-wide text-[#D4AF37]">My Reservations</div>
                      <div className="text-xs mt-1 text-gray-100">Stays & trips</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate('passport')}
                  className="flex-1 bg-gradient-to-br from-[#D4AF37] to-[#C0A062] p-4 rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 ripple overflow-hidden relative"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img
                        src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                        alt="Voyage Passport"
                        className="w-full h-full object-contain brightness-0 invert"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-light uppercase tracking-wide text-white">Voyage Passport</div>
                      <div className="text-xs mt-1 text-white/90">Your rewards</div>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* Featured Destinations - Horizontal Slider */}
          <section className={`flex-shrink-0 px-4 pt-4 pb-2 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-sm font-light uppercase tracking-wide mb-3 text-gray-700">Featured Destinations</h2>
            <div
              className="flex gap-3 overflow-x-scroll snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <a
                href="https://www.cuvee.com/destinations/aspen-snowmass/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                style={{ minWidth: 'calc(70% - 6px)', height: '180px' }}
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://www.cuvee.com/wp-content/uploads/2024/07/header-usa.webp)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                      <h3 className="text-xs font-light uppercase tracking-wide text-white">Aspen</h3>
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="https://www.cuvee.com/destinations/hawaii/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                style={{ minWidth: 'calc(70% - 6px)', height: '180px' }}
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://www.cuvee.com/wp-content/uploads/2024/07/Oahu-Break-Mobile.webp)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                      <h3 className="text-xs font-light uppercase tracking-wide text-white">Hawaii</h3>
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="https://www.cuvee.com/destinations/napa-sonoma/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                style={{ minWidth: 'calc(70% - 6px)', height: '180px' }}
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://www.cuvee.com/wp-content/uploads/2024/08/BBQ-Beach-Dinner-1-1-1-e1725011974523.webp)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                      <h3 className="text-xs font-light uppercase tracking-wide text-white">Napa</h3>
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="https://www.cuvee.com/destinations/caribbean/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                style={{ minWidth: 'calc(70% - 6px)', height: '180px' }}
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://www.cuvee.com/wp-content/uploads/2024/07/BBQ-Beach-Dinner-mob.webp)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                      <h3 className="text-xs font-light uppercase tracking-wide text-white">Caribbean</h3>
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="https://www.cuvee.com/destinations/park-city/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                style={{ minWidth: 'calc(70% - 6px)', height: '180px' }}
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://www.cuvee.com/wp-content/uploads/2024/08/exp-mud-tall.webp)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                      <h3 className="text-xs font-light uppercase tracking-wide text-white">Park City</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
          </section>

          {/* Bottom CTA - Glassmorphism */}
          <section className={`flex-shrink-0 px-4 py-4 mt-auto transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-r from-[#1F2937]/90 to-[#374151]/90 backdrop-blur-md rounded-xl p-4 text-center text-white shadow-lg border border-white/10">
              <h2 className="text-lg font-light uppercase tracking-wide mb-3">Explore More</h2>
              <a
                href="https://www.cuvee.com/results/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-white text-[#1F2937] font-light uppercase text-sm tracking-wide rounded-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 ripple shadow-md"
              >
                All Properties
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardScreen
