import { useState, useEffect, useRef } from 'react'
import { isAuthenticated } from '../utils/auth'

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
  onLogout?: () => void
}

interface FeaturedOffer {
  id: number
  title: string
  featuredImage: string
  offerTitle: string
  offerSubtitle: string
  offerType: string
  offerLink: string
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffer[]>([])
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)
  const offersScrollRef = useRef<HTMLDivElement>(null)
  // const isGuest = isGuestUser()
  const isLoggedIn = isAuthenticated()

  // Trigger entrance animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fetch featured offers from WordPress
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const apiUrl = import.meta.env.MODE === 'development'
          ? 'http://localhost:8080/api/featured-offers'
          : '/api/featured-offers'
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.success && data.offers) {
          setFeaturedOffers(data.offers)
        }
      } catch (error) {
        console.error('Error fetching featured offers:', error)
      } finally {
        setIsLoadingOffers(false)
      }
    }

    fetchOffers()
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

  const scrollOffers = (direction: 'left' | 'right') => {
    if (offersScrollRef.current) {
      const scrollAmount = offersScrollRef.current.clientWidth * 0.75
      offersScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
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
              <div className="flex flex-col gap-3 mb-0">
                <button
                  onClick={() => onNavigate('reservations')}
                  className="group relative bg-white/90 backdrop-blur-md p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-gray-200/50 overflow-hidden"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/5 via-[#2d4a6f]/10 to-[#1e3a5f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1e3a5f]/10 to-transparent rounded-bl-full"></div>

                  <div className="relative flex items-center gap-4">
                    {/* Icon with animated ring */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#1e3a5f]/10 rounded-2xl group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-2xl flex items-center justify-center shadow-lg p-3">
                        <img
                          src="https://cuvee.com/luxury/wp-content/uploads/elementor/thumbs/c-logo-rdu930jcvf7vua5hapz584ui91pyzmusork5jp7hlm.png"
                          alt="Cuvée"
                          className="w-full h-full object-contain brightness-0 invert"
                        />
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-left">
                      <div className="text-base font-semibold uppercase tracking-wide text-[#1e3a5f] mb-1 group-hover:text-[#2d4a6f] transition-colors">
                        My Reservations
                      </div>
                      <div className="text-sm text-gray-600 font-light">
                        View your upcoming stays & trips
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-[#1e3a5f] group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('passport')}
                  className="group relative bg-gradient-to-br from-[#D4AF37] via-[#C0A062] to-[#D4AF37] p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 border-4 border-white rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-4 border-white rounded-full -ml-16 -mb-16"></div>
                  </div>

                  <div className="relative flex items-center gap-4">
                    {/* Icon with glow effect */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500"></div>
                      <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30 p-3">
                        <img
                          src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                          alt="Voyage Passport"
                          className="w-full h-full object-contain brightness-0 invert"
                        />
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-left">
                      <div className="text-base font-semibold uppercase tracking-wide text-white mb-1 drop-shadow-md">
                        Voyage Passport
                      </div>
                      <div className="text-sm text-white/95 font-light drop-shadow">
                        Your rewards & exclusive benefits
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* Featured Offers - Responsive Layout */}
          <section className={`flex-shrink-0 px-4 pt-4 pb-2 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-light uppercase tracking-wide text-gray-700">Featured Offers</h2>
              {featuredOffers.length >= 3 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollOffers('left')}
                    className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors border border-gray-200"
                    aria-label="Previous offer"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollOffers('right')}
                    className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors border border-gray-200"
                    aria-label="Next offer"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {isLoadingOffers ? (
              <div className="flex items-center justify-center h-[180px] bg-white/50 rounded-xl">
                <div className="text-sm text-gray-500">Loading offers...</div>
              </div>
            ) : featuredOffers.length > 0 ? (
              <div
                ref={offersScrollRef}
                className={`flex gap-3 ${featuredOffers.length >= 3 ? 'overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 cursor-grab active:cursor-grabbing' : ''}`}
                style={featuredOffers.length >= 3 ? {
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  touchAction: 'pan-x'
                } : {}}
              >
                {featuredOffers.map((offer) => (
                  <a
                    key={offer.id}
                    href={offer.offerLink || 'https://www.cuvee.com/offers'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden shadow-md active:opacity-80 transition-opacity flex-shrink-0 snap-start"
                    style={
                      featuredOffers.length === 1
                        ? { width: '100%', height: '180px' }
                        : featuredOffers.length === 2
                        ? { width: 'calc(50% - 6px)', height: '180px' }
                        : { minWidth: 'calc(70% - 6px)', height: '180px' }
                    }
                  >
                    <div className="relative w-full h-full">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-gray-200"
                        style={{
                          backgroundImage: offer.featuredImage
                            ? `url(${offer.featuredImage})`
                            : 'url(https://www.cuvee.com/wp-content/uploads/2024/07/header-usa.webp)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
                        {offer.offerType && (
                          <div className="absolute top-3 right-3 bg-[#D4AF37] text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
                            {offer.offerType}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-1">
                            {offer.offerTitle}
                          </h3>
                          {offer.offerSubtitle && (
                            <p className="text-[11px] text-white/90 font-light">{offer.offerSubtitle}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[180px] bg-white/50 rounded-xl">
                <div className="text-sm text-gray-500">No featured offers available</div>
              </div>
            )}
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
          </section>

          {/* Bottom CTA - Glassmorphism */}
          <section className={`flex-shrink-0 px-4 py-4 pb-6 transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
