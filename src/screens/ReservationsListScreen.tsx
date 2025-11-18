import { useState, useEffect, useRef } from 'react'
import VoyagePassportCard from '../components/VoyagePassportCard'
import { isGuestUser, getUserInfo } from '../utils/auth'

interface ReservationsListScreenProps {
  onBack: () => void
  onNavigate: (screen: string, reservationId?: string) => void
}

interface Reservation {
  id: string
  status: 'current' | 'upcoming' | 'past'
  propertyName: string
  location: string
  address: string
  startDate: string
  endDate: string
  checkInTime: string
  checkOutTime: string
  image: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
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

const ReservationsListScreen: React.FC<ReservationsListScreenProps> = ({ onBack, onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPastTripsExpanded, setIsPastTripsExpanded] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffer[]>([])
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)
  const offersScrollRef = useRef<HTMLDivElement>(null)

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)
        const userInfo = getUserInfo()

        if (!userInfo?.email) {
          console.warn('No email found in user info')
          setIsLoading(false)
          return
        }

        // Use relative URL in production, localhost in development
        const apiUrl = window.location.hostname === 'localhost'
          ? `http://localhost:8080/api/reservations?email=${encodeURIComponent(userInfo.email)}`
          : `/api/reservations?email=${encodeURIComponent(userInfo.email)}`

        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.success && data.reservations) {
          setReservations(data.reservations)
        } else {
          setError(data.message || 'Failed to load reservations')
        }
      } catch (err) {
        console.error('Error fetching reservations:', err)
        setError('Failed to load reservations from HubSpot')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [])

  // Trigger entrance animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fetch featured offers from WordPress
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Use relative URL in production, localhost in development
        const apiUrl = window.location.hostname === 'localhost'
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

  const scrollOffers = (direction: 'left' | 'right') => {
    if (offersScrollRef.current) {
      const scrollAmount = offersScrollRef.current.clientWidth * 0.75
      offersScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Filter reservations based on user type
  // Guest users only see current stay or next upcoming stay
  const isGuest = isGuestUser()

  let currentReservations = reservations.filter(r => r.status === 'current')
  let upcomingReservations = reservations.filter(r => r.status === 'upcoming')
  let pastReservations = reservations.filter(r => r.status === 'past')

  if (isGuest) {
    // For guests, show only current stay or next upcoming stay
    if (currentReservations.length > 0) {
      // If there's a current stay, show only that
      upcomingReservations = []
      pastReservations = []
    } else if (upcomingReservations.length > 0) {
      // If no current stay, show only the next upcoming reservation
      upcomingReservations = [upcomingReservations[0]]
      pastReservations = []
    } else {
      // No current or upcoming reservations
      pastReservations = []
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light uppercase tracking-wide bg-green-100 text-green-800 border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Current Stay
          </span>
        )
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light uppercase tracking-wide bg-blue-100 text-blue-800 border border-blue-200">
            Upcoming
          </span>
        )
      case 'past':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light uppercase tracking-wide bg-gray-100 text-gray-600 border border-gray-200">
            Past Trip
          </span>
        )
    }
  }

  const renderReservationCard = (reservation: Reservation, _index: number, delay: number) => (
    <div
      key={reservation.id}
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border border-gray-100 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${reservation.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="absolute top-3 right-3">
          {getStatusBadge(reservation.status)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-light uppercase tracking-wide text-[#1F2937] mb-2">
          {reservation.propertyName}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{reservation.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{reservation.startDate} - {reservation.endDate}</span>
        </div>

        <div className="flex gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-200">
          <span>{reservation.bedrooms} Bed</span>
          <span>{reservation.bathrooms} Bath</span>
          <span>{reservation.maxGuests} Guests</span>
        </div>

        <button
          onClick={() => onNavigate('reservation', reservation.id)}
          className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-lg font-light uppercase text-xs tracking-wide hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] ripple"
        >
          {reservation.status === 'past' ? 'View Details' : 'View Reservation'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1F2937]/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className={`relative flex items-center justify-center transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <button
              onClick={onBack}
              className="absolute left-0 hover:opacity-70 transition-opacity"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-thin uppercase tracking-wide">My Reservations</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pb-24">

        {/* Current Stay Section */}
        {currentReservations.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-sm font-light uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2 transition-all duration-700 delay-100 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              Current Stay
            </h2>
            <div className="space-y-4">
              {currentReservations.map((reservation, index) =>
                renderReservationCard(reservation, index, 200)
              )}
            </div>
          </div>
        )}

        {/* Voyage Passport Section */}
        <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <VoyagePassportCard showFullDetailsLink={true} />
        </div>

        {/* Upcoming Section */}
        {upcomingReservations.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-sm font-light uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2 transition-all duration-700 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              Upcoming Trips
            </h2>
            <div className="space-y-4">
              {upcomingReservations.map((reservation, index) =>
                renderReservationCard(reservation, index, 400 + (index * 100))
              )}
            </div>
          </div>
        )}

        {/* Past Section - Collapsible */}
        {pastReservations.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setIsPastTripsExpanded(!isPastTripsExpanded)}
              className={`w-full text-left text-sm font-light uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2 transition-all duration-700 delay-400 hover:text-gray-800 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isPastTripsExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              Past Trips ({pastReservations.length})
            </button>
            {isPastTripsExpanded && (
              <div className="space-y-4">
                {pastReservations.map((reservation, index) =>
                  renderReservationCard(reservation, index, 500 + (index * 100))
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-light uppercase tracking-wide text-gray-600 mb-2">Loading Reservations...</h3>
            <p className="text-gray-500 text-sm">Fetching your stays from HubSpot</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-light uppercase tracking-wide text-gray-600 mb-2">Error Loading Reservations</h3>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State (if no reservations) */}
        {!isLoading && !error && reservations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-light uppercase tracking-wide text-gray-600 mb-2">No Reservations Yet</h3>
            <p className="text-gray-500 text-sm">Start planning your luxury getaway</p>
          </div>
        )}

        {/* Featured Offers Section - Strong CTA */}
        {!isLoading && !error && (
          <div className={`mb-8 transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#C0A062]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#D4AF37]/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-light uppercase tracking-wide text-gray-800 mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Exclusive Offers
                  </h2>
                  <p className="text-xs text-gray-600">Special deals curated for you</p>
                </div>
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
                <div className="flex items-center justify-center h-[200px] bg-white/50 rounded-xl">
                  <div className="text-sm text-gray-500">Loading offers...</div>
                </div>
              ) : featuredOffers.length > 0 ? (
                <div
                  ref={offersScrollRef}
                  className={`flex gap-3 ${featuredOffers.length >= 3 ? 'overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing' : ''}`}
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
                      className="block rounded-xl overflow-hidden shadow-lg active:opacity-80 transition-all hover:shadow-2xl hover:scale-[1.02] flex-shrink-0 snap-start"
                      style={
                        featuredOffers.length === 1
                          ? { width: '100%', height: '200px' }
                          : featuredOffers.length === 2
                          ? { width: 'calc(50% - 6px)', height: '200px' }
                          : { minWidth: 'calc(85% - 12px)', height: '200px' }
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
                          {offer.offerType && (
                            <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg">
                              {offer.offerType}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                            <h3 className="text-base font-semibold uppercase tracking-wide text-white mb-2 drop-shadow-lg">
                              {offer.offerTitle}
                            </h3>
                            {offer.offerSubtitle && (
                              <p className="text-sm text-white/95 font-light drop-shadow-md mb-3">
                                {offer.offerSubtitle}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-white/90 text-xs font-light">
                              <span>Learn More</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] bg-white/50 rounded-xl">
                  <div className="text-sm text-gray-500">No featured offers available</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add ripple effect styles */}
        <style>{`
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
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, 30px) scale(1.1); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-30px, -30px) scale(1.1); }
          }
          .animate-float { animation: float 20s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  )
}

export default ReservationsListScreen
