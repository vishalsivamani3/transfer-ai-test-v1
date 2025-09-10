# Authentication System

A modular, robust authentication system built with React, TypeScript, and Supabase that gracefully handles auth failures without breaking core functionality.

## Features

- 🔐 **Secure Authentication** - Built on Supabase Auth
- 🛡️ **Error Boundaries** - Graceful handling of auth failures
- 🎯 **HOCs & Guards** - Easy component protection
- 📱 **Responsive UI** - Modern, accessible components
- 🔄 **State Management** - Centralized auth state
- 🧪 **Development Mode** - Mock users for testing
- ⚡ **Performance** - Optimized with React Context

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from '@/components/auth'

function App() {
  return (
    <AuthProvider>
      <YourAppContent />
    </AuthProvider>
  )
}
```

### 2. Use auth hooks in components

```tsx
import { useAuth, useAuthState, useAuthActions } from '@/components/auth'

function MyComponent() {
  const { state } = useAuth()
  const { signIn, signOut } = useAuthActions()
  
  if (state.isAuthenticated) {
    return <div>Welcome, {state.user?.email}!</div>
  }
  
  return <div>Please sign in</div>
}
```

### 3. Protect components with guards

```tsx
import { AuthGuard } from '@/components/auth'

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>This content is only for authenticated users</div>
    </AuthGuard>
  )
}
```

## Components

### AuthProvider
The main context provider that manages authentication state.

```tsx
<AuthProvider fallbackUser={mockUser}>
  <App />
</AuthProvider>
```

**Props:**
- `children` - React children
- `fallbackUser` - Optional mock user for development

### AuthGuard
Protects components based on authentication state.

```tsx
<AuthGuard 
  requireAuth={true}
  fallback={<div>Please sign in</div>}
  onUnauthorized={() => console.log('User not authenticated')}
>
  <ProtectedContent />
</AuthGuard>
```

**Props:**
- `children` - Content to protect
- `requireAuth` - Whether authentication is required (default: true)
- `fallback` - Content to show when auth fails
- `redirectTo` - URL to redirect to when unauthorized
- `onUnauthorized` - Callback when user is not authenticated

### AuthModal
Modal component with login and signup forms.

```tsx
<AuthModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTab="login"
  onSuccess={() => console.log('Auth successful')}
/>
```

### UserProfile
User profile component with dropdown menu.

```tsx
<UserProfile 
  showDropdown={true}
  onEditProfile={() => console.log('Edit profile')}
  onSignOut={() => console.log('Sign out')}
/>
```

## Hooks

### useAuth()
Returns both state and actions.

```tsx
const { state, actions } = useAuth()
```

### useAuthState()
Returns only authentication state.

```tsx
const { user, isAuthenticated, loading, error } = useAuthState()
```

### useAuthActions()
Returns only authentication actions.

```tsx
const { signIn, signOut, signUp, updateProfile } = useAuthActions()
```

## HOCs (Higher-Order Components)

### withAuthGuard()
Wraps a component with authentication guard.

```tsx
const ProtectedComponent = withAuthGuard(MyComponent, {
  requireAuth: true,
  fallback: <div>Please sign in</div>
})
```

### withOptionalAuth()
Shows different content based on auth state.

```tsx
const ConditionalComponent = withOptionalAuth(
  AuthenticatedComponent,
  UnauthenticatedComponent
)
```

### withAuthErrorBoundary()
Wraps component with error boundary for auth failures.

```tsx
const SafeComponent = withAuthErrorBoundary(MyComponent)
```

## Error Handling

The system includes comprehensive error handling:

1. **AuthErrorBoundary** - Catches auth-related errors
2. **Graceful Degradation** - App continues working even if auth fails
3. **User Feedback** - Clear error messages and recovery options
4. **Development Mode** - Detailed error information in dev environment

## Development Mode

For development and testing, you can use mock users:

```tsx
import { createMockUser } from '@/components/auth'

const mockUser = createMockUser({
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    currentCollege: 'Test College'
  }
})

<AuthProvider fallbackUser={mockUser}>
  <App />
</AuthProvider>
```

## Integration Examples

### Basic Integration
```tsx
import { AuthProvider, useAuth, AuthGuard } from '@/components/auth'

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}

function MainContent() {
  const { state } = useAuth()
  
  return (
    <div>
      {state.isAuthenticated ? (
        <AuthGuard requireAuth={true}>
          <Dashboard />
        </AuthGuard>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}
```

### Advanced Integration with Error Boundaries
```tsx
import { 
  AuthProvider, 
  AuthErrorBoundary, 
  withAuthGuard 
} from '@/components/auth'

const ProtectedDashboard = withAuthGuard(Dashboard, {
  requireAuth: true,
  fallback: <LoginPrompt />
})

function App() {
  return (
    <AuthProvider>
      <AuthErrorBoundary>
        <ProtectedDashboard />
      </AuthErrorBoundary>
    </AuthProvider>
  )
}
```

## Best Practices

1. **Always wrap your app** with `AuthProvider`
2. **Use error boundaries** for critical auth components
3. **Provide fallback content** for unauthenticated users
4. **Handle loading states** appropriately
5. **Use mock users** for development and testing
6. **Implement proper error handling** for auth failures

## Troubleshooting

### Common Issues

1. **"useAuth must be used within an AuthProvider"**
   - Make sure your component is wrapped with `AuthProvider`

2. **Auth not working in development**
   - Check your Supabase configuration
   - Use `fallbackUser` for testing

3. **Components not rendering**
   - Check if you're using `AuthGuard` correctly
   - Verify `requireAuth` prop is set appropriately

### Debug Mode

Enable debug logging by setting:
```tsx
localStorage.setItem('auth-debug', 'true')
```

This will log all auth state changes to the console.

## Security Considerations

- Never expose sensitive auth data in client-side code
- Always validate user permissions on the server
- Use HTTPS in production
- Implement proper session management
- Regularly update dependencies

## Contributing

When adding new auth features:

1. Follow the existing patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new functionality
5. Update this documentation