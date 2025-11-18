interface ItineraryScreenProps {
  onBack: () => void
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ onBack }) => {
  return (
    <div className="h-screen bg-[rgb(243,244,246)] flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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
            <h1 className="text-3xl font-thin uppercase tracking-wide">Your Itinerary</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6 pb-6 overflow-hidden pt-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <iframe
            src="https://travefy.com/trip/6yw9rqyc2hqwqz2al3urnc3jqrjchvq"
            className="w-full h-full border-0"
            title="Itinerary"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export default ItineraryScreen
