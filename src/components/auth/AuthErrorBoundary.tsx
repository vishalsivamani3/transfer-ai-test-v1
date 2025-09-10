'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class AuthErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Auth Error Boundary caught an error:', error, errorInfo)

        this.setState({
            error,
            errorInfo
        })

        // Call the onError callback if provided
        this.props.onError?.(error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                Authentication Error
                            </CardTitle>
                            <CardDescription>
                                Something went wrong with the authentication system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    The authentication service encountered an error. You can still use the app in offline mode.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Button
                                    onClick={this.handleRetry}
                                    className="w-full"
                                    variant="default"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Home
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm text-gray-600">
                                        Error Details (Development)
                                    </summary>
                                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

// HOC to wrap components with error boundary
export function withAuthErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) {
    const WrappedComponent = (props: P) => (
        <AuthErrorBoundary fallback={fallback}>
            <Component {...props} />
        </AuthErrorBoundary>
    )

    WrappedComponent.displayName = `withAuthErrorBoundary(${Component.displayName || Component.name})`

    return WrappedComponent
}