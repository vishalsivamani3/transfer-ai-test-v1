'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import {
    searchCoursesAdvanced,
    searchTransferAgreements,
    searchColleges
} from '@/lib/queries'

// Types
export interface AssistCourse {
    id: number
    courseCode: string
    courseTitle: string
    department?: string
    units?: number
    description?: string
    college: {
        id: number
        name: string
        code: string
        type: string
    }
    transferAgreements: TransferAgreement[]
}

export interface TransferAgreement {
    id: number
    transferType: string
    equivalentCourse?: string
    unitsTransferred?: number
    transferNotes?: string
    academicYear?: string
    isActive: boolean
    course?: AssistCourse
    sourceCollege?: {
        id: number
        name: string
        code: string
        type: string
    }
    targetCollege?: {
        id: number
        name: string
        code: string
        type: string
    }
}

export interface TransferPathway {
    id: string
    sourceCollege: string
    targetCollege: string
    major: string
    requiredCourses: AssistCourse[]
    transferAgreements: TransferAgreement[]
    totalUnits: number
    transferableUnits: number
    gpaRequirement?: number
    guaranteedTransfer: boolean
}

export interface SemesterPlan {
    id: string
    name: string
    targetMajor: string
    targetUniversities: string[]
    timeline: '1-year' | '2-year'
    semesters: Semester[]
    totalCredits: number
    transferableCredits: number
    status: 'draft' | 'active' | 'completed'
    createdAt: string
    updatedAt: string
}

export interface Semester {
    id: string
    planId: string
    name: string
    year: number
    term: 'Fall' | 'Spring' | 'Summer' | 'Winter'
    courses: PlannedCourse[]
    credits: number
    transferableCredits: number
}

export interface PlannedCourse {
    id: string
    semesterId: string
    courseId: number
    course: AssistCourse
    status: 'planned' | 'in-progress' | 'completed'
    grade?: string
    credits: number
    transferable: boolean
    transferPathways: TransferPathway[]
}

// State interface
interface TransferDataState {
    // Data
    courses: AssistCourse[]
    transferAgreements: TransferAgreement[]
    transferPathways: TransferPathway[]
    semesterPlans: SemesterPlan[]

    // UI State
    selectedCourses: AssistCourse[]
    selectedTransferPathways: TransferPathway[]
    activeSemesterPlan: SemesterPlan | null
    searchResults: {
        courses: AssistCourse[]
        transferAgreements: TransferAgreement[]
        transferPathways: TransferPathway[]
    }

    // Filters
    filters: {
        courseSearch: string
        department: string
        transferType: string
        collegeType: string
        targetMajor: string
        targetUniversity: string
    }

    // Loading states
    loading: {
        courses: boolean
        transferAgreements: boolean
        transferPathways: boolean
        semesterPlans: boolean
    }

    // Error states
    errors: {
        courses: string | null
        transferAgreements: string | null
        transferPathways: string | null
        semesterPlans: string | null
    }
}

// Action types
type TransferDataAction =
    | { type: 'SET_LOADING'; payload: { key: keyof TransferDataState['loading']; value: boolean } }
    | { type: 'SET_ERROR'; payload: { key: keyof TransferDataState['errors']; value: string | null } }
    | { type: 'SET_COURSES'; payload: AssistCourse[] }
    | { type: 'SET_TRANSFER_AGREEMENTS'; payload: TransferAgreement[] }
    | { type: 'SET_TRANSFER_PATHWAYS'; payload: TransferPathway[] }
    | { type: 'SET_SEMESTER_PLANS'; payload: SemesterPlan[] }
    | { type: 'SET_ACTIVE_SEMESTER_PLAN'; payload: SemesterPlan | null }
    | { type: 'ADD_SELECTED_COURSE'; payload: AssistCourse }
    | { type: 'REMOVE_SELECTED_COURSE'; payload: number }
    | { type: 'CLEAR_SELECTED_COURSES' }
    | { type: 'ADD_SELECTED_TRANSFER_PATHWAY'; payload: TransferPathway }
    | { type: 'REMOVE_SELECTED_TRANSFER_PATHWAY'; payload: string }
    | { type: 'CLEAR_SELECTED_TRANSFER_PATHWAYS' }
    | { type: 'SET_SEARCH_RESULTS'; payload: { type: 'courses' | 'transferAgreements' | 'transferPathways'; results: any[] } }
    | { type: 'CLEAR_SEARCH_RESULTS' }
    | { type: 'SET_FILTER'; payload: { key: keyof TransferDataState['filters']; value: string } }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'ADD_COURSE_TO_SEMESTER'; payload: { semesterId: string; course: AssistCourse } }
    | { type: 'REMOVE_COURSE_FROM_SEMESTER'; payload: { semesterId: string; courseId: number } }
    | { type: 'UPDATE_SEMESTER_PLAN'; payload: SemesterPlan }
    | { type: 'CLONE_PATHWAY_TO_PLANNER'; payload: { pathway: TransferPathway; courses: AssistCourse[]; semesterMappings: Record<string, string> } }

// Initial state
const initialState: TransferDataState = {
    courses: [],
    transferAgreements: [],
    transferPathways: [],
    semesterPlans: [],
    selectedCourses: [],
    selectedTransferPathways: [],
    activeSemesterPlan: null,
    searchResults: {
        courses: [],
        transferAgreements: [],
        transferPathways: []
    },
    filters: {
        courseSearch: '',
        department: '',
        transferType: 'any',
        collegeType: 'any',
        targetMajor: '',
        targetUniversity: ''
    },
    loading: {
        courses: false,
        transferAgreements: false,
        transferPathways: false,
        semesterPlans: false
    },
    errors: {
        courses: null,
        transferAgreements: null,
        transferPathways: null,
        semesterPlans: null
    }
}

// Reducer
function transferDataReducer(state: TransferDataState, action: TransferDataAction): TransferDataState {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.key]: action.payload.value
                }
            }

        case 'SET_ERROR':
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.key]: action.payload.value
                }
            }

        case 'SET_COURSES':
            return {
                ...state,
                courses: action.payload,
                loading: { ...state.loading, courses: false },
                errors: { ...state.errors, courses: null }
            }

        case 'SET_TRANSFER_AGREEMENTS':
            return {
                ...state,
                transferAgreements: action.payload,
                loading: { ...state.loading, transferAgreements: false },
                errors: { ...state.errors, transferAgreements: null }
            }

        case 'SET_TRANSFER_PATHWAYS':
            return {
                ...state,
                transferPathways: action.payload,
                loading: { ...state.loading, transferPathways: false },
                errors: { ...state.errors, transferPathways: null }
            }

        case 'SET_SEMESTER_PLANS':
            return {
                ...state,
                semesterPlans: action.payload,
                loading: { ...state.loading, semesterPlans: false },
                errors: { ...state.errors, semesterPlans: null }
            }

        case 'SET_ACTIVE_SEMESTER_PLAN':
            return {
                ...state,
                activeSemesterPlan: action.payload
            }

        case 'ADD_SELECTED_COURSE':
            return {
                ...state,
                selectedCourses: [...state.selectedCourses, action.payload]
            }

        case 'REMOVE_SELECTED_COURSE':
            return {
                ...state,
                selectedCourses: state.selectedCourses.filter(course => course.id !== action.payload)
            }

        case 'CLEAR_SELECTED_COURSES':
            return {
                ...state,
                selectedCourses: []
            }

        case 'ADD_SELECTED_TRANSFER_PATHWAY':
            return {
                ...state,
                selectedTransferPathways: [...state.selectedTransferPathways, action.payload]
            }

        case 'REMOVE_SELECTED_TRANSFER_PATHWAY':
            return {
                ...state,
                selectedTransferPathways: state.selectedTransferPathways.filter(pathway => pathway.id !== action.payload)
            }

        case 'CLEAR_SELECTED_TRANSFER_PATHWAYS':
            return {
                ...state,
                selectedTransferPathways: []
            }

        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    [action.payload.type]: action.payload.results
                }
            }

        case 'CLEAR_SEARCH_RESULTS':
            return {
                ...state,
                searchResults: {
                    courses: [],
                    transferAgreements: [],
                    transferPathways: []
                }
            }

        case 'SET_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.payload.key]: action.payload.value
                }
            }

        case 'CLEAR_FILTERS':
            return {
                ...state,
                filters: {
                    courseSearch: '',
                    department: '',
                    transferType: 'any',
                    collegeType: 'any',
                    targetMajor: '',
                    targetUniversity: ''
                }
            }

        case 'ADD_COURSE_TO_SEMESTER':
            if (!state.activeSemesterPlan) return state

            const updatedSemesters = state.activeSemesterPlan.semesters.map(semester => {
                if (semester.id === action.payload.semesterId) {
                    const newPlannedCourse: PlannedCourse = {
                        id: `${semester.id}-${action.payload.course.id}`,
                        semesterId: semester.id,
                        courseId: action.payload.course.id,
                        course: action.payload.course,
                        status: 'planned',
                        credits: action.payload.course.units || 3,
                        transferable: action.payload.course.transferAgreements.length > 0,
                        transferPathways: []
                    }

                    return {
                        ...semester,
                        courses: [...semester.courses, newPlannedCourse],
                        credits: semester.credits + (action.payload.course.units || 3),
                        transferableCredits: semester.transferableCredits + (newPlannedCourse.transferable ? (action.payload.course.units || 3) : 0)
                    }
                }
                return semester
            })

            const updatedPlan = {
                ...state.activeSemesterPlan,
                semesters: updatedSemesters,
                totalCredits: updatedSemesters.reduce((sum, sem) => sum + sem.credits, 0),
                transferableCredits: updatedSemesters.reduce((sum, sem) => sum + sem.transferableCredits, 0)
            }

            return {
                ...state,
                activeSemesterPlan: updatedPlan,
                semesterPlans: state.semesterPlans.map(plan =>
                    plan.id === updatedPlan.id ? updatedPlan : plan
                )
            }

        case 'REMOVE_COURSE_FROM_SEMESTER':
            if (!state.activeSemesterPlan) return state

            const updatedSemestersAfterRemoval = state.activeSemesterPlan.semesters.map(semester => {
                if (semester.id === action.payload.semesterId) {
                    const courseToRemove = semester.courses.find(c => c.courseId === action.payload.courseId)
                    if (!courseToRemove) return semester

                    return {
                        ...semester,
                        courses: semester.courses.filter(c => c.courseId !== action.payload.courseId),
                        credits: semester.credits - courseToRemove.credits,
                        transferableCredits: semester.transferableCredits - (courseToRemove.transferable ? courseToRemove.credits : 0)
                    }
                }
                return semester
            })

            const updatedPlanAfterRemoval = {
                ...state.activeSemesterPlan,
                semesters: updatedSemestersAfterRemoval,
                totalCredits: updatedSemestersAfterRemoval.reduce((sum, sem) => sum + sem.credits, 0),
                transferableCredits: updatedSemestersAfterRemoval.reduce((sum, sem) => sum + sem.transferableCredits, 0)
            }

            return {
                ...state,
                activeSemesterPlan: updatedPlanAfterRemoval,
                semesterPlans: state.semesterPlans.map(plan =>
                    plan.id === updatedPlanAfterRemoval.id ? updatedPlanAfterRemoval : plan
                )
            }

        case 'UPDATE_SEMESTER_PLAN':
            return {
                ...state,
                activeSemesterPlan: action.payload,
                semesterPlans: state.semesterPlans.map(plan =>
                    plan.id === action.payload.id ? action.payload : plan
                )
            }

        case 'CLONE_PATHWAY_TO_PLANNER':
            if (!state.activeSemesterPlan) return state

            // Add courses to selected courses
            const updatedSelectedCourses = [...state.selectedCourses, ...action.payload.courses]

            // Distribute courses across semesters based on mappings
            const updatedSemestersForCloning = state.activeSemesterPlan.semesters.map(semester => {
                const coursesForThisSemester = action.payload.courses.filter(course => {
                    const courseMapping = Object.entries(action.payload.semesterMappings).find(
                        ([courseId, semesterTimeline]) => courseId === course.id.toString()
                    )
                    if (!courseMapping) return false

                    const [_, semesterTimeline] = courseMapping
                    return semester.name.includes(semesterTimeline.split(',')[0]) ||
                        semester.name.includes(semesterTimeline.split(',')[1]?.trim())
                })

                const newPlannedCourses = coursesForThisSemester.map(course => ({
                    id: `${semester.id}-${course.id}`,
                    semesterId: semester.id,
                    courseId: course.id,
                    course: course,
                    status: 'planned' as const,
                    credits: course.units || 3,
                    transferable: course.transferAgreements.length > 0,
                    transferPathways: [action.payload.pathway]
                }))

                return {
                    ...semester,
                    courses: [...semester.courses, ...newPlannedCourses],
                    credits: semester.credits + newPlannedCourses.reduce((sum, pc) => sum + pc.credits, 0),
                    transferableCredits: semester.transferableCredits + newPlannedCourses.reduce((sum, pc) => sum + (pc.transferable ? pc.credits : 0), 0)
                }
            })

            const updatedPlanForCloning = {
                ...state.activeSemesterPlan,
                semesters: updatedSemestersForCloning,
                totalCredits: updatedSemestersForCloning.reduce((sum, sem) => sum + sem.credits, 0),
                transferableCredits: updatedSemestersForCloning.reduce((sum, sem) => sum + sem.transferableCredits, 0)
            }

            return {
                ...state,
                selectedCourses: updatedSelectedCourses,
                activeSemesterPlan: updatedPlanForCloning,
                semesterPlans: state.semesterPlans.map(plan =>
                    plan.id === updatedPlanForCloning.id ? updatedPlanForCloning : plan
                )
            }

        default:
            return state
    }
}

// Context
const TransferDataContext = createContext<{
    state: TransferDataState
    dispatch: React.Dispatch<TransferDataAction>
    actions: {
        // Data loading
        loadCourses: (filters?: any) => Promise<void>
        loadTransferAgreements: (filters?: any) => Promise<void>
        loadTransferPathways: (filters?: any) => Promise<void>
        loadSemesterPlans: (userId: string) => Promise<void>

        // Search
        searchCourses: (query: string, filters?: any) => Promise<void>
        searchTransferAgreements: (query: string, filters?: any) => Promise<void>
        searchTransferPathways: (query: string, filters?: any) => Promise<void>

        // Course selection
        addSelectedCourse: (course: AssistCourse) => void
        removeSelectedCourse: (courseId: number) => void
        clearSelectedCourses: () => void

        // Transfer pathway selection
        addSelectedTransferPathway: (pathway: TransferPathway) => void
        removeSelectedTransferPathway: (pathwayId: string) => void
        clearSelectedTransferPathways: () => void

        // Semester planning
        createSemesterPlan: (plan: Omit<SemesterPlan, 'id' | 'createdAt' | 'updatedAt'>) => void
        setActiveSemesterPlan: (plan: SemesterPlan | null) => void
        addCourseToSemester: (semesterId: string, course: AssistCourse) => void
        removeCourseFromSemester: (semesterId: string, courseId: number) => void
        updateSemesterPlan: (plan: SemesterPlan) => void
        clonePathwayToPlanner: (pathway: TransferPathway, courses: AssistCourse[], semesterMappings: Record<string, string>) => void

        // Filters
        setFilter: (key: keyof TransferDataState['filters'], value: string) => void
        clearFilters: () => void
        clearSearchResults: () => void
    }
} | null>(null)

