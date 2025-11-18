import { useEffect, useState } from 'react'
import { getUserInfo } from '../utils/auth'
import axios from 'axios'

interface VoyagePassportCardProps {
  className?: string
  showFullDetailsLink?: boolean
}

interface TierInfo {
  name: string
  threshold: number
  points_label: string
  color: string
  signature_benefit: string
  earn_back_percent: number
  max_credit_per_stay: number
  reward: string
  message: string
  is_legacy?: boolean
  circle_access?: string[]
}

interface VoyageData {
  voyage_points: number
  stay_count: number
  tier_info: {
    current_tier: TierInfo | null
    next_tier: TierInfo | null
    progress_percentage: number
    points_to_next_tier: number
    is_circle: boolean
  }
  name: {
    first: string
    last: string
  }
}

const VoyagePassportCard: React.FC<VoyagePassportCardProps> = ({ className = '', showFullDetailsLink = false }) => {
  const [voyageData, setVoyageData] = useState<VoyageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoyageData = async () => {
      try {
        const userInfo = getUserInfo()

        if (!userInfo || !userInfo.email) {
          setIsLoading(false)
          return
        }

        // Use relative URL in production, localhost in development
        const apiUrl = window.location.hostname === 'localhost'
          ? `http://localhost:8080/api-voyage-passport.php?email=${encodeURIComponent(userInfo.email)}`
          : `/api-voyage-passport.php?email=${encodeURIComponent(userInfo.email)}`

        const response = await axios.get(apiUrl)

        if (response.data.success) {
          setVoyageData(response.data)
        } else {
          setError('Unable to load rewards data')
        }
      } catch (err: any) {
        console.error('Error fetching voyage data:', err)
        setError('Failed to load rewards')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVoyageData()
  }, [])

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 border-[#C4A453] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading rewards...</p>
        </div>
      </div>
    )
  }

  if (error || !voyageData) {
    return null // Silently hide if no data
  }

  const { current_tier, next_tier, progress_percentage, points_to_next_tier, is_circle } = voyageData.tier_info
  const voyagePoints = voyageData.voyage_points

  // Calculate Voyage Bucks earned (simplified - assume annual spend = lifetime for demo)
  const annualSpend = voyagePoints
  const voyageBucksEarned = current_tier ? Math.floor(annualSpend * (current_tier.earn_back_percent / 100)) : 0

  if (!current_tier) {
    return null // No tier yet
  }

  const textColor = current_tier.name === 'Weekender' ? '#272B45' : '#fff'
  const progressBarColor = current_tier.name === 'Weekender' ? '#999' : current_tier.color

  return (
    <div className={`bg-white rounded-2xl shadow-xl border-l-4 p-6 ${className}`} style={{ borderLeftColor: current_tier.color }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img
            src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
            alt="Voyage Passport"
            className="w-10 h-10 opacity-90"
          />
          <h3 className="text-2xl font-light uppercase tracking-widest text-gray-800">
            Voyage Passport
          </h3>
        </div>
        <p className="text-sm text-gray-600">Your rewards journey with Cuvée</p>
      </div>

      {/* Tier Badge */}
      <div className="text-center mb-6">
        {is_circle ? (
          <div>
            <div className="w-32 h-32 mx-auto mb-3">
              <img
                src="https://www.cuvee.com/wp-content/uploads/2025/10/sealll.png"
                alt="Circle Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xl font-bold uppercase tracking-wider text-gray-800">{current_tier.name}</div>
            <div className="text-sm font-semibold text-gray-600 mt-1">Legacy Tier</div>
          </div>
        ) : (
          <div
            className="inline-block px-12 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg text-lg"
            style={{ backgroundColor: current_tier.color, color: textColor }}
          >
            {current_tier.name}
          </div>
        )}
      </div>

      {/* Dual Status Display */}
      <div className="grid grid-cols-2 gap-0.5 bg-gray-300 rounded-xl overflow-hidden mb-6 shadow-md">
        <div className="bg-white p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Voyage Bucks Earned</div>
          <div className="text-3xl font-bold text-gray-800 mb-1">${formatNumber(voyageBucksEarned)}</div>
          <div className="text-xs text-gray-600">Available for Your Next Trip</div>
          {annualSpend > 0 && (
            <div className="inline-block bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">
              From ${formatNumber(annualSpend)} spent ({current_tier.earn_back_percent}%)
            </div>
          )}
        </div>

        <div className="bg-white p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Lifetime Voyage Points</div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{formatNumber(voyagePoints)}</div>
          <div className="text-xs text-gray-600">Determines Your Tier</div>
        </div>
      </div>

      {/* Current Tier Benefits */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4" style={{ borderLeft: `4px solid ${current_tier.color}` }}>
        <div className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-3 text-center">Your Tier Benefits</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">Signature Experience:</div>
            <div className="text-sm text-gray-800">{current_tier.signature_benefit}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">Voyage Bucks:</div>
            <div className="text-sm text-gray-800">
              Earn {current_tier.earn_back_percent}% back on each stay (up to ${formatNumber(current_tier.max_credit_per_stay)})
            </div>
          </div>
        </div>
      </div>

      {/* Circle Benefits */}
      {is_circle && current_tier.circle_access && (
        <div className="bg-white border-2 rounded-lg p-4 mb-4" style={{ borderColor: current_tier.color }}>
          <div className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: current_tier.color }}>
            Circle Benefits Include:
          </div>
          <ul className="space-y-1">
            {current_tier.circle_access.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                <span style={{ color: current_tier.color }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress Bar */}
      {!is_circle && next_tier && (
        <div className="pt-4 border-t-2 border-gray-200">
          <div className="text-sm font-bold uppercase tracking-wide text-gray-700 text-center mb-3">
            Progress to {next_tier.name}
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${progress_percentage}%`,
                backgroundColor: progressBarColor
              }}
            ></div>
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-800">
              {Math.floor(progress_percentage)}%
            </span>
          </div>
          <div className="text-xs text-center text-gray-600">
            {formatNumber(points_to_next_tier)} more points to unlock
          </div>
        </div>
      )}

      {/* View Full Details Link */}
      {showFullDetailsLink && (
        <div className="mt-6 text-center">
          <a
            href="https://www.cuvee.com/voyage-passport/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#1e3a5f] hover:text-[#2d4a6f] font-light uppercase text-sm tracking-wide transition-colors"
          >
            View Full Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

export default VoyagePassportCard
