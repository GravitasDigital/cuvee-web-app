interface ItineraryScreenProps {
  onBack: () => void
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ onBack }) => {
  return (
    <div className="h-screen bg-[rgb(243,244,246)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="uppercase text-sm tracking-wide font-light">Return</span>
        </button>
        <h1 className="text-3xl font-thin uppercase tracking-wide mb-4">Your Itinerary</h1>
      </div>
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <iframe
            src="https://travefy.com/trip/6yw9rqyc2hqwqz2al3urnc3jqrjchvq"
            className="w-full h-full"
            title="Itinerary"
          />
        </div>
      </div>
    </div>
  )
}

export default ItineraryScreen
