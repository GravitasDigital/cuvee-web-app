import { useState, useEffect } from 'react'
import { isGuestUser } from '../utils/auth'

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
  onLogout?: () => void
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const isGuest = isGuestUser()

  // Trigger entrance animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const experiences = [
    {
      title: 'Culinary',
      description: 'CUVÉE CRAFTED EXPERIENCES, MICHELIN STAR WORTHY',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/07/BBQ-Beach-Dinner-mob.webp',
      link: 'https://www.cuvee.com/experiences/culinary/',
    },
    {
      title: 'Wellness',
      description: 'REJUVENATE YOUR MIND, BODY AND SPIRIT',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/08/exp-mud-tall.webp',
      link: 'https://www.cuvee.com/experiences/wellness-with-cuvee/',
    },
    {
      title: 'Adventure',
      description: 'EXPERIENCE THE WORLD IN HIGH DEFINITION',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/07/Oahu-Break-Mobile.webp',
      link: 'https://www.cuvee.com/experiences/adventure/',
    },
    {
      title: 'Culture',
      description: 'IMMERSE YOURSELF IN LOCAL CULTURE AND ART',
      image: 'https://www.cuvee.com/wp-content/uploads/2024/08/BBQ-Beach-Dinner-1-1-1-e1725011974523.webp',
      link: 'https://www.cuvee.com/experiences/culture-with-cuvee/',
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
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
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
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center ${index === currentSlide ? 'animate-kenburns' : ''}`}
                    style={{ backgroundImage: `url(${exp.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-12">
                      <div className="max-w-sm w-full transform transition-all duration-700">
                        <h3 className="text-3xl font-light uppercase tracking-widest mb-3 text-center drop-shadow-lg h-12 flex items-center justify-center">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-light tracking-wide opacity-90 text-center drop-shadow-md h-10 flex items-center justify-center">
                          {exp.description}
                        </p>
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

          {/* Reservation CTA with Property Preview - Glassmorphism */}
          <section className={`flex-shrink-0 px-4 pt-4 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button
              onClick={() => onNavigate('reservations')}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C4A137] text-white p-4 rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] ripple overflow-hidden relative"
            >
              <div className="flex items-center gap-4">
                {/* Property Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/30">
                  <img
                    src="https://www.cuvee.com/wp-content/uploads/2024/07/header-usa.webp"
                    alt="Your Property"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-light uppercase tracking-wide">My Reservations</div>
                  <div className="text-xs opacity-90 mt-1">View your stays & upcoming trips</div>
                </div>
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </section>

          {/* Voyage Passport CTA */}
          <section className={`flex-shrink-0 px-4 pt-4 transition-all duration-1000 delay-250 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button
              onClick={() => onNavigate('passport')}
              className="w-full bg-gradient-to-r from-[#C0A062] to-[#D4AF37] text-white p-4 rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] ripple overflow-hidden relative"
            >
              <div className="flex items-center gap-4">
                {/* Passport Icon */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-light uppercase tracking-wide">Voyage Passport</div>
                  <div className="text-xs opacity-90 mt-1">Your rewards & tier status</div>
                </div>
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </section>

          {/* Featured Destinations - Glassmorphism Cards */}
          <section className={`flex-shrink-0 px-4 pt-4 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-sm font-light uppercase tracking-wide mb-2 text-gray-700">Featured Destinations</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://www.cuvee.com/destinations/aspen-snowmass/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden aspect-video shadow-md active:opacity-80 transition-opacity"
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
                className="block rounded-xl overflow-hidden aspect-video shadow-md active:opacity-80 transition-opacity"
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
            </div>
          </section>

          {/* Bottom CTA - Glassmorphism */}
          <section className={`flex-shrink-0 px-4 py-4 mt-auto transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-r from-[#1F2937]/90 to-[#374151]/90 backdrop-blur-md rounded-xl p-4 text-center text-white shadow-lg border border-white/10">
              <h2 className="text-lg font-light uppercase tracking-wide mb-2">Ready to Explore?</h2>
              <div className="flex gap-2">
                <a
                  href="https://www.cuvee.com/results/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isGuest ? 'flex-1' : 'flex-1'} px-4 py-2 bg-[#D4AF37] text-white font-light uppercase text-xs tracking-wide rounded-lg hover:bg-[#C4A137] transition-all hover:scale-105 active:scale-95 ripple`}
                >
                  Properties
                </a>
                {!isGuest && (
                  <button
                    onClick={() => onNavigate('preferences')}
                    className="flex-1 px-4 py-2 bg-white text-[#1F2937] font-light uppercase text-xs tracking-wide rounded-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 ripple"
                  >
                    My Preferences
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardScreen
