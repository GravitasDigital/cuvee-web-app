interface ReservationDetailScreenProps {
  onBack: () => void
  onNavigate: (screen: string) => void
  reservationId?: string
}

interface ReservationData {
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
}

const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({ onBack, onNavigate, reservationId }) => {
  // Mock reservation data - in production this would come from an API
  const allReservations: Record<string, ReservationData> = {
    '1': {
      propertyName: 'Luxury Mountain Villa',
      location: 'Aspen, Colorado',
      address: '123 Mountain View Drive, Aspen, CO 81611',
      startDate: 'Dec 15, 2024',
      endDate: 'Dec 22, 2024',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=2070&auto=format&fit=crop',
      checkInTime: '4:00 PM',
      checkOutTime: '11:00 AM',
      checkInDetails: 'Keys will be available at the front desk. Please bring a valid ID.',
      phone: '+1 (970) 555-0123',
      bedrooms: 5,
      bathrooms: 5.5,
      maxGuests: 12,
      wifi: 'CuveeAspen_Guest',
      wifiPassword: 'LuxuryStay2025',
    },
    '2': {
      propertyName: 'Ocean View Paradise',
      location: 'Maui, Hawaii',
      address: '456 Beachfront Way, Wailea, HI 96753',
      startDate: 'Jan 10, 2025',
      endDate: 'Jan 17, 2025',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
      checkInTime: '3:00 PM',
      checkOutTime: '10:00 AM',
      checkInDetails: 'Self check-in with smart lock. Code will be sent 24 hours before arrival.',
      phone: '+1 (808) 555-0456',
      bedrooms: 4,
      bathrooms: 4,
      maxGuests: 10,
      wifi: 'CuveeMaui_Ocean',
      wifiPassword: 'Paradise2025',
    },
    '3': {
      propertyName: 'Desert Modern Retreat',
      location: 'Scottsdale, Arizona',
      address: '789 Cactus Canyon Road, Scottsdale, AZ 85255',
      startDate: 'Feb 14, 2025',
      endDate: 'Feb 21, 2025',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
      checkInTime: '4:00 PM',
      checkOutTime: '11:00 AM',
      checkInDetails: 'Meet the property manager at the entrance for personal check-in.',
      phone: '+1 (480) 555-0789',
      bedrooms: 6,
      bathrooms: 6,
      maxGuests: 14,
      wifi: 'CuveeScottsdale_Desert',
      wifiPassword: 'SunsetViews2025',
    },
    '4': {
      propertyName: 'Park City Ski Chalet',
      location: 'Park City, Utah',
      address: '321 Powder Lane, Park City, UT 84060',
      startDate: 'Nov 20, 2024',
      endDate: 'Nov 27, 2024',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
      checkInTime: '4:00 PM',
      checkOutTime: '11:00 AM',
      checkInDetails: 'Ski valet service available. Keys at main lodge reception.',
      phone: '+1 (435) 555-0321',
      bedrooms: 4,
      bathrooms: 4.5,
      maxGuests: 10,
      wifi: 'CuveeParkCity_Ski',
      wifiPassword: 'PowderDays2024',
    },
    '5': {
      propertyName: 'Coastal Villa Retreat',
      location: 'Big Sur, California',
      address: '555 Pacific Coast Highway, Big Sur, CA 93920',
      startDate: 'Oct 5, 2024',
      endDate: 'Oct 12, 2024',
      image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2025&auto=format&fit=crop',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      checkInDetails: 'Remote property - detailed directions will be sent prior to arrival.',
      phone: '+1 (831) 555-0555',
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 8,
      wifi: 'CuveeBigSur_Coast',
      wifiPassword: 'OceanBreeze2024',
    },
  }

  // Get the reservation data based on ID, default to first one if not found
  const mockReservation = allReservations[reservationId || '1'] || allReservations['1']

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

  const localRecommendations = [
    {
      category: 'Dining',
      items: [
        { name: 'Matsuhisa', description: 'World-class Japanese cuisine', distance: '0.3 mi' },
        { name: 'Element 47', description: 'Fine dining with mountain views', distance: '0.5 mi' },
        { name: 'Cache Cache', description: 'French bistro in downtown Aspen', distance: '1.2 mi' },
      ]
    },
    {
      category: 'Activities',
      items: [
        { name: 'Aspen Mountain', description: 'Premier ski resort', distance: '0.2 mi' },
        { name: 'Maroon Bells', description: 'Iconic hiking destination', distance: '10 mi' },
        { name: 'Aspen Art Museum', description: 'Contemporary art gallery', distance: '1.1 mi' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-[rgb(243,244,246)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 hover:opacity-70 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-thin uppercase tracking-wide">Welcome</h1>
          </div>

            {/* Weather Widget */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-gray-200/50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6c0 4.314 6 10 6 10s6-5.686 6-10a6 6 0 00-6-6z"/>
                </svg>
                <div>
                  <div className="text-xs font-light text-gray-600">Aspen, CO</div>
                  <div className="text-sm font-normal text-gray-800">72°F ☀️</div>
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
            style={{ backgroundImage: `url(${mockReservation.image})` }}
          ></div>
          <div className="p-6">
            <h2 className="text-2xl font-light uppercase tracking-wide text-[#1F2937] mb-3">
              {mockReservation.propertyName}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base">{mockReservation.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-base">{mockReservation.startDate} - {mockReservation.endDate}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <span>{mockReservation.bedrooms} Bedrooms</span>
              <span>{mockReservation.bathrooms} Bathrooms</span>
              <span>Up to {mockReservation.maxGuests} Guests</span>
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
            href={`sms:${mockReservation.phone}`}
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
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mockReservation.address)}`}
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
              <span className="text-base text-gray-700">{mockReservation.address}</span>
            </div>
          </a>

          {/* WiFi */}
          <div className="flex items-start gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">WiFi</div>
              <div className="text-base text-gray-700">{mockReservation.wifi}</div>
              <div className="text-sm text-gray-600">Password: {mockReservation.wifiPassword}</div>
            </div>
          </div>

          {/* Check-in Details */}
          <div className="flex items-start gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-light text-xs uppercase tracking-wide text-gray-500 mb-1">Check-in Instructions</div>
              <span className="text-base text-gray-700">{mockReservation.checkInDetails}</span>
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
                  <span>{mockReservation.checkInTime}</span>
                </div>
                <div className="flex gap-8">
                  <span className="w-24">Departure:</span>
                  <span>{mockReservation.checkOutTime}</span>
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

        {/* Local Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
            Local Recommendations
          </h3>
          {localRecommendations.map((section, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
              <h4 className="text-sm font-light uppercase tracking-wide text-gray-500 mb-3">
                {section.category}
              </h4>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-l-2 border-[#D4AF37] pl-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-light text-base text-[#1F2937]">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{item.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Experiences CTA */}
        <div className="bg-gradient-to-r from-[#1F2937] to-[#374151] rounded-lg p-6 text-center text-white">
          <h3 className="text-xl font-light uppercase tracking-wide mb-2">Enhance Your Stay</h3>
          <p className="text-gray-300 mb-4 font-light text-sm">
            Browse exclusive experiences curated for your destination
          </p>
          <button
            onClick={() => onNavigate('experiences')}
            className="bg-[#1e3a5f] text-white px-6 py-3 rounded font-light uppercase text-sm tracking-wide hover:brightness-110 transition-all"
          >
            Browse Experiences
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReservationDetailScreen
