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
    Calculator,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Info,
    GraduationCap,
    Home,
    Car,
    BookOpen,
    CreditCard,
    PiggyBank,
    Target,
    Calendar
} from 'lucide-react'
import { useTransferData } from '@/contexts/TransferDataContext'

interface FinancialProfile {
    // Family Information
    familySize: number
    stateOfResidence: string
    maritalStatus: 'single' | 'married' | 'divorced' | 'separated'

    // Parent Financial Information (2023 tax year)
    parentAGI: number
    parentAssets: number
    parentChildSupport: number
    parentBusinessValue: number

    // Student Financial Information
    studentIncome: number
    studentAssets: number

    // Current College Information
    currentCollege: string
    currentTuition: number
    currentFees: number
    currentHousing: number
    currentMeals: number

    // Transfer Goals
    targetUniversities: string[]
    transferTimeline: '1-year' | '2-year'
    targetMajor: string
}

interface CostBreakdown {
    // Direct Costs
    tuition: number
    fees: number
    housing: number
    meals: number
    healthInsurance: number
    books: number

    // Indirect Costs
    transportation: number
    personal: number
    miscellaneous: number

    // Total Costs
    totalDirect: number
    totalIndirect: number
    totalCost: number
}

interface FinancialAidEstimate {
    // Federal Aid
    pellGrant: number
    federalLoans: number
    workStudy: number

    // State Aid (California)
    calGrant: number
    middleClassScholarship: number

    // Institutional Aid
    institutionalGrants: number
    institutionalScholarships: number

    // Total Aid
    totalGiftAid: number
    totalAid: number

    // Net Cost
    netCost: number
    monthlyPayment: number
}

interface TransferApplicationCosts {
    applicationFees: number
    transcriptFees: number
    testFees: number
    otherFees: number
    totalApplicationCosts: number
}

const FINANCIAL_DATA = {
    // 2025-26 FAFSA Data
    federalPovertyLevels: {
        '1': 15030,
        '2': 20340,
        '3': 25650,
        '4': 30870,
        '5': 36180,
        '6': 41490,
        '7': 46800,
        '8': 52110
    },

    // UC System Costs (2025-26)
    ucCosts: {
        tuition: 14436,
        campusFees: 2400,
        healthInsurance: 3822,
        books: 1463,
        housing: {
            onCampus: 20771,
            offCampus: 15957,
            withParents: 8968
        },
        personal: 2177,
        transportation: {
            onCampus: 1030,
            offCampus: 1616,
            withParents: 2998
        }
    },

    // CSU System Costs (2025-26)
    csuCosts: {
        tuition: 5742,
        campusFees: 1200,
        healthInsurance: 2000,
        books: 1200,
        housing: {
            onCampus: 15000,
            offCampus: 12000,
            withParents: 6000
        },
        personal: 1800,
        transportation: {
            onCampus: 800,
            offCampus: 1200,
            withParents: 2000
        }
    },

    // Private College Costs (Average)
    privateCosts: {
        tuition: 45000,
        campusFees: 3000,
        healthInsurance: 3000,
        books: 1500,
        housing: {
            onCampus: 18000,
            offCampus: 15000,
            withParents: 8000
        },
        personal: 2500,
        transportation: {
            onCampus: 1000,
            offCampus: 1500,
            withParents: 2500
        }
    },

    // Application Costs
    applicationCosts: {
        ucApplication: 70,
        csuApplication: 55,
        privateApplication: 75,
        transcriptFee: 10,
        satFee: 60,
        actFee: 63,
        apExamFee: 98
    }
}

export default function FinancialCostCalculator() {
    const { state } = useTransferData()
    const [activeTab, setActiveTab] = useState('calculator')
    const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
        familySize: 4,
        stateOfResidence: 'CA',
        maritalStatus: 'married',
        parentAGI: 75000,
        parentAssets: 50000,
        parentChildSupport: 0,
        parentBusinessValue: 0,
        studentIncome: 5000,
        studentAssets: 2000,
        currentCollege: 'Community College',
        currentTuition: 1200,
        currentFees: 500,
        currentHousing: 0,
        currentMeals: 0,
        targetUniversities: ['UC Berkeley', 'UCLA'],
        transferTimeline: '2-year',
        targetMajor: 'Computer Science'
    })

    const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null)
    const [financialAid, setFinancialAid] = useState<FinancialAidEstimate | null>(null)
    const [applicationCosts, setApplicationCosts] = useState<TransferApplicationCosts | null>(null)
    const [studentAidIndex, setStudentAidIndex] = useState<number>(0)

    // Calculate Student Aid Index (SAI) based on 2025-26 FAFSA formula
    const calculateStudentAidIndex = (profile: FinancialProfile): number => {
        const { familySize, parentAGI, parentAssets, studentIncome, studentAssets } = profile

        // Check if student qualifies for SAI = 0 (maximum Pell Grant)
        const povertyLevel = FINANCIAL_DATA.federalPovertyLevels[familySize.toString()] || 30870
        const povertyThreshold = povertyLevel * 2.5 // 250% of poverty level

        if (parentAGI <= povertyThreshold) {
            return 0
        }

        // Calculate parent contribution
        const parentIncomeContribution = Math.max(0, (parentAGI - povertyThreshold) * 0.12)
        const parentAssetContribution = Math.max(0, (parentAssets - 2000) * 0.05)
        const parentContribution = parentIncomeContribution + parentAssetContribution

        // Calculate student contribution
        const studentIncomeContribution = Math.max(0, (studentIncome - 11400) * 0.5)
        const studentAssetContribution = studentAssets * 0.2
        const studentContribution = studentIncomeContribution + studentAssetContribution

        return Math.round(parentContribution + studentContribution)
    }

    // Calculate cost breakdown for target universities
    const calculateCostBreakdown = (profile: FinancialProfile): CostBreakdown => {
        const { targetUniversities } = profile
        const isUC = targetUniversities.some(uni => uni.includes('UC'))
        const isCSU = targetUniversities.some(uni => uni.includes('CSU') || uni.includes('State'))
        const isPrivate = targetUniversities.some(uni => !uni.includes('UC') && !uni.includes('CSU') && !uni.includes('State'))

        let baseCosts
        if (isUC) baseCosts = FINANCIAL_DATA.ucCosts
        else if (isCSU) baseCosts = FINANCIAL_DATA.csuCosts
        else baseCosts = FINANCIAL_DATA.privateCosts

        const housingType = 'offCampus' // Default to off-campus
        const transportationType = 'offCampus'

        return {
            tuition: baseCosts.tuition,
            fees: baseCosts.campusFees,
            housing: baseCosts.housing[housingType],
            meals: 0, // Included in housing for off-campus
            healthInsurance: baseCosts.healthInsurance,
            books: baseCosts.books,
            transportation: baseCosts.transportation[transportationType],
            personal: baseCosts.personal,
            miscellaneous: 1000,
            totalDirect: baseCosts.tuition + baseCosts.campusFees + baseCosts.housing[housingType] + baseCosts.healthInsurance,
            totalIndirect: baseCosts.books + baseCosts.transportation[transportationType] + baseCosts.personal + 1000,
            totalCost: 0 // Will be calculated
        }
    }

    // Calculate financial aid estimate
    const calculateFinancialAid = (profile: FinancialProfile, sai: number): FinancialAidEstimate => {
        const { targetUniversities } = profile
        const isUC = targetUniversities.some(uni => uni.includes('UC'))
        const isCSU = targetUniversities.some(uni => uni.includes('CSU') || uni.includes('State'))

        // Pell Grant calculation (2025-26 max: $7,395)
        const pellGrant = sai <= 0 ? 7395 : Math.max(0, 7395 - (sai * 0.5))

        // Cal Grant (California residents only)
        const calGrant = profile.stateOfResidence === 'CA' ? (sai <= 0 ? 12000 : Math.max(0, 12000 - (sai * 0.4))) : 0

        // Middle Class Scholarship (California residents)
        const middleClassScholarship = profile.stateOfResidence === 'CA' && sai > 0 && sai < 20000 ?
            Math.min(2000, (20000 - sai) * 0.1) : 0

        // Federal loans
        const federalLoans = 5500 // Subsidized + Unsubsidized for dependent students

        // Work-study
        const workStudy = sai <= 0 ? 3000 : Math.max(0, 3000 - (sai * 0.15))

        // Institutional aid (varies by university)
        const institutionalGrants = isUC ? (sai <= 0 ? 15000 : Math.max(0, 15000 - (sai * 0.3))) :
            isCSU ? (sai <= 0 ? 8000 : Math.max(0, 8000 - (sai * 0.2))) : 0

        const institutionalScholarships = 2000 // Merit-based estimate

        const totalGiftAid = pellGrant + calGrant + middleClassScholarship + institutionalGrants + institutionalScholarships
        const totalAid = totalGiftAid + federalLoans + workStudy

        return {
            pellGrant,
            federalLoans,
            workStudy,
            calGrant,
            middleClassScholarship,
            institutionalGrants,
            institutionalScholarships,
            totalGiftAid,
            totalAid,
            netCost: 0, // Will be calculated
            monthlyPayment: 0 // Will be calculated
        }
    }

    // Calculate transfer application costs
    const calculateApplicationCosts = (profile: FinancialProfile): TransferApplicationCosts => {
        const { targetUniversities } = profile
        const ucApplications = targetUniversities.filter(uni => uni.includes('UC')).length
        const csuApplications = targetUniversities.filter(uni => uni.includes('CSU') || uni.includes('State')).length
        const privateApplications = targetUniversities.length - ucApplications - csuApplications

        const applicationFees = (ucApplications * FINANCIAL_DATA.applicationCosts.ucApplication) +
            (csuApplications * FINANCIAL_DATA.applicationCosts.csuApplication) +
            (privateApplications * FINANCIAL_DATA.applicationCosts.privateApplication)

        const transcriptFees = targetUniversities.length * FINANCIAL_DATA.applicationCosts.transcriptFee
        const testFees = 0 // Assuming no additional tests needed
        const otherFees = 200 // Miscellaneous fees

        return {
            applicationFees,
            transcriptFees,
            testFees,
            otherFees,
            totalApplicationCosts: applicationFees + transcriptFees + testFees + otherFees
        }
    }

    // Update calculations when profile changes
    useEffect(() => {
        const sai = calculateStudentAidIndex(financialProfile)
        setStudentAidIndex(sai)

        const costs = calculateCostBreakdown(financialProfile)
        costs.totalCost = costs.totalDirect + costs.totalIndirect
        setCostBreakdown(costs)

        const aid = calculateFinancialAid(financialProfile, sai)
        aid.netCost = Math.max(0, costs.totalCost - aid.totalAid)
        aid.monthlyPayment = aid.netCost / 12 // Monthly payment over 12 months
        setFinancialAid(aid)

        const appCosts = calculateApplicationCosts(financialProfile)
        setApplicationCosts(appCosts)
    }, [financialProfile])

    const handleProfileChange = (field: keyof FinancialProfile, value: any) => {
        setFinancialProfile(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Financial Cost Calculator
                    </CardTitle>
                    <CardDescription>
                        Calculate your transfer costs, financial aid eligibility, and create a comprehensive budget for your transfer journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="calculator">Calculator</TabsTrigger>
                            <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                            <TabsTrigger value="aid">Financial Aid</TabsTrigger>
                            <TabsTrigger value="budget">Budget Planning</TabsTrigger>
                        </TabsList>

                        <TabsContent value="calculator" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Family Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Family Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="familySize">Family Size</Label>
                                            <Input
                                                id="familySize"
                                                type="number"
                                                value={financialProfile.familySize}
                                                onChange={(e) => handleProfileChange('familySize', parseInt(e.target.value))}
                                                min="1"
                                                max="8"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State of Residence</Label>
                                            <Select value={financialProfile.stateOfResidence} onValueChange={(value) => handleProfileChange('stateOfResidence', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CA">California</SelectItem>
                                                    <SelectItem value="NY">New York</SelectItem>
                                                    <SelectItem value="TX">Texas</SelectItem>
                                                    <SelectItem value="FL">Florida</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="maritalStatus">Parent Marital Status</Label>
                                            <Select value={financialProfile.maritalStatus} onValueChange={(value) => handleProfileChange('maritalStatus', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="married">Married</SelectItem>
                                                    <SelectItem value="single">Single</SelectItem>
                                                    <SelectItem value="divorced">Divorced</SelectItem>
                                                    <SelectItem value="separated">Separated</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Parent Financial Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Parent Financial Information (2023)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="parentAGI">Adjusted Gross Income</Label>
                                            <Input
                                                id="parentAGI"
                                                type="number"
                                                value={financialProfile.parentAGI}
                                                onChange={(e) => handleProfileChange('parentAGI', parseInt(e.target.value))}
                                                placeholder="75000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="parentAssets">Parent Assets</Label>
                                            <Input
                                                id="parentAssets"
                                                type="number"
                                                value={financialProfile.parentAssets}
                                                onChange={(e) => handleProfileChange('parentAssets', parseInt(e.target.value))}
                                                placeholder="50000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="studentIncome">Student Income (2023)</Label>
                                            <Input
                                                id="studentIncome"
                                                type="number"
                                                value={financialProfile.studentIncome}
                                                onChange={(e) => handleProfileChange('studentIncome', parseInt(e.target.value))}
                                                placeholder="5000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="studentAssets">Student Assets</Label>
                                            <Input
                                                id="studentAssets"
                                                type="number"
                                                value={financialProfile.studentAssets}
                                                onChange={(e) => handleProfileChange('studentAssets', parseInt(e.target.value))}
                                                placeholder="2000"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Transfer Goals */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Transfer Goals</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="targetMajor">Target Major</Label>
                                            <Select value={financialProfile.targetMajor} onValueChange={(value) => handleProfileChange('targetMajor', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                                    <SelectItem value="Business">Business</SelectItem>
                                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                                    <SelectItem value="Psychology">Psychology</SelectItem>
                                                    <SelectItem value="Biology">Biology</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="transferTimeline">Transfer Timeline</Label>
                                            <Select value={financialProfile.transferTimeline} onValueChange={(value) => handleProfileChange('transferTimeline', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1-year">1 Year</SelectItem>
                                                    <SelectItem value="2-year">2 Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Current College Costs */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Current College Costs</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="currentTuition">Annual Tuition</Label>
                                            <Input
                                                id="currentTuition"
                                                type="number"
                                                value={financialProfile.currentTuition}
                                                onChange={(e) => handleProfileChange('currentTuition', parseInt(e.target.value))}
                                                placeholder="1200"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="currentFees">Annual Fees</Label>
                                            <Input
                                                id="currentFees"
                                                type="number"
                                                value={financialProfile.currentFees}
                                                onChange={(e) => handleProfileChange('currentFees', parseInt(e.target.value))}
                                                placeholder="500"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="currentHousing">Annual Housing</Label>
                                            <Input
                                                id="currentHousing"
                                                type="number"
                                                value={financialProfile.currentHousing}
                                                onChange={(e) => handleProfileChange('currentHousing', parseInt(e.target.value))}
                                                placeholder="0"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Student Aid Index Display */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Student Aid Index (SAI)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">
                                            {formatCurrency(studentAidIndex)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            This is your expected family contribution based on 2025-26 FAFSA formula
                                        </p>
                                        {studentAidIndex === 0 && (
                                            <Badge className="mt-2" variant="default">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Maximum Pell Grant Eligible
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="breakdown" className="space-y-6">
                            {costBreakdown && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Direct Costs */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="h-5 w-5" />
                                                Direct Costs (Billed by University)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Tuition</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.tuition)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Campus Fees</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.fees)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Housing</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.housing)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Health Insurance</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.healthInsurance)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Direct Costs</span>
                                                <span>{formatCurrency(costBreakdown.totalDirect)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Indirect Costs */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5" />
                                                Indirect Costs (Living Expenses)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Books & Supplies</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.books)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Transportation</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.transportation)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Personal Expenses</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.personal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Miscellaneous</span>
                                                <span className="font-medium">{formatCurrency(costBreakdown.miscellaneous)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Indirect Costs</span>
                                                <span>{formatCurrency(costBreakdown.totalIndirect)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Cost Summary */}
                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5" />
                                                Total Annual Cost of Attendance
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-green-600 mb-4">
                                                    {formatCurrency(costBreakdown.totalCost)}
                                                </div>
                                                <p className="text-gray-600">
                                                    This is your estimated total cost for one academic year
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="aid" className="space-y-6">
                            {financialAid && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Gift Aid */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <PiggyBank className="h-5 w-5" />
                                                Gift Aid (Free Money)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Pell Grant</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialAid.pellGrant)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cal Grant</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialAid.calGrant)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Middle Class Scholarship</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialAid.middleClassScholarship)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Institutional Grants</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialAid.institutionalGrants)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Scholarships</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialAid.institutionalScholarships)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-lg text-green-600">
                                                <span>Total Gift Aid</span>
                                                <span>{formatCurrency(financialAid.totalGiftAid)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Self-Help Aid */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                Self-Help Aid
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Federal Loans</span>
                                                <span className="font-medium text-blue-600">{formatCurrency(financialAid.federalLoans)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Work-Study</span>
                                                <span className="font-medium text-blue-600">{formatCurrency(financialAid.workStudy)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-lg text-blue-600">
                                                <span>Total Self-Help</span>
                                                <span>{formatCurrency(financialAid.federalLoans + financialAid.workStudy)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Net Cost */}
                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calculator className="h-5 w-5" />
                                                Net Cost After Financial Aid
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-red-600 mb-4">
                                                    {formatCurrency(financialAid.netCost)}
                                                </div>
                                                <p className="text-gray-600 mb-4">
                                                    This is what you'll need to pay out-of-pocket or through loans
                                                </p>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-600">
                                                        Monthly payment over 12 months: <span className="font-bold">{formatCurrency(financialAid.monthlyPayment)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="budget" className="space-y-6">
                            {applicationCosts && (
                                <div className="space-y-6">
                                    {/* Application Costs */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                Transfer Application Costs
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Application Fees</span>
                                                <span className="font-medium">{formatCurrency(applicationCosts.applicationFees)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Transcript Fees</span>
                                                <span className="font-medium">{formatCurrency(applicationCosts.transcriptFees)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Other Fees</span>
                                                <span className="font-medium">{formatCurrency(applicationCosts.otherFees)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Application Costs</span>
                                                <span>{formatCurrency(applicationCosts.totalApplicationCosts)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Budget Planning */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5" />
                                                Budget Planning Timeline
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {formatCurrency(applicationCosts.totalApplicationCosts)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Application Costs</div>
                                                        <div className="text-xs text-gray-500">Due: Fall 2024</div>
                                                    </div>
                                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {financialAid ? formatCurrency(financialAid.netCost * 0.5) : '$0'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">First Year Costs</div>
                                                        <div className="text-xs text-gray-500">Due: Fall 2025</div>
                                                    </div>
                                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-purple-600">
                                                            {financialAid ? formatCurrency(financialAid.netCost * 0.5) : '$0'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Second Year Costs</div>
                                                        <div className="text-xs text-gray-500">Due: Fall 2026</div>
                                                    </div>
                                                </div>

                                                <Alert>
                                                    <Info className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <strong>Budgeting Tips:</strong> Start saving for application costs now.
                                                        Consider part-time work or summer jobs to build your transfer fund.
                                                        Apply for scholarships early to reduce your net cost.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}