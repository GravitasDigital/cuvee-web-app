import { useState, useEffect } from 'react'
import { getUserInfo } from '../utils/auth'
import axios from 'axios'

interface VoyagePassportScreenProps {
  onBack: () => void
}

interface Tier {
  name: string
  threshold: number
  pointsMax?: number
  pointsLabel: string
  color: string
  signatureBenefit: string
  earnBackPercent: number
  maxCreditPerStay: number
  reward: string
  message: string
  isLegacy?: boolean
  inviteOnly?: boolean
  circleAccess?: string[]
}

interface VoyageData {
  voyage_points: number
  annual_spend: number
  voyage_bucks_earned: number
  tier_info: {
    current_tier: Tier | null
    next_tier: Tier | null
    progress_percentage: number
    points_to_next_tier: number
    is_circle: boolean
  }
  name: {
    first: string
    last: string
  }
}

const VoyagePassportScreen: React.FC<VoyagePassportScreenProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [voyageData, setVoyageData] = useState<VoyageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tiersExpanded, setTiersExpanded] = useState(false)
  const [howItWorksExpanded, setHowItWorksExpanded] = useState(false)

  // Fetch real voyage data from HubSpot
  useEffect(() => {
    const fetchVoyageData = async () => {
      try {
        const userInfo = getUserInfo()

        if (!userInfo || !userInfo.email) {
          // Fallback to demo mode if no email
          setIsLoadingData(false)
          setIsLoaded(true)
          return
        }

        // Call PHP API endpoint (served by PHP built-in server on port 8080)
        const response = await axios.get(`http://localhost:8080/api-voyage-passport.php?email=${encodeURIComponent(userInfo.email)}`)

        if (response.data.success) {
          setVoyageData(response.data)
        } else {
          setError(response.data.message || 'Failed to load voyage data')
        }
      } catch (err: any) {
        console.error('Error fetching voyage data:', err)
        setError(err.response?.data?.message || 'Failed to load voyage data')
      } finally {
        setIsLoadingData(false)
        setIsLoaded(true)
      }
    }

    fetchVoyageData()
  }, [])

  const tiers: Tier[] = [
    {
      name: 'Weekender',
      threshold: 0,
      pointsMax: 39999,
      pointsLabel: 'First Stay',
      color: '#e5e5e5',
      signatureBenefit: 'Personalized Welcome Ritual (curated to guest)',
      earnBackPercent: 1,
      maxCreditPerStay: 2500,
      reward: 'Earn 1% back in Voyage Bucks (up to $2,500 redeemable on your next stay)',
      message: 'Your journey with Cuvée begins with a personalized welcome experience and earning Voyage Bucks toward your next stay.'
    },
    {
      name: 'Explorer',
      threshold: 40000,
      pointsMax: 99999,
      pointsLabel: '40,000+ Voyage Points',
      color: '#8d93af',
      signatureBenefit: 'Travel Style Setup — guest preferences are remembered & auto-applied pre-arrival (pantry, pool, bedding, kids setup, beverage style)',
      earnBackPercent: 2,
      maxCreditPerStay: 5000,
      reward: 'Earn 2% back in Voyage Bucks (up to $5,000 redeemable on your next stay)',
      message: 'Your preferences are remembered and every stay becomes more seamless, earning you more Voyage Bucks.'
    },
    {
      name: 'Voyager',
      threshold: 100000,
      pointsMax: 249999,
      pointsLabel: '100,000+ Voyage Points',
      color: '#2c2f3f',
      signatureBenefit: 'One Signature Experience Per Year (chef dinner, boat day, wellness ritual, guided adventure, etc.)',
      earnBackPercent: 3,
      maxCreditPerStay: 7500,
      reward: 'Earn 3% back in Voyage Bucks (up to $7,500 redeemable on your next stay)',
      message: 'Your travels are becoming a tradition — and traditions should grow with greater rewards.'
    },
    {
      name: 'Jetsetter',
      threshold: 250000,
      pointsMax: 499999,
      pointsLabel: '250,000+ Voyage Points',
      color: '#77664c',
      signatureBenefit: 'Signature Experience Every Stay (tier includes a curated standout moment each trip)',
      earnBackPercent: 4,
      maxCreditPerStay: 10000,
      reward: 'Earn 4% back in Voyage Bucks (up to $10,000 redeemable on your next stay)',
      message: 'Every stay includes a curated signature moment crafted just for you and exceptional rewards.'
    },
    {
      name: 'Cuvée Circle',
      threshold: 500000,
      pointsLabel: '500,000+ Voyage Points',
      color: '#bda048',
      signatureBenefit: 'One Complimentary Night Per Year + First Access to New Villas + Peak Week Soft Holds + Private Invitations',
      earnBackPercent: 5,
      maxCreditPerStay: 15000,
      reward: 'Earn 5% back in Voyage Bucks (up to $15,000 redeemable on your next stay)',
      message: "You've arrived. This is the tier reserved for our most devoted travelers — the ones who return, stay longer, and live deeper into the world of Cuvée.",
      isLegacy: true,
      inviteOnly: true,
      circleAccess: [
        'One Complimentary Night Per Year',
        'First Access to New Villas',
        'Peak Week Soft Holds',
        'Private Invitations to exclusive events'
      ]
    }
  ]

  const getTierInfo = (lifetimePoints: number, annualSpend: number) => {
    let currentTier = null
    let nextTier = null

    // Find current tier based on LIFETIME points
    for (let i = 0; i < tiers.length; i++) {
      if (lifetimePoints >= tiers[i].threshold) {
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

    // Calculate progress based on lifetime voyage points vs tier thresholds
    let progressPercentage = 0
    let pointsToNext = 0

    if (nextTier && currentTier) {
      const tierRange = nextTier.threshold - currentTier.threshold
      const progressInRange = lifetimePoints - currentTier.threshold
      progressPercentage = Math.floor(Math.min((progressInRange / tierRange) * 100, 100))
      pointsToNext = nextTier.threshold - lifetimePoints
    } else if (nextTier && !currentTier) {
      progressPercentage = 0
      pointsToNext = nextTier.threshold
    }

    const isCircle = currentTier && currentTier.isLegacy

    // Calculate Voyage Bucks earned - use lifetime points as annual spend for demo
    const effectiveAnnualSpend = annualSpend > 0 ? annualSpend : lifetimePoints
    let voyageBucksEarned = 0
    let maxRedeemable = 0
    if (currentTier) {
      voyageBucksEarned = Math.floor(effectiveAnnualSpend * (currentTier.earnBackPercent / 100))
      maxRedeemable = currentTier.maxCreditPerStay
    }

    return {
      currentTier,
      nextTier,
      lifetimePoints,
      annualSpend: effectiveAnnualSpend,
      voyageBucksEarned,
      maxRedeemable,
      isCircle,
      progressPercentage,
      pointsToNext: Math.max(pointsToNext, 0)
    }
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Use real data if available, otherwise use demo data
  const mockLifetimePoints = 65000
  const mockAnnualSpend = 35000
  const useMockData = !voyageData

  const tierInfo = useMockData
    ? getTierInfo(mockLifetimePoints, mockAnnualSpend)
    : getTierInfo(voyageData.voyage_points, voyageData.annual_spend)

  const { currentTier, nextTier, lifetimePoints, annualSpend, voyageBucksEarned, isCircle, progressPercentage, pointsToNext } = tierInfo

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
            <h1 className="text-3xl font-thin uppercase tracking-wide">Voyage Passport</h1>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingData && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#bda048] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-lg">Loading your Voyage Passport...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoadingData && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Voyage Data</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoadingData && !error && (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
          {/* Data Display Mode Indicator (for testing) */}
          <div className="text-center mb-3">
            <div className={`inline-block text-xs py-1 px-3 rounded-full ${useMockData ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {useMockData ? '📋 Demo Mode (No email found)' : '✓ Live Data from HubSpot'}
              {voyageData && ` • ${voyageData.name.first} ${voyageData.name.last}`}
            </div>
          </div>

          {/* Passport Header */}
          <div className={`text-center mb-6 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="relative pt-20 pb-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20">
                <img
                  src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                  alt="Cuvée Seal"
                  className="w-full h-full object-contain opacity-95"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.1em] text-[#272B45] mb-2">
                The Cuvée Voyage
              </h1>
              <p className="text-base md:text-lg font-semibold text-[#272B45] max-w-3xl mx-auto px-6 py-4">
                Your journey earns rewards. Every dollar spent builds your tier and earns Voyage Bucks toward your next stay.
              </p>
            </div>
          </div>

          {/* Current Tier Card */}
          {currentTier ? (
            <div className={`bg-white rounded-xl shadow-xl p-6 mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ borderLeft: `4px solid ${currentTier.color}` }}>
              {/* Tier Badge */}
              <div className="text-center mb-4">
                {isCircle ? (
                  <div className="relative inline-block">
                    <div className="w-32 h-32 mx-auto mb-3">
                      <img
                        src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                        alt="Circle Seal"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold uppercase tracking-wider text-[#272B45]">
                        {currentTier.name}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">Legacy Tier</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="inline-block px-8 py-2 rounded-full text-lg font-bold uppercase tracking-widest shadow-lg"
                    style={{
                      backgroundColor: currentTier.color,
                      color: currentTier.name === 'Weekender' ? '#272B45' : '#fff'
                    }}
                  >
                    {currentTier.name}
                  </div>
                )}
              </div>

              {/* Dual Status Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-gray-300 rounded-xl overflow-hidden shadow-lg mb-4">
                <div className="bg-white p-5 text-center relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 opacity-[0.08]">
                    <img src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png" alt="" className="w-full h-full" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 relative z-10">
                    Voyage Bucks Earned
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 relative z-10">
                    ${formatNumber(voyageBucksEarned)}
                  </div>
                  <div className="text-xs text-gray-600 mb-2 relative z-10">
                    Available for Your Next Trip
                  </div>
                  {annualSpend > 0 ? (
                    <div className="inline-block bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow relative z-10">
                      From ${formatNumber(annualSpend)} spent this year ({currentTier.earnBackPercent}%)
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic relative z-10">Start traveling to earn</div>
                  )}
                </div>
                <div className="bg-white p-5 text-center relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 opacity-[0.08]">
                    <img src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png" alt="" className="w-full h-full" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 relative z-10">
                    Lifetime Voyage Points
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 relative z-10">
                    {formatNumber(lifetimePoints)}
                  </div>
                  <div className="text-xs text-gray-600 relative z-10">
                    Determines Your Tier
                  </div>
                </div>
              </div>

              {/* Tier Benefits */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4" style={{ borderLeft: `4px solid ${currentTier.color}` }}>
                <div className="text-xs font-bold uppercase tracking-wide text-center text-gray-800 mb-3">
                  Your Tier Benefits
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-800 mb-1">Signature Experience:</div>
                    <div className="text-xs text-gray-700 leading-relaxed">{currentTier.signatureBenefit}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800 mb-1">Voyage Bucks:</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      Earn {currentTier.earnBackPercent}% back on each stay (up to ${formatNumber(currentTier.maxCreditPerStay)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Circle Benefits */}
              {isCircle && currentTier.circleAccess && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4" style={{ borderLeft: `4px solid ${currentTier.color}` }}>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Circle Benefits Include:
                  </div>
                  <ul className="space-y-1">
                    {currentTier.circleAccess.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-gray-600 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Bar */}
              {!isCircle && nextTier && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <div className="text-base font-bold uppercase tracking-wide text-gray-800 text-center mb-4">
                    Progress to {nextTier.name}
                  </div>
                  <div className="relative h-8 bg-gray-300 rounded-full overflow-hidden mb-3 border border-gray-400">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: `${progressPercentage}%`,
                        background: currentTier.name === 'Weekender' ? '#999' : currentTier.color
                      }}
                    ></div>
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-800 z-10">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="text-sm text-center text-gray-600">
                    {formatNumber(pointsToNext)} more points to unlock
                  </div>
                </div>
              )}
            </div>
          ) : (
            // No tier yet - First stay
            <div className={`bg-white rounded-xl shadow-xl p-8 md:p-12 mb-12 transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ borderLeft: `4px solid ${nextTier?.color}` }}>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-light uppercase tracking-[0.1em] text-gray-800 mb-4">
                  Begin Your Voyage
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Your first Cuvée stay unlocks the {nextTier?.name} tier
                </p>
                <div className="max-w-lg mx-auto bg-white border-3 rounded-xl p-8" style={{ borderColor: nextTier?.color, borderWidth: '3px' }}>
                  <div
                    className="inline-block px-8 py-3 rounded-full text-lg font-semibold uppercase tracking-wide mb-6"
                    style={{
                      backgroundColor: nextTier?.color,
                      color: nextTier?.name === 'Weekender' ? '#272B45' : '#fff'
                    }}
                  >
                    {nextTier?.name}
                  </div>
                  <div className="text-left">
                    <div className="mb-4">
                      <div className="text-sm font-bold text-gray-800 mb-2">Signature Experience:</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{nextTier?.signatureBenefit}</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800 mb-2">Voyage Bucks:</div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Earn {nextTier?.earnBackPercent}% back (up to ${formatNumber(nextTier?.maxCreditPerStay || 0)} redeemable)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Voyage Tier Progress - Collapsible */}
          <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} mb-4`}>
            <details
              open={tiersExpanded}
              onToggle={(e) => setTiersExpanded((e.target as HTMLDetailsElement).open)}
              className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4"
              style={{ borderLeft: `4px solid ${currentTier?.color || '#666'}` }}
            >
              <summary className="font-semibold text-sm uppercase tracking-wide text-center text-gray-800 cursor-pointer list-none">
                Voyage Tier Progress
                <span className={`ml-2 inline-block transition-transform duration-300 ${tiersExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-gray-200">
                <div className="relative pl-12 max-w-3xl mx-auto">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-300 opacity-50"></div>

                  {/* Tier cards */}
                  <div className="space-y-3">
                    {tiers.map((tier, index) => {
                      const isCurrent = currentTier && tier.name === currentTier.name
                      const currentIndex = currentTier ? tiers.findIndex(t => t.name === currentTier.name) : -1
                      const isPast = currentIndex >= 0 && index < currentIndex
                      // const isFuture = !isCurrent && !isPast

                      return (
                        <div
                          key={tier.name}
                          className={`relative bg-white border-3 rounded-xl p-3 transition-all ${
                            isCurrent ? 'shadow-xl' : ''
                          } ${isPast ? 'opacity-60' : ''}`}
                          style={{
                            borderColor: tier.name === 'Weekender' ? '#ccc' : tier.color,
                            borderWidth: isCurrent ? '3px' : '2px',
                            borderLeft: `3px solid ${tier.name === 'Weekender' ? '#ccc' : tier.color}`
                          }}
                        >
                          {/* Timeline dot */}
                          <div
                            className={`absolute transform -translate-y-1/2 rounded-full transition-all ${
                              isCurrent
                                ? 'w-5 h-5 -left-[37px] top-1/2'
                                : isPast
                                ? 'w-3 h-3 -left-[32px] top-1/2'
                                : 'w-4 h-4 -left-[34px] top-1/2'
                            }`}
                            style={{
                              backgroundColor: isPast ? '#999' : isCurrent ? '#666' : '#fff',
                              border: `4px solid ${isPast ? '#999' : isCurrent ? '#666' : '#ddd'}`,
                              boxShadow: isCurrent ? '0 0 0 6px rgba(102, 102, 102, 0.2)' : 'none'
                            }}
                          ></div>

                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="inline-block px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
                              style={{
                                backgroundColor: tier.color,
                                color: tier.name === 'Weekender' ? '#272B45' : '#fff'
                              }}
                            >
                              {tier.name}
                              {tier.inviteOnly && <span className="text-xs opacity-90 ml-1">(Invite Only)</span>}
                            </div>
                            {isPast && <span className="text-gray-500 text-2xl font-bold">✓</span>}
                          </div>

                          {!isPast && (
                            <>
                              <div className="text-xs text-gray-600 font-semibold mb-3">{tier.pointsLabel}</div>

                              {isCurrent && (
                                <div
                                  className="inline-block px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide text-white mb-3"
                                  style={{ backgroundColor: tier.color }}
                                >
                                  Your Current Tier
                                </div>
                              )}

                              <div className="mb-3">
                                <div className="text-xs uppercase text-gray-400 font-semibold tracking-wide mb-1">
                                  Signature Experience
                                </div>
                                <div className="text-sm text-gray-800 leading-relaxed">
                                  {tier.signatureBenefit}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs uppercase text-gray-400 font-semibold tracking-wide mb-1">
                                  Earning Rate
                                </div>
                                <div className="text-sm font-semibold text-gray-800">
                                  {tier.earnBackPercent}% back{' '}
                                  <span className="font-normal text-gray-600 text-xs">
                                    (up to ${formatNumber(tier.maxCreditPerStay)})
                                  </span>
                                </div>
                              </div>

                              {tier.isLegacy && tier.circleAccess && (
                                <div className="mt-4 pt-4 border-t-2" style={{ borderColor: tier.color }}>
                                  <div className="text-xs uppercase text-gray-400 font-semibold tracking-wide mb-2">
                                    Circle Benefits:
                                  </div>
                                  <ul className="space-y-1">
                                    {tier.circleAccess.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                        <span className="text-gray-600">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* How It Works - Collapsible */}
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} mb-4`}>
            <details
              open={howItWorksExpanded}
              onToggle={(e) => setHowItWorksExpanded((e.target as HTMLDetailsElement).open)}
              className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4"
              style={{ borderLeft: `4px solid ${currentTier?.color || '#666'}` }}
            >
              <summary className="font-semibold text-sm uppercase tracking-wide text-center text-gray-800 cursor-pointer list-none">
                How It Works
                <span className={`ml-2 inline-block transition-transform duration-300 ${howItWorksExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm font-bold text-gray-800 mb-1">Voyage Points (Lifetime)</div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong>$1 = 1 Point</strong><br />
                      Determines tier • Never expires
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm font-bold text-gray-800 mb-1">Voyage Bucks (Annual)</div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Earn <strong>1–5% back</strong> based on tier<br />
                      Redeemable on next stay • <strong>Expires in 12 months</strong>
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong className="text-gray-800">Maintain Your Tier:</strong> Complete 1 stay every 12 months. If not, you move down one tier (Voyage Points remain).
                  </p>
                </div>
              </div>
            </details>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoyagePassportScreen
