// Auth Context and Hooks
export { AuthProvider, useAuth, useAuthState, useAuthActions, createMockUser } from '@/contexts/AuthContext'

// Auth Components
export { AuthGuard, withAuthGuard, withOptionalAuth } from './AuthGuard'
export { AuthErrorBoundary, withAuthErrorBoundary } from './AuthErrorBoundary'
export { LoginForm } from './LoginForm'
export { SignupForm } from './SignupForm'
export { AuthModal } from './AuthModal'
export { UserProfile, UserProfileCompact, UserProfileCard } from './UserProfile'
export { SettingsModal } from './SettingsModal'
export { default as ProfileSetupFlow } from './ProfileSetupFlow'
export { default as SettingsManagement } from './SettingsManagement'