// Provider component
export function TransferDataProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(transferDataReducer, initialState)

    // Actions
    const actions = {
        // Data loading
        loadCourses: async (filters?: any) => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'courses', value: true } })
            try {
                const courses = await searchCoursesAdvanced(filters || {})
                dispatch({ type: 'SET_COURSES', payload: courses })
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: { key: 'courses', value: 'Failed to load courses' } })
            }
        },

        loadTransferAgreements: async (filters?: any) => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'transferAgreements', value: true } })
            try {
                const agreements = await searchTransferAgreements(filters || {})
                dispatch({ type: 'SET_TRANSFER_AGREEMENTS', payload: agreements })
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: { key: 'transferAgreements', value: 'Failed to load transfer agreements' } })
            }
        },

        loadTransferPathways: async (filters?: any) => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'transferPathways', value: true } })
            try {
                // Generate transfer pathways from selected courses and transfer agreements
                const pathways: TransferPathway[] = []

                if (state.selectedCourses.length > 0 && state.transferAgreements.length > 0) {
                    // Group agreements by target college
                    const agreementsByTarget = state.transferAgreements.reduce((acc, agreement) => {
                        if (agreement.targetCollege) {
                            const key = agreement.targetCollege.name
                            if (!acc[key]) acc[key] = []
                            acc[key].push(agreement)
                        }
                        return acc
                    }, {} as Record<string, TransferAgreement[]>)

                    // Create pathways for each target college
                    Object.entries(agreementsByTarget).forEach(([targetCollege, agreements]) => {
                        const pathway: TransferPathway = {
                            id: `pathway-${targetCollege}`,
                            sourceCollege: agreements[0]?.sourceCollege?.name || 'Multiple',
                            targetCollege,
                            major: 'General Transfer',
                            requiredCourses: state.selectedCourses,
                            transferAgreements: agreements,
                            totalUnits: state.selectedCourses.reduce((sum, course) => sum + (course.units || 3), 0),
                            transferableUnits: agreements.reduce((sum, a) => sum + (a.unitsTransferred || 0), 0),
                            guaranteedTransfer: agreements.every(a => a.isActive)
                        }
                        pathways.push(pathway)
                    })
                }

                dispatch({ type: 'SET_TRANSFER_PATHWAYS', payload: pathways })
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: { key: 'transferPathways', value: 'Failed to load transfer pathways' } })
            }
        },

        loadSemesterPlans: async (userId: string) => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'semesterPlans', value: true } })
            try {
                // This would load from your existing semester plan system
                const plans: SemesterPlan[] = []
                dispatch({ type: 'SET_SEMESTER_PLANS', payload: plans })
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: { key: 'semesterPlans', value: 'Failed to load semester plans' } })
            }
        },

        // Search
        searchCourses: async (query: string, filters?: any) => {
            try {
                const results = await searchCoursesAdvanced({ query, ...filters })
                dispatch({ type: 'SET_SEARCH_RESULTS', payload: { type: 'courses', results } })
            } catch (error) {
                console.error('Error searching courses:', error)
            }
        },

        searchTransferAgreements: async (query: string, filters?: any) => {
            try {
                const results = await searchTransferAgreements({ query, ...filters })
                dispatch({ type: 'SET_SEARCH_RESULTS', payload: { type: 'transferAgreements', results } })
            } catch (error) {
                console.error('Error searching transfer agreements:', error)
            }
        },

        searchTransferPathways: async (query: string, filters?: any) => {
            try {
                // This would search transfer pathways
                const results: TransferPathway[] = []
                dispatch({ type: 'SET_SEARCH_RESULTS', payload: { type: 'transferPathways', results } })
            } catch (error) {
                console.error('Error searching transfer pathways:', error)
            }
        },

        // Course selection
        addSelectedCourse: (course: AssistCourse) => {
            dispatch({ type: 'ADD_SELECTED_COURSE', payload: course })
        },

        removeSelectedCourse: (courseId: number) => {
            dispatch({ type: 'REMOVE_SELECTED_COURSE', payload: courseId })
        },

        clearSelectedCourses: () => {
            dispatch({ type: 'CLEAR_SELECTED_COURSES' })
        },

        // Transfer pathway selection
        addSelectedTransferPathway: (pathway: TransferPathway) => {
            dispatch({ type: 'ADD_SELECTED_TRANSFER_PATHWAY', payload: pathway })
        },

        removeSelectedTransferPathway: (pathwayId: string) => {
            dispatch({ type: 'REMOVE_SELECTED_TRANSFER_PATHWAY', payload: pathwayId })
        },

        clearSelectedTransferPathways: () => {
            dispatch({ type: 'CLEAR_SELECTED_TRANSFER_PATHWAYS' })
        },

        // Semester planning
        createSemesterPlan: (plan: Omit<SemesterPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
            const newPlan: SemesterPlan = {
                ...plan,
                id: `plan-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            dispatch({ type: 'SET_SEMESTER_PLANS', payload: [...state.semesterPlans, newPlan] })
            dispatch({ type: 'SET_ACTIVE_SEMESTER_PLAN', payload: newPlan })
        },

        setActiveSemesterPlan: (plan: SemesterPlan | null) => {
            dispatch({ type: 'SET_ACTIVE_SEMESTER_PLAN', payload: plan })
        },

        addCourseToSemester: (semesterId: string, course: AssistCourse) => {
            dispatch({ type: 'ADD_COURSE_TO_SEMESTER', payload: { semesterId, course } })
        },

        removeCourseFromSemester: (semesterId: string, courseId: number) => {
            dispatch({ type: 'REMOVE_COURSE_FROM_SEMESTER', payload: { semesterId, courseId } })
        },

        updateSemesterPlan: (plan: SemesterPlan) => {
            dispatch({ type: 'UPDATE_SEMESTER_PLAN', payload: plan })
        },

        clonePathwayToPlanner: (pathway: TransferPathway, courses: AssistCourse[], semesterMappings: Record<string, string>) => {
            dispatch({ type: 'CLONE_PATHWAY_TO_PLANNER', payload: { pathway, courses, semesterMappings } })
        },

        // Filters
        setFilter: (key: keyof TransferDataState['filters'], value: string) => {
            dispatch({ type: 'SET_FILTER', payload: { key, value } })
        },

        clearFilters: () => {
            dispatch({ type: 'CLEAR_FILTERS' })
        },

        clearSearchResults: () => {
            dispatch({ type: 'CLEAR_SEARCH_RESULTS' })
        }
    }

    return (
        <TransferDataContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </TransferDataContext.Provider>
    )
}

// Hook to use the context
export function useTransferData() {
    const context = useContext(TransferDataContext)
    if (!context) {
        throw new Error('useTransferData must be used within a TransferDataProvider')
    }
    return context
}