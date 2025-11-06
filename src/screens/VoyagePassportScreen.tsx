import { useState, useEffect } from 'react'

interface VoyagePassportScreenProps {
  onBack: () => void
}

interface Tier {
  name: string
  threshold: number
  pointsMax?: number
  pointsLabel: string
  color: string
  reward: string
  message: string
  isLegacy?: boolean
  circleAccess?: string[]
  ongoingRewards?: string[]
}

const VoyagePassportScreen: React.FC<VoyagePassportScreenProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  // Mock voyage points for demo (in production, this would come from HubSpot)
  const mockVoyagePoints = 65000

  // Trigger entrance animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const tiers: Tier[] = [
    {
      name: 'The Weekender',
      threshold: 0,
      pointsLabel: 'Your first Cuvée stay',
      color: '#C0A062',
      reward: 'A private Cuvée-crafted experience (Chef-prepared dinner, wellness ritual, or signature adventure.)',
      message: 'A stay this special deserves a moment to match it — so we create one just for you.'
    },
    {
      name: 'The Explorer',
      threshold: 1,
      pointsMax: 39999,
      pointsLabel: 'Up to 40,000 Voyage Points',
      color: '#8B7355',
      reward: '$2,500 Voyage Bucks toward your next Cuvée stay',
      message: 'Your world is expanding. This is your invitation to return to the moments you didn\'t want to end.'
    },
    {
      name: 'The Voyager',
      threshold: 40000,
      pointsMax: 99999,
      pointsLabel: '40,000–99,999 Voyage Points',
      color: '#6B5D52',
      reward: '$5,000 Voyage Bucks toward your next Cuvée stay',
      message: 'Your travels are becoming a tradition — and traditions should grow.'
    },
    {
      name: 'The Jetsetter',
      threshold: 100000,
      pointsMax: 249999,
      pointsLabel: '100,000–249,999 Voyage Points',
      color: '#9C9C9C',
      reward: 'One complimentary night (Minimum 5-night stay · Value up to $7,500)',
      message: 'Some moments deserve more time — so we\'ve added one for you.'
    },
    {
      name: 'The Cuvée Circle',
      threshold: 250000,
      pointsLabel: '250,000+ Voyage Points',
      color: '#D4AF37',
      reward: '$10,000 Voyage Bucks toward your next stay',
      message: 'You\'ve arrived. This is the tier reserved for our most devoted travelers — the ones who return, stay longer, and live deeper into the world of Cuvée.',
      isLegacy: true,
      circleAccess: [
        'Invitations to private dinners, previews & hosted gatherings',
        'Priority access to peak dates and new property openings',
        'Dedicated Cuvée Circle support & itinerary design'
      ],
      ongoingRewards: [
        'For every 100,000 Voyage Points earned during your Circle Year → You receive 10,000 Voyage Bucks added toward your next stay.',
        'When you reach 500,000 Voyage Points, you unlock a complimentary 2-Night Weekender, added to any 7+ night stay (up to 15,000 value).'
      ]
    }
  ]

  const getTierInfo = (voyagePoints: number) => {
    let currentTier = null
    let nextTier = null

    // Find current tier based on points
    for (let i = 0; i < tiers.length; i++) {
      if (voyagePoints >= tiers[i].threshold) {
        currentTier = tiers[i]
      }
    }

    // Find next tier
    if (currentTier) {
      const currentIndex = tiers.indexOf(currentTier)
      if (currentIndex < tiers.length - 1) {
        nextTier = tiers[currentIndex + 1]
      }
    } else {
      nextTier = tiers[0]
    }

    // Calculate progress
    let progressPercentage = 0
    let pointsToNext = 0

    if (nextTier && currentTier) {
      const tierRange = nextTier.threshold - currentTier.threshold
      const progressInRange = voyagePoints - currentTier.threshold
      progressPercentage = Math.min((progressInRange / tierRange) * 100, 100)
      pointsToNext = nextTier.threshold - voyagePoints
    } else if (nextTier && !currentTier) {
      progressPercentage = 0
      pointsToNext = nextTier.threshold
    }

    const isCircle = currentTier && currentTier.isLegacy

    return {
      currentTier,
      nextTier,
      voyagePoints,
      isCircle,
      progressPercentage: Math.round(progressPercentage),
      pointsToNext: Math.max(pointsToNext, 0)
    }
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const tierInfo = getTierInfo(mockVoyagePoints)
  const { currentTier, nextTier, voyagePoints, isCircle, progressPercentage, pointsToNext } = tierInfo

  // Reverse tiers for display (highest first)
  const displayTiers = [...tiers].reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src="https://www.cuvee.com/wp-content/themes/cuvee/assets/img/logo.webp"
            alt="Cuvee"
            className="h-7"
          />
          <div className="w-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8">
        {/* Passport Header */}
        <div className={`text-center px-4 pt-8 pb-12 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          {/* Seal Icon */}
          <div className="w-28 h-28 mx-auto mb-6">
            <img
              src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
              alt="Cuvee Seal"
              className="w-full h-full object-contain opacity-95"
            />
          </div>

          <h1 className="text-3xl font-light uppercase tracking-[0.2em] text-gray-800 mb-4">
            The Cuvée Voyage Passport
          </h1>
          <p className="text-lg font-semibold text-gray-800 mb-3 max-w-xl mx-auto">
            Where every journey earns you more than memories.
          </p>
          <p className="text-base leading-relaxed text-gray-600 mb-3 max-w-2xl mx-auto">
            As you travel across Cuvée destinations, you collect Voyage Points that unlock signature experiences, travel credits, complimentary nights, and, eventually, access to The Cuvée Circle — our highest tier of belonging.
          </p>
          <p className="text-sm italic text-gray-500 max-w-xl mx-auto">
            This isn't a rewards program. It's a record of the stories you create with us.
          </p>
        </div>

        {/* Current Tier Card */}
        {currentTier && (
          <div className={`max-w-3xl mx-auto px-4 mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ borderWidth: '3px', borderColor: currentTier.color }}>
              <div className="p-6">
                {/* Tier Badge */}
                <div className="text-center mb-6">
                  {isCircle ? (
                    <div className="relative inline-block">
                      <div className="w-48 h-48 mx-auto mb-4">
                        <img
                          src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                          alt="Circle Seal"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold uppercase tracking-wider text-gray-800">
                          {currentTier.name}
                        </div>
                        <div className="text-sm font-semibold opacity-70 text-gray-600 mt-1">Legacy Tier</div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="inline-block px-12 py-4 rounded-full text-white text-xl font-bold uppercase tracking-widest shadow-lg"
                      style={{ backgroundColor: currentTier.color }}
                    >
                      {currentTier.name}
                    </div>
                  )}
                </div>

                {/* Voyage Points Display */}
                <div className="text-center py-6 mb-6 relative">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-[#C4A453]">{formatNumber(voyagePoints)}</span>
                    <span className="text-2xl font-light text-gray-600">Voyage Points</span>
                  </div>
                </div>

                {/* Tier Message */}
                <div className="text-center mb-8">
                  <p className="text-lg italic text-gray-700 leading-relaxed">
                    "{currentTier.message}"
                  </p>
                </div>

                {/* Current Reward */}
                <div className="space-y-4">
                  <div
                    className="p-6 rounded-xl text-white"
                    style={{
                      background: `linear-gradient(135deg, #C4A453 0%, #D4AF37 100%)`
                    }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide opacity-90 mb-2">Your Reward</div>
                    <div className="text-base font-medium leading-relaxed">{currentTier.reward}</div>
                  </div>

                  {/* Circle Benefits */}
                  {isCircle && currentTier.circleAccess && (
                    <>
                      <div className="border-2 rounded-xl p-6" style={{ borderColor: '#D4AF37' }}>
                        <div className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#D4AF37' }}>
                          Circle Access Includes:
                        </div>
                        <ul className="space-y-2">
                          {currentTier.circleAccess.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-[#D4AF37] text-lg flex-shrink-0">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {currentTier.ongoingRewards && (
                        <div
                          className="p-6 rounded-xl text-white"
                          style={{
                            background: `linear-gradient(135deg, #D4AF37 0%, #C0A062 100%)`
                          }}
                        >
                          <div className="text-sm font-bold uppercase tracking-wide mb-3 opacity-95">
                            Ongoing Rewards:
                          </div>
                          {currentTier.ongoingRewards.map((reward, index) => (
                            <p key={index} className="text-sm leading-relaxed mb-3 last:mb-0">
                              {reward}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Next Tier Preview */}
                  {!isCircle && nextTier && (
                    <div className="border-2 border-dashed rounded-xl p-6" style={{ borderColor: '#C0A062' }}>
                      <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#C0A062' }}>
                        Next: {nextTier.name}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 mb-2">{nextTier.pointsLabel}</div>
                      <div className="text-sm text-gray-700 leading-relaxed">{nextTier.reward}</div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {!isCircle && nextTier && (
                  <div className="mt-8 pt-8 border-t-2 border-gray-200">
                    <div className="text-center mb-4">
                      <div className="text-base font-bold uppercase tracking-wide text-gray-800">
                        Progress to {nextTier.name}
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-1000"
                        style={{
                          width: `${progressPercentage}%`,
                          background: 'linear-gradient(90deg, #C0A062 0%, #D4AF37 100%)'
                        }}
                      >
                        {progressPercentage}%
                      </div>
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      {formatNumber(pointsToNext)} more Voyage Points to unlock
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className={`max-w-3xl mx-auto px-4 mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-light uppercase tracking-[0.1em] text-center text-gray-800 mb-6">
              How It Works
            </h2>
            <div className="space-y-4 text-center text-gray-600">
              <p className="text-base leading-relaxed">1 Voyage Point = $1 Spent with Cuvée.</p>
              <p className="text-base leading-relaxed">
                Your points accumulate across all Cuvée stays during your Voyage Year (a rolling 12-month period). As your points grow, so do your rewards.
              </p>
              <p className="text-base leading-relaxed">Simply stay, earn, and return — the rewards unfold naturally.</p>
            </div>
          </div>
        </div>

        {/* All Tiers Overview */}
        <div className={`max-w-5xl mx-auto px-4 mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-2xl font-light uppercase tracking-[0.1em] text-center text-gray-800 mb-8">
              Your Voyage Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayTiers.map((tier) => {
                const isCurrent = currentTier && tier.name === currentTier.name
                const isLegacyTier = tier.isLegacy

                return (
                  <div
                    key={tier.name}
                    className={`bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${
                      isCurrent ? 'ring-4 shadow-lg' : 'hover:-translate-y-1'
                    } ${isLegacyTier ? 'md:col-span-2' : ''} relative`}
                    style={{
                      borderWidth: '3px',
                      borderColor: tier.color
                    }}
                  >
                    {isCurrent && (
                      <div
                        className="absolute -top-3 -right-3 px-4 py-1 rounded-full text-white text-xs font-bold uppercase shadow-lg"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        Your Current Tier
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <div
                        className="inline-block px-6 py-2 rounded-full text-white text-base font-bold uppercase tracking-wide mb-3"
                        style={{ backgroundColor: tier.color }}
                      >
                        {tier.name}
                        {isLegacyTier && <span className="ml-1">★</span>}
                      </div>
                      <div className="text-sm font-bold text-gray-600 mb-3">{tier.pointsLabel}</div>
                    </div>

                    <p className="text-sm italic text-gray-600 text-center mb-4 leading-relaxed">
                      {tier.message}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Reward:</div>
                        <div className="text-sm text-gray-800 font-medium leading-relaxed">{tier.reward}</div>
                      </div>

                      {isLegacyTier && tier.circleAccess && (
                        <>
                          <div className="pt-4 mt-4 border-t-2" style={{ borderColor: tier.color }}>
                            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: tier.color }}>
                              Circle Access Includes:
                            </div>
                            <ul className="space-y-1">
                              {tier.circleAccess.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                  <span style={{ color: tier.color }}>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {tier.ongoingRewards && (
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: tier.color }}>
                                Ongoing Rewards:
                              </div>
                              {tier.ongoingRewards.map((reward, index) => (
                                <p key={index} className="text-xs text-gray-600 leading-relaxed mb-2 last:mb-0">
                                  {reward}
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Keeping Your Status */}
        <div className={`max-w-3xl mx-auto px-4 mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-light uppercase tracking-[0.1em] text-center text-gray-800 mb-6">
              Keeping Your Status
            </h2>
            <div className="space-y-4 text-center text-gray-600">
              <p className="text-base leading-relaxed">Your Voyage Points refresh every 12 months.</p>
              <p className="text-base leading-relaxed">
                To maintain your tier, simply book your next Cuvée stay within 12 months of your last one. If more time passes, your tier will gently reset to the previous one.
              </p>
              <p className="text-base leading-relaxed">
                Voyage Bucks are applied after your stay completes and are used toward your next reservation.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Message */}
        <div className={`max-w-3xl mx-auto px-4 transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="text-center pt-12 pb-8 border-t-2 border-gray-300">
            <p className="text-xl font-semibold text-gray-800 mb-4">This is how travel becomes legacy.</p>
            <p className="text-base italic text-gray-500">Your Passport is not something you earn — It's something you live.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoyagePassportScreen
