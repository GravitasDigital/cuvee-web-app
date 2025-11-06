import { useState, useEffect } from 'react'

interface Experience {
  id: number
  name: string
  description: string
  category?: string
  added?: boolean
}

interface ExperiencesScreenProps {
  onBack: () => void
}

const ExperiencesScreen: React.FC<ExperiencesScreenProps> = ({ onBack }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const categories = ['all', 'culinary', 'wellness', 'adventure', 'culture']

  const mockExperiences: Experience[] = [
    {
      id: 1,
      name: 'Private Chef Experience',
      description: 'Indulge in a Michelin-star worthy dining experience with a private chef preparing a customized menu in your villa.',
      category: 'culinary',
    },
    {
      id: 2,
      name: 'Spa & Wellness Sanctuary',
      description: 'Surrender to tranquility with a full day of rejuvenation with personalized treatments.',
      category: 'wellness',
    },
    {
      id: 3,
      name: 'Helicopter Island Discovery',
      description: 'Soar above stunning coastlines and discover hidden beaches with private helicopter tour.',
      category: 'adventure',
    },
    {
      id: 4,
      name: 'Sommelier-Led Wine Journey',
      description: 'Embark on an intimate vineyard experience with a master sommelier.',
      category: 'culinary',
    },
    {
      id: 5,
      name: 'Cultural Heritage Experience',
      description: 'Explore historical landmarks with a distinguished cultural historian.',
      category: 'culture',
    },
    {
      id: 6,
      name: 'Sunset Yoga & Meditation',
      description: 'Find your inner peace with a private yoga instructor as the sun sets.',
      category: 'wellness',
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setExperiences(mockExperiences)
      setIsLoading(false)
    }, 300)
  }, [])

  const handleAddExperience = (id: number) => {
    setExperiences(
      experiences.map(exp =>
        exp.id === id ? { ...exp, added: true } : exp
      )
    )
  }

  const filteredExperiences = filter === 'all'
    ? experiences
    : experiences.filter(exp => exp.category?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="min-h-screen bg-[rgb(243,244,246)]">
      <div className="max-w-7xl mx-auto p-6 pb-24">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="uppercase text-sm tracking-wide font-light">Return</span>
        </button>

        <h1 className="text-3xl font-thin uppercase tracking-wide mb-8">Available Experiences</h1>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full font-light text-sm uppercase tracking-wide whitespace-nowrap transition-all ${
                filter === category
                  ? 'bg-[#D4AF37] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Experiences Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : filteredExperiences.length > 0 ? (
          <div className="space-y-4">
            {filteredExperiences.map(experience => (
              <div
                key={experience.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-light uppercase tracking-wide text-[#1F2937] mb-3">
                  {experience.name}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {experience.description}
                </p>
                {experience.added ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-light text-sm uppercase tracking-wide">Experience Requested</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddExperience(experience.id)}
                    className="bg-[#D4AF37] text-white px-6 py-2 rounded font-light uppercase text-sm tracking-wide hover:bg-[#C4A137] transition-colors"
                  >
                    Request Experience
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-light">No experiences available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExperiencesScreen
