'use client'

import React, { useState } from 'react'
import {
    Menu,
    X,
    Home,
    User,
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@/components/auth/UserProfile'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: React.ReactNode
    user?: any
    onLogout?: () => void
    activeTab?: string
    onTabChange?: (tab: string) => void
}

const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard overview' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your profile' },
    { id: 'courses', label: 'Courses', icon: BookOpen, description: 'Browse courses' },
    { id: 'planner', label: 'Planner', icon: Calendar, description: 'Semester planner' },
    { id: 'applications', label: 'Applications', icon: Target, description: 'Track transfer applications' },
    { id: 'pathways', label: 'Pathways', icon: TrendingUp, description: 'Transfer pathways' },
    { id: 'gpa-calculator', label: 'GPA Calculator', icon: FileText, description: 'Calculate your transfer GPA' },
]

export default function DashboardLayout({
    children,
    user,
    onLogout,
    activeTab = 'overview',
    onTabChange
}: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen)
    }

    const handleTabClick = (tabId: string) => {
        onTabChange?.(tabId)
        setMobileSidebarOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-16" : "w-64",
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!sidebarCollapsed && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">Transfer.ai</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="lg:flex hidden"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMobileSidebar}
                        className="lg:hidden"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                                title={sidebarCollapsed ? item.description : undefined}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-500")} />
                                {!sidebarCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    {user && (
                        <UserProfile
                            showDropdown={true}
                            onSignOut={onLogout}
                            className="w-full"
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}>
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMobileSidebar}
                                className="lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>

                            <div className="hidden lg:flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900">Transfer.ai</span>
                            </div>

                            <div className="hidden lg:block">
                                <h1 className="text-lg font-semibold text-gray-900">
                                    {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {sidebarItems.find(item => item.id === activeTab)?.description || 'Manage your transfer journey'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Settings</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
} 