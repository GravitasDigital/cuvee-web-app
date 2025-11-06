// Authentication utility functions

export type UserType = 'profile' | 'guest'

interface AuthToken {
  token: string
  userType: UserType
  email?: string
  bookingNumber?: string
  lastName?: string
  expiresAt: number
}

const AUTH_KEY = 'cuvee_auth_token'

// Store authentication token
export const setAuthToken = (userData: {
  userType: UserType
  email?: string
  bookingNumber?: string
  lastName?: string
}): void => {
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now

  const authData: AuthToken = {
    token: generateMockToken(),
    userType: userData.userType,
    email: userData.email,
    bookingNumber: userData.bookingNumber,
    lastName: userData.lastName,
    expiresAt,
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
}

// Get authentication token
export const getAuthToken = (): AuthToken | null => {
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) return null

    const authData: AuthToken = JSON.parse(stored)

    // Check if token is expired
    if (authData.expiresAt < Date.now()) {
      clearAuthToken()
      return null
    }

    return authData
  } catch (error) {
    console.error('Error parsing auth token:', error)
    return null
  }
}

// Remove authentication token
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_KEY)
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}

// Generate a mock JWT token (in production this comes from backend)
const generateMockToken = (): string => {
  const randomString = Math.random().toString(36).substring(2, 15)
  return `mock_jwt_${randomString}_${Date.now()}`
}

// Get user info from token
export const getUserInfo = (): {
  userType: UserType
  email?: string
  bookingNumber?: string
  lastName?: string
} | null => {
  const authData = getAuthToken()
  if (!authData) return null

  return {
    userType: authData.userType,
    email: authData.email,
    bookingNumber: authData.bookingNumber,
    lastName: authData.lastName,
  }
}

// Check if current user is a profile user
export const isProfileUser = (): boolean => {
  const userInfo = getUserInfo()
  return userInfo?.userType === 'profile'
}

// Check if current user is a guest user
export const isGuestUser = (): boolean => {
  const userInfo = getUserInfo()
  return userInfo?.userType === 'guest'
}
