import { useState, useEffect } from 'react'
import { getUserInfo } from '../utils/auth'

interface ReservationDetailScreenProps {
  onBack: () => void
  onNavigate: (screen: string) => void
  reservationId?: string
}

interface ReservationData {
  id: string
  propertyName: string
  location: string
  address: string
  startDate: string
  endDate: string
  image: string
  checkInTime: string
  checkOutTime: string
  checkInDetails: string
  phone: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  wifi: string
  wifiPassword: string
  amount: number
  confirmationNumber: string
  status: string
}

const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({ onBack, onNavigate, reservationId }) => {
  const [reservation, setReservation] = useState<ReservationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(false)

  // Fetch reservation data from API
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setIsLoading(true)
        const userInfo = getUserInfo()

        if (!userInfo?.email) {
          setError('No user email found')
          setIsLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8080/api/reservations?email=${encodeURIComponent(userInfo.email)}`)
        const data = await response.json()

        if (data.success && data.reservations) {
          // Find the specific reservation by ID
          const foundReservation = data.reservations.find((r: any) => r.id === reservationId)

          if (foundReservation) {
            // Transform API data to match our interface
            setReservation({
              id: foundReservation.id,
              propertyName: foundReservation.propertyName,
              location: foundReservation.location || 'Location TBD',
              address: foundReservation.address || 'Address details will be provided closer to your stay',
              startDate: foundReservation.startDate,
              endDate: foundReservation.endDate,
              image: foundReservation.image,
              checkInTime: foundReservation.checkInTime,
              checkOutTime: foundReservation.checkOutTime,
              checkInDetails: 'Check-in details will be provided 48 hours before arrival.',
              phone: '+1 (970) 555-0100',
              bedrooms: foundReservation.bedrooms || 0,
              bathrooms: foundReservation.bathrooms || 0,
              maxGuests: foundReservation.maxGuests || 0,
              wifi: 'Network details will be provided upon arrival',
              wifiPassword: 'Provided at check-in',
              amount: foundReservation.amount,
              confirmationNumber: foundReservation.confirmationNumber || foundReservation.id,
              status: foundReservation.status
            })
          } else {
            setError('Reservation not found')
          }
        } else {
          setError(data.message || 'Failed to load reservation')
        }
      } catch (err) {
        console.error('Error fetching reservation:', err)
        setError('Failed to load reservation details')
      } finally {
        setIsLoading(false)
      }
    }

    if (reservationId) {
      fetchReservation()
    }
  }, [reservationId])

  // Fetch experiences from destination page on website
  useEffect(() => {
    const fetchExperiences = async () => {
      if (!reservation?.propertyName || !reservation?.location) return

      try {
        setIsLoadingExperiences(true)

        // Call backend API which will scrape the destination page for experiences
        const response = await fetch(
          `http://localhost:8080/api/property-experiences?propertyName=${encodeURIComponent(reservation.propertyName)}&location=${encodeURIComponent(reservation.location)}`
        )
        const data = await response.json()

        if (data.success && data.experiences) {
          setExperiences(data.experiences)
        }
      } catch (err) {
        console.error('Error fetching experiences:', err)
        // Fail silently - experiences are not critical
      } finally {
        setIsLoadingExperiences(false)
      }
    }

    fetchExperiences()
  }, [reservation?.propertyName, reservation?.location])

  const amenities = [
    'Private Hot Tub',
    'Heated Pool',
    'Ski-In/Ski-Out Access',
    'Gourmet Kitchen',
    'Home Theater',
    'Sauna & Steam Room',
    'Concierge Service',
    'Daily Housekeeping',
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(243,244,246)] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="mt-4 text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-[rgb(243,244,246)]">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="relative flex items-center justify-center">
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
        <div className="max-w-4xl mx-auto p-6 pb-24 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-light uppercase tracking-wide text-gray-600 mb-2">Error Loading Reservation</h3>
          <p className="text-gray-500 text-sm">{error || 'Reservation not found'}</p>
          <button
            onClick={onBack}
            className="mt-6 bg-[#1e3a5f] text-white px-6 py-3 rounded font-light uppercase text-sm tracking-wide hover:brightness-110 transition-all"
          >
            Back to Reservations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(243,244,246)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative flex items-center justify-between">
            <button
              onClick={onBack}
              className="absolute left-0 hover:opacity-70 transition-opacity"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-thin uppercase tracking-wide flex-1 text-center">My Reservations</h1>

            {/* Weather Widget - Will be dynamic in future */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-gray-200/50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6c0 4.314 6 10 6 10s6-5.686 6-10a6 6 0 00-6-6z"/>
                </svg>
                <div>
                  <div className="text-xs font-light text-gray-600">{reservation.location}</div>
                  <div className="text-sm font-normal text-gray-800">--°F</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* Property Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${reservation.image})` }}
          ></div>
          <div className="p-6">
            <h2 className="text-2xl font-light uppercase tracking-wide text-[#1F2937] mb-3">
              {reservation.propertyName}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base">{reservation.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-base">{reservation.startDate} - {reservation.endDate}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <span>{reservation.bedrooms} Bedrooms</span>
              <span>{reservation.bathrooms} Bathrooms</span>
              <span>Up to {reservation.maxGuests} Guests</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('itinerary')}
            className="bg-[#1e3a5f] text-white py-3 rounded text-center font-light uppercase text-sm tracking-wide hover:brightness-110 transition-all"
          >
            View Itinerary
          </button>
          <a
            href={`sms:${reservation.phone}`}
            className="bg-[#1e3a5f] text-white py-3 rounded text-center font-light uppercase text-sm tracking-wide hover:brightness-110 transition-all"
          >
            Contact Concierge
          </a>
        </div>

        {/* Property Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-6">
            Property Information
          </h3>

          {/* Address */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 mb-6 hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">Address</div>
              <span className="text-base text-gray-700">{reservation.address}</span>
            </div>
          </a>

          {/* WiFi */}
          <div className="flex items-start gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">WiFi</div>
              <div className="text-base text-gray-700">{reservation.wifi}</div>
              <div className="text-sm text-gray-600">Password: {reservation.wifiPassword}</div>
            </div>
          </div>

          {/* Check-in Details */}
          <div className="flex items-start gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">Check-in Instructions</div>
              <span className="text-base text-gray-700">{reservation.checkInDetails}</span>
            </div>
          </div>

          {/* Check-in/out Times */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">Check-in/out</div>
              <div className="text-base text-gray-700">
                <div className="flex gap-8 mb-1">
                  <span className="w-24">Arrival:</span>
                  <span>{reservation.checkInTime}</span>
                </div>
                <div className="flex gap-8">
                  <span className="w-24">Departure:</span>
                  <span>{reservation.checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Property Experiences - Horizontal Swipeable Carousel */}
        {experiences.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Curated Experiences
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Exclusive experiences available for this property
            </p>

            {/* Horizontal scrollable experience cards */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
              {experiences.map((experience, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg overflow-hidden snap-start hover:shadow-lg transition-shadow"
                >
                  {experience.image && (
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${experience.image})` }}
                    ></div>
                  )}
                  <div className="p-4">
                    <h4 className="text-base font-medium text-[#1F2937] mb-2">
                      {experience.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {experience.description}
                    </p>
                    {experience.price && (
                      <p className="text-sm font-medium text-[#D4AF37]">
                        From ${experience.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </div>
        )}

        {/* Placeholder when no experiences are available yet */}
        {!isLoadingExperiences && experiences.length === 0 && (
          <div className="bg-gradient-to-r from-[#1F2937] to-[#374151] rounded-lg p-6 text-center text-white mb-6">
            <h3 className="text-xl font-light uppercase tracking-wide mb-2">Curated Experiences Coming Soon</h3>
            <p className="text-gray-300 font-light text-sm">
              Property-specific experiences will be available here once we link your booking to the property page
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationDetailScreen
