import { useState } from 'react'

interface PreferenceCenterProps {
  initialPreferences?: any
  onSave: (preferences: any) => void
  onBack: () => void
}

const PreferenceCenter: React.FC<PreferenceCenterProps> = ({
  initialPreferences = {},
  onSave,
  onBack,
}) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    initialPreferences.destinations || []
  )
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    initialPreferences.activities || []
  )
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>(
    initialPreferences.accommodation || []
  )
  const [selectedDietary, setSelectedDietary] = useState<string[]>(
    initialPreferences.dietary || []
  )
  const [travelStyle, setTravelStyle] = useState<string>(
    initialPreferences.travelStyle || ''
  )
  const [budget, setBudget] = useState<string>(initialPreferences.budget || '')
  const [notifications, setNotifications] = useState<boolean>(
    initialPreferences.notifications || false
  )

  const destinationOptions = [
    'Beach & Islands', 'Mountains & Ski', 'City & Urban', 'Countryside',
    'Safari & Wildlife', 'Desert', 'Tropical',
  ]

  const activityOptions = [
    'Culinary Experiences', 'Wellness & Spa', 'Adventure Sports', 'Cultural Tours',
    'Water Sports', 'Golf', 'Wine & Spirits', 'Shopping', 'Nightlife',
  ]

  const accommodationOptions = [
    'Beachfront', 'Mountain View', 'City Center', 'Private Island',
    'Ski-in/Ski-out', 'Golf Course', 'Vineyard',
  ]

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Kosher', 'Halal', 'Nut Allergies', 'Shellfish Allergies',
  ]

  const travelStyleOptions = ['Luxury', 'Adventure', 'Relaxation', 'Family-Friendly', 'Romantic']
  const budgetOptions = ['Premium', 'Luxury', 'Ultra-Luxury']

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const handleSave = () => {
    const preferences = {
      destinations: selectedDestinations,
      activities: selectedActivities,
      accommodation: selectedAccommodation,
      dietary: selectedDietary,
      travelStyle,
      budget,
      notifications,
    }
    onSave(preferences)
  }

  const renderSelectionGrid = (
    options: string[],
    selected: string[] | string,
    onSelect: (item: string) => void,
    multiSelect = true
  ) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {options.map(option => {
          const isSelected = multiSelect
            ? (selected as string[]).includes(option)
            : selected === option

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`px-4 py-3 rounded-lg font-light text-sm transition-all text-left ${
                isSelected
                  ? 'bg-[#D4AF37] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="tracking-wide">{option}</span>
                {isSelected && (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(243,244,246)]">
      <div className="max-w-7xl mx-auto p-6 pb-32">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="uppercase text-sm tracking-wide font-light">Return</span>
        </button>

        <h1 className="text-3xl font-thin uppercase tracking-wide mb-8">Travel Preferences</h1>

        <div className="space-y-6">
          {/* Destinations */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Destination Preferences
            </h2>
            {renderSelectionGrid(
              destinationOptions,
              selectedDestinations,
              (item) => toggleSelection(item, selectedDestinations, setSelectedDestinations)
            )}
          </section>

          {/* Activities */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Activities & Experiences
            </h2>
            {renderSelectionGrid(
              activityOptions,
              selectedActivities,
              (item) => toggleSelection(item, selectedActivities, setSelectedActivities)
            )}
          </section>

          {/* Accommodation */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Accommodation Preferences
            </h2>
            {renderSelectionGrid(
              accommodationOptions,
              selectedAccommodation,
              (item) => toggleSelection(item, selectedAccommodation, setSelectedAccommodation)
            )}
          </section>

          {/* Dietary */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Dietary & Allergies
            </h2>
            {renderSelectionGrid(
              dietaryOptions,
              selectedDietary,
              (item) => toggleSelection(item, selectedDietary, setSelectedDietary)
            )}
          </section>

          {/* Travel Style */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Travel Style
            </h2>
            {renderSelectionGrid(
              travelStyleOptions,
              travelStyle,
              (item) => setTravelStyle(item),
              false
            )}
          </section>

          {/* Budget */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-4">
              Budget Preference
            </h2>
            {renderSelectionGrid(
              budgetOptions,
              budget,
              (item) => setBudget(item),
              false
            )}
          </section>

          {/* Notifications Toggle */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light uppercase tracking-wide text-[#1F2937] mb-1">
                  Personalized Offers
                </h3>
                <p className="text-gray-600 text-sm">
                  Receive curated offers based on your preferences
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-8 w-16 flex-shrink-0 items-center rounded-full transition-colors ${
                  notifications ? 'bg-[#D4AF37]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                    notifications ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Save Button - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={handleSave}
              className="w-full bg-[#D4AF37] text-white py-3 rounded font-light text-base uppercase tracking-wide hover:bg-[#C4A137] transition-colors"
            >
              Save My Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferenceCenter
