// Transfer Pathway System for Community College to CSU/UC Transfer
// This file contains comprehensive transfer pathway data organized by major

export interface TransferPathway {
    id: string
    major: string
    majorCode: string
    targetSystem: 'UC' | 'CSU' | 'BOTH'
    targetUniversities: {
        name: string
        code: string
        type: 'UC' | 'CSU'
        requirements: {
            minGPA: number
            minUnits: number
            requiredCourses: string[]
            recommendedCourses: string[]
            additionalRequirements: string[]
        }
        transferGuarantee: boolean
        priorityDeadline: string
        applicationDeadline: string
    }[]
    commonRequirements: {
        IGETC: boolean
        CSUGE: boolean
        majorPrep: string[]
        generalEd: string[]
    }
    pathwaySteps: {
        step: number
        title: string
        description: string
        courses: string[]
        timeline: string
    }[]
    statistics: {
        totalStudents: number
        successRate: number
        avgGPA: number
        avgTransferTime: string
    }
    resources: {
        counselors: string[]
        websites: string[]
        documents: string[]
    }
}

// Major Categories for Organization
export const MAJOR_CATEGORIES = {
    'STEM': [
        'Computer Science',
        'Engineering',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Nursing',
        'Data Science',
        'Information Technology'
    ],
    'Business': [
        'Business Administration',
        'Accounting',
        'Finance',
        'Marketing',
        'Economics',
        'Management',
        'Entrepreneurship'
    ],
    'Liberal Arts': [
        'English',
        'History',
        'Political Science',
        'Psychology',
        'Sociology',
        'Philosophy',
        'Communications',
        'Journalism'
    ],
    'Health Sciences': [
        'Nursing',
        'Pre-Medicine',
        'Pre-Pharmacy',
        'Public Health',
        'Kinesiology',
        'Nutrition',
        'Physical Therapy'
    ],
    'Education': [
        'Elementary Education',
        'Secondary Education',
        'Special Education',
        'Early Childhood Education'
    ],
    'Arts & Design': [
        'Art',
        'Graphic Design',
        'Music',
        'Theater',
        'Film',
        'Architecture',
        'Interior Design'
    ]
}

// Sample Transfer Pathways Data
export const TRANSFER_PATHWAYS: TransferPathway[] = [
    {
        id: 'cs-uc-pathway',
        major: 'Computer Science',
        majorCode: 'CS',
        targetSystem: 'UC',
        targetUniversities: [
            {
                name: 'UC Berkeley',
                code: 'UCB',
                type: 'UC',
                requirements: {
                    minGPA: 3.0,
                    minUnits: 60,
                    requiredCourses: [
                        'MATH 150 (Calculus I)',
                        'MATH 151 (Calculus II)',
                        'MATH 250 (Calculus III)',
                        'CS 101 (Programming Fundamentals)',
                        'CS 102 (Data Structures)',
                        'CS 201 (Computer Organization)',
                        'PHYS 101 (Physics I)',
                        'PHYS 102 (Physics II)'
                    ],
                    recommendedCourses: [
                        'MATH 252 (Linear Algebra)',
                        'CS 202 (Algorithms)',
                        'CS 203 (Software Engineering)',
                        'ENGL 101 (Composition)',
                        'ENGL 102 (Critical Thinking)'
                    ],
                    additionalRequirements: [
                        'Complete IGETC',
                        'Strong math background',
                        'Programming portfolio recommended'
                    ],
                    transferGuarantee: false,
                    priorityDeadline: 'November 30',
                    applicationDeadline: 'January 31'
                }
            },
            {
                name: 'UC Los Angeles',
                code: 'UCLA',
                type: 'UC',
                requirements: {
                    minGPA: 3.2,
                    minUnits: 60,
                    requiredCourses: [
                        'MATH 150 (Calculus I)',
                        'MATH 151 (Calculus II)',
                        'MATH 250 (Calculus III)',
                        'CS 101 (Programming Fundamentals)',
                        'CS 102 (Data Structures)',
                        'CS 201 (Computer Organization)',
                        'PHYS 101 (Physics I)'
                    ],
                    recommendedCourses: [
                        'MATH 252 (Linear Algebra)',
                        'CS 202 (Algorithms)',
                        'CS 203 (Software Engineering)',
                        'ENGL 101 (Composition)'
                    ],
                    additionalRequirements: [
                        'Complete IGETC',
                        'Strong math and science background'
                    ],
                    transferGuarantee: false,
                    priorityDeadline: 'November 30',
                    applicationDeadline: 'January 31'
                }
            }
        ],
        commonRequirements: {
            IGETC: true,
            CSUGE: false,
            majorPrep: [
                'Complete all required math courses',
                'Complete all required CS courses',
                'Maintain strong GPA'
            ],
            generalEd: [
                'Complete IGETC pattern',
                'English composition',
                'Critical thinking',
                'Mathematics',
                'Natural sciences',
                'Social sciences',
                'Arts and humanities'
            ]
        },
        pathwaySteps: [
            {
                step: 1,
                title: 'Foundation Year',
                description: 'Complete basic requirements and prerequisites',
                courses: [
                    'MATH 150 (Calculus I)',
                    'CS 101 (Programming Fundamentals)',
                    'ENGL 101 (Composition)',
                    'IGETC Area 3A (Arts)',
                    'IGETC Area 4 (Social Sciences)'
                ],
                timeline: 'Year 1, Fall-Spring'
            },
            {
                step: 2,
                title: 'Core Preparation',
                description: 'Complete major preparation courses',
                courses: [
                    'MATH 151 (Calculus II)',
                    'MATH 250 (Calculus III)',
                    'CS 102 (Data Structures)',
                    'CS 201 (Computer Organization)',
                    'PHYS 101 (Physics I)'
                ],
                timeline: 'Year 1-2, Fall-Spring'
            },
            {
                step: 3,
                title: 'Advanced Preparation',
                description: 'Complete remaining major requirements',
                courses: [
                    'MATH 252 (Linear Algebra)',
                    'CS 202 (Algorithms)',
                    'CS 203 (Software Engineering)',
                    'PHYS 102 (Physics II)',
                    'IGETC completion'
                ],
                timeline: 'Year 2, Fall-Spring'
            },
            {
                step: 4,
                title: 'Transfer Application',
                description: 'Apply to UC system',
                courses: [],
                timeline: 'Year 2, Fall'
            }
        ],
        statistics: {
            totalStudents: 1250,
            successRate: 78,
            avgGPA: 3.4,
            avgTransferTime: '2.1 years'
        },
        resources: {
            counselors: [
                'Dr. Sarah Johnson - CS Transfer Counselor',
                'Prof. Michael Chen - Math Department',
                'Lisa Rodriguez - Transfer Center'
            ],
            websites: [
                'https://assist.org/',
                'https://admission.universityofcalifornia.edu/',
                'https://www.cccapply.org/'
            ],
            documents: [
                'CS Transfer Guide 2024',
                'IGETC Requirements',
                'UC Application Checklist'
            ]
        }
    },
    {
        id: 'business-csu-pathway',
        major: 'Business Administration',
        majorCode: 'BUS',
        targetSystem: 'CSU',
        targetUniversities: [
            {
                name: 'CSU Long Beach',
                code: 'CSULB',
                type: 'CSU',
                requirements: {
                    minGPA: 2.0,
                    minUnits: 60,
                    requiredCourses: [
                        'BUS 101 (Introduction to Business)',
                        'ACCT 101 (Financial Accounting)',
                        'ACCT 102 (Managerial Accounting)',
                        'ECON 101 (Microeconomics)',
                        'ECON 102 (Macroeconomics)',
                        'MATH 120 (Statistics)',
                        'ENGL 101 (Composition)'
                    ],
                    recommendedCourses: [
                        'BUS 102 (Business Law)',
                        'BUS 201 (Management)',
                        'BUS 202 (Marketing)',
                        'MATH 130 (Business Calculus)'
                    ],
                    additionalRequirements: [
                        'Complete CSUGE pattern',
                        'Complete major preparation'
                    ],
                    transferGuarantee: true,
                    priorityDeadline: 'March 2',
                    applicationDeadline: 'May 31'
                }
            },
            {
                name: 'CSU Fullerton',
                code: 'CSUF',
                type: 'CSU',
                requirements: {
                    minGPA: 2.0,
                    minUnits: 60,
                    requiredCourses: [
                        'BUS 101 (Introduction to Business)',
                        'ACCT 101 (Financial Accounting)',
                        'ACCT 102 (Managerial Accounting)',
                        'ECON 101 (Microeconomics)',
                        'ECON 102 (Macroeconomics)',
                        'MATH 120 (Statistics)'
                    ],
                    recommendedCourses: [
                        'BUS 102 (Business Law)',
                        'BUS 201 (Management)',
                        'BUS 202 (Marketing)'
                    ],
                    additionalRequirements: [
                        'Complete CSUGE pattern'
                    ],
                    transferGuarantee: true,
                    priorityDeadline: 'March 2',
                    applicationDeadline: 'May 31'
                }
            }
        ],
        commonRequirements: {
            IGETC: false,
            CSUGE: true,
            majorPrep: [
                'Complete all required business courses',
                'Complete all required economics courses',
                'Complete accounting sequence'
            ],
            generalEd: [
                'Complete CSUGE pattern',
                'English composition',
                'Critical thinking',
                'Mathematics',
                'Natural sciences',
                'Social sciences',
                'Arts and humanities'
            ]
        },
        pathwaySteps: [
            {
                step: 1,
                title: 'Foundation Year',
                description: 'Complete basic business and general education requirements',
                courses: [
                    'BUS 101 (Introduction to Business)',
                    'ENGL 101 (Composition)',
                    'MATH 120 (Statistics)',
                    'CSUGE Area A (English)',
                    'CSUGE Area B (Natural Sciences)'
                ],
                timeline: 'Year 1, Fall-Spring'
            },
            {
                step: 2,
                title: 'Core Business',
                description: 'Complete core business and economics courses',
                courses: [
                    'ACCT 101 (Financial Accounting)',
                    'ACCT 102 (Managerial Accounting)',
                    'ECON 101 (Microeconomics)',
                    'ECON 102 (Macroeconomics)',
                    'BUS 102 (Business Law)'
                ],
                timeline: 'Year 1-2, Fall-Spring'
            },
            {
                step: 3,
                title: 'Advanced Business',
                description: 'Complete advanced business courses and CSUGE',
                courses: [
                    'BUS 201 (Management)',
                    'BUS 202 (Marketing)',
                    'CSUGE completion',
                    'Electives'
                ],
                timeline: 'Year 2, Fall-Spring'
            },
            {
                step: 4,
                title: 'Transfer Application',
                description: 'Apply to CSU system',
                courses: [],
                timeline: 'Year 2, Fall'
            }
        ],
        statistics: {
            totalStudents: 2100,
            successRate: 85,
            avgGPA: 3.1,
            avgTransferTime: '2.0 years'
        },
        resources: {
            counselors: [
                'Dr. Jennifer Martinez - Business Transfer Counselor',
                'Prof. David Kim - Economics Department',
                'Maria Santos - Transfer Center'
            ],
            websites: [
                'https://assist.org/',
                'https://www.calstate.edu/apply',
                'https://www.cccapply.org/'
            ],
            documents: [
                'Business Transfer Guide 2024',
                'CSUGE Requirements',
                'CSU Application Checklist'
            ]
        }
    },
    {
        id: 'nursing-pathway',
        major: 'Nursing',
        majorCode: 'NURS',
        targetSystem: 'BOTH',
        targetUniversities: [
            {
                name: 'CSU Long Beach',
                code: 'CSULB',
                type: 'CSU',
                requirements: {
                    minGPA: 3.0,
                    minUnits: 60,
                    requiredCourses: [
                        'BIOL 101 (Human Anatomy)',
                        'BIOL 102 (Human Physiology)',
                        'BIOL 103 (Microbiology)',
                        'CHEM 101 (General Chemistry)',
                        'MATH 120 (Statistics)',
                        'ENGL 101 (Composition)',
                        'PSYC 101 (General Psychology)',
                        'SOC 101 (Introduction to Sociology)'
                    ],
                    recommendedCourses: [
                        'NURS 101 (Introduction to Nursing)',
                        'NUTR 101 (Nutrition)',
                        'PHIL 101 (Ethics)'
                    ],
                    additionalRequirements: [
                        'Complete CSUGE pattern',
                        'TEAS exam required',
                        'Background check required'
                    ],
                    transferGuarantee: false,
                    priorityDeadline: 'March 2',
                    applicationDeadline: 'May 31'
                }
            },
            {
                name: 'UC Irvine',
                code: 'UCI',
                type: 'UC',
                requirements: {
                    minGPA: 3.5,
                    minUnits: 60,
                    requiredCourses: [
                        'BIOL 101 (Human Anatomy)',
                        'BIOL 102 (Human Physiology)',
                        'BIOL 103 (Microbiology)',
                        'CHEM 101 (General Chemistry)',
                        'MATH 120 (Statistics)',
                        'ENGL 101 (Composition)',
                        'PSYC 101 (General Psychology)'
                    ],
                    recommendedCourses: [
                        'NURS 101 (Introduction to Nursing)',
                        'NUTR 101 (Nutrition)',
                        'PHIL 101 (Ethics)'
                    ],
                    additionalRequirements: [
                        'Complete IGETC',
                        'TEAS exam required',
                        'Strong science background'
                    ],
                    transferGuarantee: false,
                    priorityDeadline: 'November 30',
                    applicationDeadline: 'January 31'
                }
            }
        ],
        commonRequirements: {
            IGETC: true,
            CSUGE: true,
            majorPrep: [
                'Complete all required science courses',
                'Complete all required prerequisite courses',
                'Maintain strong GPA in science courses'
            ],
            generalEd: [
                'Complete IGETC or CSUGE pattern',
                'English composition',
                'Mathematics',
                'Natural sciences',
                'Social sciences',
                'Arts and humanities'
            ]
        },
        pathwaySteps: [
            {
                step: 1,
                title: 'Science Foundation',
                description: 'Complete required science prerequisites',
                courses: [
                    'BIOL 101 (Human Anatomy)',
                    'BIOL 102 (Human Physiology)',
                    'CHEM 101 (General Chemistry)',
                    'MATH 120 (Statistics)',
                    'ENGL 101 (Composition)'
                ],
                timeline: 'Year 1, Fall-Spring'
            },
            {
                step: 2,
                title: 'Core Prerequisites',
                description: 'Complete remaining prerequisite courses',
                courses: [
                    'BIOL 103 (Microbiology)',
                    'PSYC 101 (General Psychology)',
                    'SOC 101 (Introduction to Sociology)',
                    'NURS 101 (Introduction to Nursing)',
                    'NUTR 101 (Nutrition)'
                ],
                timeline: 'Year 1-2, Fall-Spring'
            },
            {
                step: 3,
                title: 'General Education',
                description: 'Complete general education requirements',
                courses: [
                    'IGETC/CSUGE completion',
                    'PHIL 101 (Ethics)',
                    'Electives'
                ],
                timeline: 'Year 2, Fall-Spring'
            },
            {
                step: 4,
                title: 'Application & Testing',
                description: 'Take TEAS exam and apply to programs',
                courses: [],
                timeline: 'Year 2, Fall'
            }
        ],
        statistics: {
            totalStudents: 850,
            successRate: 65,
            avgGPA: 3.6,
            avgTransferTime: '2.3 years'
        },
        resources: {
            counselors: [
                'Dr. Patricia Williams - Nursing Transfer Counselor',
                'Prof. Robert Johnson - Biology Department',
                'Susan Lee - Health Sciences Center'
            ],
            websites: [
                'https://assist.org/',
                'https://www.atitesting.com/teas',
                'https://www.calstate.edu/apply'
            ],
            documents: [
                'Nursing Transfer Guide 2024',
                'TEAS Exam Information',
                'Nursing Prerequisites Checklist'
            ]
        }
    }
]

// Helper functions for pathway management
export function getPathwaysByMajor(major: string): TransferPathway[] {
    return TRANSFER_PATHWAYS.filter(pathway =>
        pathway.major.toLowerCase().includes(major.toLowerCase()) ||
        pathway.majorCode.toLowerCase().includes(major.toLowerCase())
    )
}

export function getPathwaysByCategory(category: keyof typeof MAJOR_CATEGORIES): TransferPathway[] {
    const majorsInCategory = MAJOR_CATEGORIES[category]
    return TRANSFER_PATHWAYS.filter(pathway =>
        majorsInCategory.some(major =>
            pathway.major.toLowerCase().includes(major.toLowerCase())
        )
    )
}

export function getPathwaysBySystem(system: 'UC' | 'CSU' | 'BOTH'): TransferPathway[] {
    return TRANSFER_PATHWAYS.filter(pathway => pathway.targetSystem === system)
}

export function getPathwayById(id: string): TransferPathway | undefined {
    return TRANSFER_PATHWAYS.find(pathway => pathway.id === id)
}

export function searchPathways(query: string): TransferPathway[] {
    const lowercaseQuery = query.toLowerCase()
    return TRANSFER_PATHWAYS.filter(pathway =>
        pathway.major.toLowerCase().includes(lowercaseQuery) ||
        pathway.majorCode.toLowerCase().includes(lowercaseQuery) ||
        pathway.targetUniversities.some(uni =>
            uni.name.toLowerCase().includes(lowercaseQuery)
        )
    )
}

export function getPathwayStatistics() {
    const totalPathways = TRANSFER_PATHWAYS.length
    const totalStudents = TRANSFER_PATHWAYS.reduce((sum, pathway) => sum + pathway.statistics.totalStudents, 0)
    const avgSuccessRate = TRANSFER_PATHWAYS.reduce((sum, pathway) => sum + pathway.statistics.successRate, 0) / totalPathways
    const avgGPA = TRANSFER_PATHWAYS.reduce((sum, pathway) => sum + pathway.statistics.avgGPA, 0) / totalPathways

    return {
        totalPathways,
        totalStudents,
        avgSuccessRate: Math.round(avgSuccessRate),
        avgGPA: Math.round(avgGPA * 10) / 10,
        categories: Object.keys(MAJOR_CATEGORIES).length
    }
}