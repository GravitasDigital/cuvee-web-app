import { useState, useEffect } from 'react'

interface FeaturedOffer {
  id: number
  title: string
  content: string
  featuredImage: string
  offerTitle: string
  offerSubtitle: string
  offerType: string
  offerLink: string
}

interface FeaturedOffersScreenProps {
  onBack: () => void
}

function FeaturedOffersScreen({ onBack }: FeaturedOffersScreenProps) {
  const [offers, setOffers] = useState<FeaturedOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.MODE === 'development'
        ? 'http://localhost:8080/api/featured-offers'
        : '/api/featured-offers'

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success && data.offers) {
        setOffers(data.offers)
      } else {
        setError('Failed to load offers')
      }
    } catch (err) {
      console.error('Error fetching offers:', err)
      setError('Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  const stripHtml = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c2f3f] to-[#1a1c28]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="px-6 py-4 flex items-center">
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-light text-white ml-4">Featured Offers</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
            <p className="text-white/60 mt-4">Loading offers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No offers available at this time.</p>
          </div>
        )}

        {!loading && offers.length > 0 && (
          <div className="space-y-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Featured Image */}
                {offer.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={offer.featuredImage}
                      alt={offer.offerTitle || offer.title}
                      className="w-full h-full object-cover"
                    />
                    {offer.offerType && (
                      <div className="absolute top-4 left-4 bg-[#bda048] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {offer.offerType}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-light text-white mb-2">
                    {offer.offerTitle || offer.title}
                  </h2>

                  {offer.offerSubtitle && (
                    <p className="text-white/70 mb-4">{offer.offerSubtitle}</p>
                  )}

                  {offer.content && (
                    <div className="text-white/60 mb-4 line-clamp-3">
                      {stripHtml(offer.content)}
                    </div>
                  )}

                  {offer.offerLink && (
                    <a
                      href={offer.offerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#bda048] hover:bg-[#d4b55c] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedOffersScreen
