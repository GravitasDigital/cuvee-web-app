import { useState, useEffect } from 'react'
import DashboardScreen from './screens/DashboardScreen'
import LoginScreen from './screens/LoginScreen'
import ReservationsListScreen from './screens/ReservationsListScreen'
import ReservationDetailScreen from './screens/ReservationDetailScreen'
import ExperiencesScreen from './screens/ExperiencesScreen'
import PreferenceCenter from './components/PreferenceCenter'
import ItineraryScreen from './screens/ItineraryScreen'
import VoyagePassportScreen from './screens/VoyagePassportScreen'
import FeaturedOffersScreen from './screens/FeaturedOffersScreen'
import { isAuthenticated, setAuthToken, clearAuthToken } from './utils/auth'
import './App.css'

type Screen = 'dashboard' | 'login' | 'reservations' | 'reservation' | 'experiences' | 'preferences' | 'itinerary' | 'passport' | 'offers'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [selectedReservationId, setSelectedReservationId] = useState<string | undefined>(undefined)
  const [pendingNavigation, setPendingNavigation] = useState<{ screen: Screen; reservationId?: string } | null>(null)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated()
    setIsLoggedIn(authenticated)
  }, [])

  const handleLogin = (userData: {
    userType: 'profile' | 'guest'
    email?: string
    bookingNumber?: string
    lastName?: string
  }) => {
    setAuthToken(userData)
    setIsLoggedIn(true)

    // Navigate to pending screen after login, or default to reservations
    if (pendingNavigation) {
      setCurrentScreen(pendingNavigation.screen)
      if (pendingNavigation.reservationId) {
        setSelectedReservationId(pendingNavigation.reservationId)
      }
      setPendingNavigation(null)
    } else {
      setCurrentScreen('reservations')
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    setIsLoggedIn(false)
    setCurrentScreen('dashboard')
  }

  const handleNavigation = (screen: Screen, reservationId?: string) => {
    // Protected routes - require authentication
    const protectedRoutes: Screen[] = ['reservations', 'reservation']

    if (protectedRoutes.includes(screen) && !isLoggedIn) {
      // Store the intended destination and show login
      setPendingNavigation({ screen, reservationId })
      setCurrentScreen('login')
      return
    }

    // Allow navigation for public routes or authenticated users
    setCurrentScreen(screen)
    if (reservationId) {
      setSelectedReservationId(reservationId)
    }
  }

  // Show login screen when needed
  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} onBack={() => setCurrentScreen('dashboard')} />
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'reservations':
        return <ReservationsListScreen
          onBack={() => setCurrentScreen('dashboard')}
          onNavigate={(screen: string, reservationId?: string) => handleNavigation(screen as Screen, reservationId)}
        />
      case 'reservation':
        return <ReservationDetailScreen
          onBack={() => setCurrentScreen('reservations')}
          onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          reservationId={selectedReservationId}
        />
      case 'experiences':
        return <ExperiencesScreen onBack={() => setCurrentScreen('reservation')} />
      case 'preferences':
        return <PreferenceCenter
          onBack={() => setCurrentScreen('dashboard')}
          onSave={(prefs) => {
            console.log('Preferences saved:', prefs)
            alert('Your preferences have been saved. Our concierge team will curate personalized offers for you.')
            setCurrentScreen('dashboard')
          }}
        />
      case 'itinerary':
        return <ItineraryScreen onBack={() => setCurrentScreen('reservation')} />
      case 'passport':
        return <VoyagePassportScreen onBack={() => setCurrentScreen('dashboard')} />
      case 'offers':
        return <FeaturedOffersScreen onBack={() => setCurrentScreen('dashboard')} />
      default:
        return <DashboardScreen onNavigate={(screen: string) => handleNavigation(screen as Screen)} onLogout={handleLogout} />
    }
  }

  return <>{renderScreen()}</>
}

export default App
