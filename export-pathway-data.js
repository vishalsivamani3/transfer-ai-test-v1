#!/usr/bin/env node

// Export script for transfer pathway data
// This script exports the pathway data to various formats

const fs = require('fs')
const path = require('path')

// Import the export functions (we'll need to compile TypeScript first)
// For now, let's create a simple export script

const pathwayData = {
    pathways: [
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
        }
    ],
    categories: {
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
        ]
    }
}

// Generate SQL export
function generateSQL() {
    let sql = '-- Transfer Pathway Data Export\n'
    sql += '-- Generated from JavaScript data\n\n'

    // Insert transfer pathways
    sql += '-- Insert Transfer Pathways\n'
    pathwayData.pathways.forEach(pathway => {
        sql += `INSERT INTO transfer_pathways (id, major, major_code, target_system) VALUES\n`
        sql += `('${pathway.id}', '${pathway.major.replace(/'/g, "''")}', '${pathway.majorCode}', '${pathway.targetSystem}');\n\n`
    })

    return sql
}

// Generate JSON export
function generateJSON() {
    return JSON.stringify({
        ...pathwayData,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    }, null, 2)
}

// Generate CSV export
function generateCSV() {
    let csv = 'Pathway ID,Major,Major Code,Target System,University Count,Success Rate,Total Students,Avg GPA\n'

    pathwayData.pathways.forEach(pathway => {
        csv += `${pathway.id},${pathway.major},${pathway.majorCode},${pathway.targetSystem},${pathway.targetUniversities.length},${pathway.statistics.successRate},${pathway.statistics.totalStudents},${pathway.statistics.avgGPA}\n`
    })

    return csv
}

// Create output directory
const outputDir = path.join(__dirname, 'exported-data')
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

// Export data
console.log('Exporting transfer pathway data...')

// Export SQL
const sqlData = generateSQL()
fs.writeFileSync(path.join(outputDir, 'transfer-pathways.sql'), sqlData)
console.log('✓ SQL export created: exported-data/transfer-pathways.sql')

// Export JSON
const jsonData = generateJSON()
fs.writeFileSync(path.join(outputDir, 'transfer-pathways.json'), jsonData)
console.log('✓ JSON export created: exported-data/transfer-pathways.json')

// Export CSV
const csvData = generateCSV()
fs.writeFileSync(path.join(outputDir, 'transfer-pathways.csv'), csvData)
console.log('✓ CSV export created: exported-data/transfer-pathways.csv')

console.log('\nExport completed successfully!')
console.log('Files created in:', outputDir)