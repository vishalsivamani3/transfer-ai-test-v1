'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface SignupFormProps {
    onSuccess?: () => void
    onSwitchToLogin?: () => void
    className?: string
}

export function SignupForm({
    onSuccess,
    onSwitchToLogin,
    className
}: SignupFormProps) {
    const { actions, state } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        currentCollege: '',
        targetMajor: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all required fields')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        if (!agreeToTerms) {
            toast.error('Please agree to the terms and conditions')
            return
        }

        setIsSubmitting(true)

        try {
            const metadata = {
                full_name: formData.fullName,
                currentCollege: formData.currentCollege,
                targetMajor: formData.targetMajor
            }

            const result = await actions.signUp(formData.email, formData.password, metadata)

            if (result.success) {
                toast.success('Account created successfully! Please check your email to verify your account.')
                onSuccess?.()
            } else {
                toast.error(result.error || 'Signup failed')
            }
        } catch (error) {
            console.error('Signup error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        actions.clearError()
    }

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true)
        try {
            const result = await actions.signInWithGoogle()
            if (result.success) {
                toast.success('Redirecting to Google...')
                onSuccess?.()
            } else {
                toast.error(result.error || 'Failed to sign in with Google')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isPasswordValid = formData.password.length >= 6
    const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

    return (
        <Card className={className}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create account</CardTitle>
                <CardDescription className="text-center">
                    Sign up to start planning your transfer journey
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {state.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {state.error.message}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="pl-10"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currentCollege">Current College</Label>
                        <Input
                            id="currentCollege"
                            type="text"
                            placeholder="e.g., Santa Monica College"
                            value={formData.currentCollege}
                            onChange={(e) => handleInputChange('currentCollege', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetMajor">Target Major</Label>
                        <Input
                            id="targetMajor"
                            type="text"
                            placeholder="e.g., Computer Science"
                            value={formData.targetMajor}
                            onChange={(e) => handleInputChange('targetMajor', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="pl-10 pr-10"
                                required
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {formData.password && (
                            <div className="flex items-center gap-1 text-xs">
                                {isPasswordValid ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                <span className={isPasswordValid ? 'text-green-600' : 'text-red-600'}>
                                    At least 6 characters
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="pl-10 pr-10"
                                required
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {formData.confirmPassword && (
                            <div className="flex items-center gap-1 text-xs">
                                {doPasswordsMatch ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                                <span className={doPasswordsMatch ? 'text-green-600' : 'text-red-600'}>
                                    Passwords match
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreeToTerms}
                            onCheckedChange={setAgreeToTerms}
                            disabled={isSubmitting}
                        />
                        <Label htmlFor="terms" className="text-sm">
                            I agree to the{' '}
                            <Button type="button" variant="link" className="px-0 text-sm h-auto">
                                Terms of Service
                            </Button>{' '}
                            and{' '}
                            <Button type="button" variant="link" className="px-0 text-sm h-auto">
                                Privacy Policy
                            </Button>
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || state.loading || !isPasswordValid || !doPasswordsMatch || !agreeToTerms}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting || state.loading}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </Button>

                {onSwitchToLogin && (
                    <>
                        <Separator />
                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Button
                                type="button"
                                variant="link"
                                className="px-0"
                                onClick={onSwitchToLogin}
                                disabled={isSubmitting}
                            >
                                Sign in
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}