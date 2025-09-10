'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { X } from 'lucide-react'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'signup'
    onSuccess?: () => void
}

export function AuthModal({
    isOpen,
    onClose,
    defaultTab = 'login',
    onSuccess
}: AuthModalProps) {
    const [activeTab, setActiveTab] = useState(defaultTab)

    const handleSuccess = () => {
        onSuccess?.()
        onClose()
    }

    const handleSwitchToSignup = () => {
        setActiveTab('signup')
    }

    const handleSwitchToLogin = () => {
        setActiveTab('login')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Welcome to Transfer AI
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Sign in to your account or create a new one to get started
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="mt-6">
                        <LoginForm
                            onSuccess={handleSuccess}
                            onSwitchToSignup={handleSwitchToSignup}
                        />
                    </TabsContent>

                    <TabsContent value="signup" className="mt-6">
                        <SignupForm
                            onSuccess={handleSuccess}
                            onSwitchToLogin={handleSwitchToLogin}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}