'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
    PieChart,
    BarChart3,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Info,
    DollarSign,
    Calendar,
    Target,
    PiggyBank,
    CreditCard,
    Receipt,
    Plus,
    Minus,
    Edit,
    Trash2
} from 'lucide-react'

interface BudgetItem {
    id: string
    category: string
    subcategory: string
    amount: number
    frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time'
    priority: 'high' | 'medium' | 'low'
    dueDate?: string
    status: 'paid' | 'pending' | 'overdue'
    notes?: string
}

interface BudgetCategory {
    name: string
    color: string
    icon: React.ReactNode
    subcategories: string[]
}

interface SavingsGoal {
    id: string
    name: string
    targetAmount: number
    currentAmount: number
    targetDate: string
    priority: 'high' | 'medium' | 'low'
    description?: string
}

const BUDGET_CATEGORIES: BudgetCategory[] = [
    {
        name: 'Education',
        color: 'bg-blue-500',
        icon: <Target className="h-4 w-4" />,
        subcategories: ['Tuition', 'Fees', 'Books', 'Supplies', 'Application Fees', 'Test Fees']
    },
    {
        name: 'Housing',
        color: 'bg-green-500',
        icon: <Receipt className="h-4 w-4" />,
        subcategories: ['Rent', 'Utilities', 'Internet', 'Renters Insurance', 'Maintenance']
    },
    {
        name: 'Food',
        color: 'bg-orange-500',
        icon: <PiggyBank className="h-4 w-4" />,
        subcategories: ['Groceries', 'Dining Out', 'Meal Plans', 'Coffee', 'Snacks']
    },
    {
        name: 'Transportation',
        color: 'bg-purple-500',
        icon: <TrendingUp className="h-4 w-4" />,
        subcategories: ['Gas', 'Public Transit', 'Car Payment', 'Insurance', 'Maintenance', 'Parking']
    },
    {
        name: 'Personal',
        color: 'bg-pink-500',
        icon: <DollarSign className="h-4 w-4" />,
        subcategories: ['Clothing', 'Entertainment', 'Health', 'Personal Care', 'Gifts', 'Subscriptions']
    },
    {
        name: 'Income',
        color: 'bg-emerald-500',
        icon: <TrendingUp className="h-4 w-4" />,
        subcategories: ['Job', 'Financial Aid', 'Scholarships', 'Family Support', 'Side Hustle', 'Refunds']
    }
]

export default function BudgetingTableau() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
        {
            id: '1',
            category: 'Education',
            subcategory: 'Application Fees',
            amount: 500,
            frequency: 'one-time',
            priority: 'high',
            dueDate: '2024-11-30',
            status: 'pending',
            notes: 'UC and CSU applications'
        },
        {
            id: '2',
            category: 'Education',
            subcategory: 'Tuition',
            amount: 1200,
            frequency: 'annually',
            priority: 'high',
            dueDate: '2024-08-15',
            status: 'paid',
            notes: 'Community college tuition'
        },
        {
            id: '3',
            category: 'Housing',
            subcategory: 'Rent',
            amount: 800,
            frequency: 'monthly',
            priority: 'high',
            dueDate: '2024-12-01',
            status: 'pending',
            notes: 'Shared apartment'
        },
        {
            id: '4',
            category: 'Food',
            subcategory: 'Groceries',
            amount: 200,
            frequency: 'monthly',
            priority: 'high',
            dueDate: '2024-12-01',
            status: 'pending',
            notes: 'Monthly grocery budget'
        },
        {
            id: '5',
            category: 'Income',
            subcategory: 'Job',
            amount: 1200,
            frequency: 'monthly',
            priority: 'high',
            dueDate: '2024-12-15',
            status: 'pending',
            notes: 'Part-time job income'
        }
    ])

    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
        {
            id: '1',
            name: 'Transfer Application Fund',
            targetAmount: 1000,
            currentAmount: 300,
            targetDate: '2024-11-01',
            priority: 'high',
            description: 'Save for UC/CSU application fees and transcripts'
        },
        {
            id: '2',
            name: 'Emergency Fund',
            targetAmount: 2000,
            currentAmount: 800,
            targetDate: '2025-06-01',
            priority: 'medium',
            description: 'Emergency fund for unexpected expenses'
        },
        {
            id: '3',
            name: 'Transfer Moving Fund',
            targetAmount: 3000,
            currentAmount: 500,
            targetDate: '2025-08-01',
            priority: 'high',
            description: 'Moving expenses and first month rent at transfer school'
        }
    ])

    const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({
        category: '',
        subcategory: '',
        amount: 0,
        frequency: 'monthly',
        priority: 'medium',
        status: 'pending'
    })

    const [newSavingsGoal, setNewSavingsGoal] = useState<Partial<SavingsGoal>>({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        priority: 'medium'
    })

    const [activeTab, setActiveTab] = useState('overview')

    // Calculate budget summary
    const calculateBudgetSummary = () => {
        const monthlyIncome = budgetItems
            .filter(item => item.category === 'Income' && item.frequency === 'monthly')
            .reduce((sum, item) => sum + item.amount, 0)

        const monthlyExpenses = budgetItems
            .filter(item => item.category !== 'Income' && item.frequency === 'monthly')
            .reduce((sum, item) => sum + item.amount, 0)

        const annualIncome = budgetItems
            .filter(item => item.category === 'Income')
            .reduce((sum, item) => {
                const multiplier = item.frequency === 'monthly' ? 12 :
                    item.frequency === 'quarterly' ? 4 : 1
                return sum + (item.amount * multiplier)
            }, 0)

        const annualExpenses = budgetItems
            .filter(item => item.category !== 'Income')
            .reduce((sum, item) => {
                const multiplier = item.frequency === 'monthly' ? 12 :
                    item.frequency === 'quarterly' ? 4 : 1
                return sum + (item.amount * multiplier)
            }, 0)

        const netIncome = annualIncome - annualExpenses
        const monthlyNet = netIncome / 12

        return {
            monthlyIncome,
            monthlyExpenses,
            annualIncome,
            annualExpenses,
            netIncome,
            monthlyNet
        }
    }

    const budgetSummary = calculateBudgetSummary()

    // Calculate savings progress
    const calculateSavingsProgress = () => {
        const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
        const totalCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
        const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

        return {
            totalTarget,
            totalCurrent,
            progress,
            remaining: totalTarget - totalCurrent
        }
    }

    const savingsProgress = calculateSavingsProgress()

    // Calculate category breakdown
    const calculateCategoryBreakdown = () => {
        const breakdown: { [key: string]: number } = {}

        budgetItems.forEach(item => {
            if (item.category !== 'Income') {
                const multiplier = item.frequency === 'monthly' ? 12 :
                    item.frequency === 'quarterly' ? 4 : 1
                breakdown[item.category] = (breakdown[item.category] || 0) + (item.amount * multiplier)
            }
        })

        return breakdown
    }

    const categoryBreakdown = calculateCategoryBreakdown()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const addBudgetItem = () => {
        if (newBudgetItem.category && newBudgetItem.subcategory && newBudgetItem.amount) {
            const item: BudgetItem = {
                id: Date.now().toString(),
                category: newBudgetItem.category,
                subcategory: newBudgetItem.subcategory,
                amount: newBudgetItem.amount,
                frequency: newBudgetItem.frequency || 'monthly',
                priority: newBudgetItem.priority || 'medium',
                status: newBudgetItem.status || 'pending',
                dueDate: newBudgetItem.dueDate,
                notes: newBudgetItem.notes
            }
            setBudgetItems([...budgetItems, item])
            setNewBudgetItem({
                category: '',
                subcategory: '',
                amount: 0,
                frequency: 'monthly',
                priority: 'medium',
                status: 'pending'
            })
        }
    }

    const addSavingsGoal = () => {
        if (newSavingsGoal.name && newSavingsGoal.targetAmount && newSavingsGoal.targetDate) {
            const goal: SavingsGoal = {
                id: Date.now().toString(),
                name: newSavingsGoal.name,
                targetAmount: newSavingsGoal.targetAmount,
                currentAmount: newSavingsGoal.currentAmount || 0,
                targetDate: newSavingsGoal.targetDate,
                priority: newSavingsGoal.priority || 'medium',
                description: newSavingsGoal.description
            }
            setSavingsGoals([...savingsGoals, goal])
            setNewSavingsGoal({
                name: '',
                targetAmount: 0,
                currentAmount: 0,
                targetDate: '',
                priority: 'medium'
            })
        }
    }

    const updateSavingsGoal = (id: string, currentAmount: number) => {
        setSavingsGoals(goals =>
            goals.map(goal =>
                goal.id === id ? { ...goal, currentAmount } : goal
            )
        )
    }

    const deleteBudgetItem = (id: string) => {
        setBudgetItems(items => items.filter(item => item.id !== id))
    }

    const deleteSavingsGoal = (id: string) => {
        setSavingsGoals(goals => goals.filter(goal => goal.id !== id))
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'overdue': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Budgeting Tableau
                    </CardTitle>
                    <CardDescription>
                        Track your income, expenses, and savings goals to manage your transfer journey financially
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="budget">Budget</TabsTrigger>
                            <TabsTrigger value="savings">Savings</TabsTrigger>
                            <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Budget Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-green-600">Monthly Income</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(budgetSummary.monthlyIncome)}</div>
                                        <p className="text-xs text-gray-600">From all sources</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-red-600">Monthly Expenses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(budgetSummary.monthlyExpenses)}</div>
                                        <p className="text-xs text-gray-600">All monthly costs</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-blue-600">Monthly Net</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-2xl font-bold ${budgetSummary.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(budgetSummary.monthlyNet)}
                                        </div>
                                        <p className="text-xs text-gray-600">Income - Expenses</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Savings Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PiggyBank className="h-5 w-5" />
                                        Savings Goals Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Overall Progress</span>
                                            <span className="text-sm text-gray-600">
                                                {formatCurrency(savingsProgress.totalCurrent)} / {formatCurrency(savingsProgress.totalTarget)}
                                            </span>
                                        </div>
                                        <Progress value={savingsProgress.progress} className="h-2" />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {savingsGoals.map(goal => (
                                                <div key={goal.id} className="p-4 border rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-sm">{goal.name}</h4>
                                                        <Badge className={getPriorityColor(goal.priority)}>
                                                            {goal.priority}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                                                    </div>
                                                    <Progress
                                                        value={(goal.currentAmount / goal.targetAmount) * 100}
                                                        className="h-1 mb-2"
                                                    />
                                                    <div className="text-xs text-gray-500">
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Expenses */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Upcoming Expenses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {budgetItems
                                            .filter(item => item.status === 'pending' && item.dueDate)
                                            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                                            .slice(0, 5)
                                            .map(item => (
                                                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                    <div>
                                                        <div className="font-medium">{item.subcategory}</div>
                                                        <div className="text-sm text-gray-600">{item.category}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">{formatCurrency(item.amount)}</div>
                                                        <div className="text-sm text-gray-600">
                                                            Due: {new Date(item.dueDate!).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="budget" className="space-y-6">
                            {/* Add New Budget Item */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Add Budget Item
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <Select value={newBudgetItem.category} onValueChange={(value) => setNewBudgetItem(prev => ({ ...prev, category: value, subcategory: '' }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BUDGET_CATEGORIES.map(category => (
                                                        <SelectItem key={category.name} value={category.name}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="subcategory">Subcategory</Label>
                                            <Select value={newBudgetItem.subcategory} onValueChange={(value) => setNewBudgetItem(prev => ({ ...prev, subcategory: value }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select subcategory" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {newBudgetItem.category && BUDGET_CATEGORIES
                                                        .find(cat => cat.name === newBudgetItem.category)
                                                        ?.subcategories.map(sub => (
                                                            <SelectItem key={sub} value={sub}>
                                                                {sub}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={newBudgetItem.amount}
                                                onChange={(e) => setNewBudgetItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="frequency">Frequency</Label>
                                            <Select value={newBudgetItem.frequency} onValueChange={(value) => setNewBudgetItem(prev => ({ ...prev, frequency: value as any }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                                    <SelectItem value="annually">Annually</SelectItem>
                                                    <SelectItem value="one-time">One-time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <Label htmlFor="priority">Priority</Label>
                                            <Select value={newBudgetItem.priority} onValueChange={(value) => setNewBudgetItem(prev => ({ ...prev, priority: value as any }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input
                                                id="dueDate"
                                                type="date"
                                                value={newBudgetItem.dueDate}
                                                onChange={(e) => setNewBudgetItem(prev => ({ ...prev, dueDate: e.target.value }))}
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <Button onClick={addBudgetItem} className="w-full">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Item
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Budget Items List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Budget Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {budgetItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{item.subcategory}</span>
                                                        <Badge className={getPriorityColor(item.priority)}>
                                                            {item.priority}
                                                        </Badge>
                                                        <Badge className={getStatusColor(item.status)}>
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {item.category} • {item.frequency}
                                                        {item.dueDate && ` • Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                                                    </div>
                                                    {item.notes && (
                                                        <div className="text-xs text-gray-500 mt-1">{item.notes}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteBudgetItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="savings" className="space-y-6">
                            {/* Add New Savings Goal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Add Savings Goal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="goalName">Goal Name</Label>
                                            <Input
                                                id="goalName"
                                                value={newSavingsGoal.name}
                                                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="e.g., Transfer Fund"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="targetAmount">Target Amount</Label>
                                            <Input
                                                id="targetAmount"
                                                type="number"
                                                value={newSavingsGoal.targetAmount}
                                                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                                                placeholder="1000"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="currentAmount">Current Amount</Label>
                                            <Input
                                                id="currentAmount"
                                                type="number"
                                                value={newSavingsGoal.currentAmount}
                                                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, currentAmount: parseFloat(e.target.value) || 0 }))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="targetDate">Target Date</Label>
                                            <Input
                                                id="targetDate"
                                                type="date"
                                                value={newSavingsGoal.targetDate}
                                                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <Label htmlFor="priority">Priority</Label>
                                            <Select value={newSavingsGoal.priority} onValueChange={(value) => setNewSavingsGoal(prev => ({ ...prev, priority: value as any }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-end">
                                            <Button onClick={addSavingsGoal} className="w-full">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Goal
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Savings Goals List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Savings Goals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {savingsGoals.map(goal => (
                                            <div key={goal.id} className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium">{goal.name}</h4>
                                                            <Badge className={getPriorityColor(goal.priority)}>
                                                                {goal.priority}
                                                            </Badge>
                                                        </div>
                                                        {goal.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteSavingsGoal(goal.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                                                        <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                                                    </div>
                                                    <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                                                        <span>Remaining: {formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-3">
                                                    <Input
                                                        type="number"
                                                        placeholder="Add amount"
                                                        className="flex-1"
                                                        onChange={(e) => {
                                                            const amount = parseFloat(e.target.value) || 0
                                                            updateSavingsGoal(goal.id, goal.currentAmount + amount)
                                                            e.target.value = ''
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const amount = prompt('Enter amount to add:')
                                                            if (amount) {
                                                                updateSavingsGoal(goal.id, goal.currentAmount + parseFloat(amount))
                                                            }
                                                        }}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analysis" className="space-y-6">
                            {/* Category Breakdown */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Expense Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(categoryBreakdown).map(([category, amount]) => {
                                            const percentage = (amount / budgetSummary.annualExpenses) * 100
                                            const categoryData = BUDGET_CATEGORIES.find(cat => cat.name === category)

                                            return (
                                                <div key={category} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            {categoryData?.icon}
                                                            <span className="font-medium">{category}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{formatCurrency(amount)}</div>
                                                            <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                                                        </div>
                                                    </div>
                                                    <Progress value={percentage} className="h-2" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Financial Health Score */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Financial Health Score
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-600 mb-2">
                                                {budgetSummary.monthlyNet >= 0 ? '85' : '45'}
                                            </div>
                                            <p className="text-gray-600">Financial Health Score</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Monthly Surplus/Deficit</span>
                                                <span className={`text-sm font-medium ${budgetSummary.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(budgetSummary.monthlyNet)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Savings Rate</span>
                                                <span className="text-sm font-medium">
                                                    {budgetSummary.monthlyIncome > 0 ?
                                                        ((budgetSummary.monthlyNet / budgetSummary.monthlyIncome) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Emergency Fund Progress</span>
                                                <span className="text-sm font-medium">
                                                    {savingsProgress.progress.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                {budgetSummary.monthlyNet >= 0 ?
                                                    'Great job! You have a positive cash flow. Consider increasing your savings rate.' :
                                                    'You have a negative cash flow. Look for ways to reduce expenses or increase income.'
                                                }
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}