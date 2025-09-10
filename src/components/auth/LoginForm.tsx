'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface LoginFormProps {
    onSuccess?: () => void
    onSwitchToSignup?: () => void
    onForgotPassword?: () => void
    className?: string
}

export function LoginForm({
    onSuccess,
    onSwitchToSignup,
    onForgotPassword,
    className
}: LoginFormProps) {
    const { actions, state } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await actions.signIn(formData.email, formData.password)

            if (result.success) {
                toast.success('Welcome back!')
                onSuccess?.()
            } else {
                toast.error(result.error || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        actions.clearError()
    }

    return (
        <Card className={className}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Sign in to your account to continue
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
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
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
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="remember" className="text-sm">
                                Remember me
                            </Label>
                        </div>
                        {onForgotPassword && (
                            <Button
                                type="button"
                                variant="link"
                                className="px-0 text-sm"
                                onClick={onForgotPassword}
                                disabled={isSubmitting}
                            >
                                Forgot password?
                            </Button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || state.loading}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>

                {onSwitchToSignup && (
                    <>
                        <Separator />
                        <div className="text-center text-sm">
                            Don't have an account?{' '}
                            <Button
                                type="button"
                                variant="link"
                                className="px-0"
                                onClick={onSwitchToSignup}
                                disabled={isSubmitting}
                            >
                                Sign up
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}