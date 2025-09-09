// Export utility for transfer pathway data
// This script exports the TypeScript pathway data to SQL format for database insertion

import { TRANSFER_PATHWAYS, MAJOR_CATEGORIES } from './transfer-pathways'

export function generatePathwaySQL() {
    let sql = '-- Transfer Pathway Data Export\n'
    sql += '-- Generated from TypeScript data\n\n'

    // Insert transfer pathways
    sql += '-- Insert Transfer Pathways\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        sql += `INSERT INTO transfer_pathways (id, major, major_code, target_system) VALUES\n`
        sql += `('${pathway.id}', '${pathway.major.replace(/'/g, "''")}', '${pathway.majorCode}', '${pathway.targetSystem}');\n\n`
    })

    // Insert target universities
    sql += '-- Insert Target Universities\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.targetUniversities.forEach(uni => {
            const priorityDeadline = uni.requirements.priorityDeadline ? `'${uni.requirements.priorityDeadline}'` : 'NULL'
            const applicationDeadline = uni.requirements.applicationDeadline ? `'${uni.requirements.applicationDeadline}'` : 'NULL'

            sql += `INSERT INTO target_universities (pathway_id, name, code, type, min_gpa, min_units, transfer_guarantee, priority_deadline, application_deadline) VALUES\n`
            sql += `('${pathway.id}', '${uni.name.replace(/'/g, "''")}', '${uni.code}', '${uni.type}', ${uni.requirements.minGPA}, ${uni.requirements.minUnits}, ${uni.transferGuarantee}, ${priorityDeadline}, ${applicationDeadline});\n\n`
        })
    })

    // Insert required courses
    sql += '-- Insert Required Courses\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.targetUniversities.forEach((uni, uniIndex) => {
            const universityId = `(SELECT id FROM target_universities WHERE pathway_id = '${pathway.id}' AND name = '${uni.name.replace(/'/g, "''")}')`

            uni.requirements.requiredCourses.forEach(course => {
                const [courseCode, courseTitle] = course.split(' (')
                const cleanTitle = courseTitle ? courseTitle.replace(')', '') : courseCode

                sql += `INSERT INTO required_courses (university_id, course_code, course_title, course_type) VALUES\n`
                sql += `(${universityId}, '${courseCode}', '${cleanTitle.replace(/'/g, "''")}', 'required');\n\n`
            })

            uni.requirements.recommendedCourses.forEach(course => {
                const [courseCode, courseTitle] = course.split(' (')
                const cleanTitle = courseTitle ? courseTitle.replace(')', '') : courseCode

                sql += `INSERT INTO required_courses (university_id, course_code, course_title, course_type) VALUES\n`
                sql += `(${universityId}, '${courseCode}', '${cleanTitle.replace(/'/g, "''")}', 'recommended');\n\n`
            })
        })
    })

    // Insert additional requirements
    sql += '-- Insert Additional Requirements\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.targetUniversities.forEach(uni => {
            const universityId = `(SELECT id FROM target_universities WHERE pathway_id = '${pathway.id}' AND name = '${uni.name.replace(/'/g, "''")}')`

            uni.requirements.additionalRequirements.forEach(req => {
                sql += `INSERT INTO additional_requirements (university_id, requirement) VALUES\n`
                sql += `(${universityId}, '${req.replace(/'/g, "''")}');\n\n`
            })
        })
    })

    // Insert common requirements
    sql += '-- Insert Common Requirements\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        sql += `INSERT INTO common_requirements (pathway_id, igetc_required, csuge_required) VALUES\n`
        sql += `('${pathway.id}', ${pathway.commonRequirements.IGETC}, ${pathway.commonRequirements.CSUGE});\n\n`
    })

    // Insert major prep requirements
    sql += '-- Insert Major Prep Requirements\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        const commonReqId = `(SELECT id FROM common_requirements WHERE pathway_id = '${pathway.id}')`

        pathway.commonRequirements.majorPrep.forEach(req => {
            sql += `INSERT INTO major_prep_requirements (common_req_id, requirement) VALUES\n`
            sql += `(${commonReqId}, '${req.replace(/'/g, "''")}');\n\n`
        })
    })

    // Insert general ed requirements
    sql += '-- Insert General Education Requirements\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        const commonReqId = `(SELECT id FROM common_requirements WHERE pathway_id = '${pathway.id}')`

        pathway.commonRequirements.generalEd.forEach(req => {
            sql += `INSERT INTO general_ed_requirements (common_req_id, requirement) VALUES\n`
            sql += `(${commonReqId}, '${req.replace(/'/g, "''")}');\n\n`
        })
    })

    // Insert pathway steps
    sql += '-- Insert Pathway Steps\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.pathwaySteps.forEach(step => {
            sql += `INSERT INTO pathway_steps (pathway_id, step_number, title, description, timeline) VALUES\n`
            sql += `('${pathway.id}', ${step.step}, '${step.title.replace(/'/g, "''")}', '${step.description.replace(/'/g, "''")}', '${step.timeline.replace(/'/g, "''")}');\n\n`
        })
    })

    // Insert pathway step courses
    sql += '-- Insert Pathway Step Courses\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.pathwaySteps.forEach(step => {
            const stepId = `(SELECT id FROM pathway_steps WHERE pathway_id = '${pathway.id}' AND step_number = ${step.step})`

            step.courses.forEach(course => {
                const [courseCode, courseTitle] = course.split(' (')
                const cleanTitle = courseTitle ? courseTitle.replace(')', '') : courseCode

                sql += `INSERT INTO pathway_step_courses (step_id, course_code, course_title) VALUES\n`
                sql += `(${stepId}, '${courseCode}', '${cleanTitle.replace(/'/g, "''")}');\n\n`
            })
        })
    })

    // Insert pathway statistics
    sql += '-- Insert Pathway Statistics\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        sql += `INSERT INTO pathway_statistics (pathway_id, total_students, success_rate, avg_gpa, avg_transfer_time) VALUES\n`
        sql += `('${pathway.id}', ${pathway.statistics.totalStudents}, ${pathway.statistics.successRate}, ${pathway.statistics.avgGPA}, '${pathway.statistics.avgTransferTime}');\n\n`
    })

    // Insert pathway resources
    sql += '-- Insert Pathway Resources\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        pathway.resources.counselors.forEach(counselor => {
            sql += `INSERT INTO pathway_resources (pathway_id, resource_type, resource_name) VALUES\n`
            sql += `('${pathway.id}', 'counselor', '${counselor.replace(/'/g, "''")}');\n\n`
        })

        pathway.resources.websites.forEach(website => {
            sql += `INSERT INTO pathway_resources (pathway_id, resource_type, resource_name, resource_url) VALUES\n`
            sql += `('${pathway.id}', 'website', '${website.replace(/'/g, "''")}', '${website}');\n\n`
        })

        pathway.resources.documents.forEach(document => {
            sql += `INSERT INTO pathway_resources (pathway_id, resource_type, resource_name) VALUES\n`
            sql += `('${pathway.id}', 'document', '${document.replace(/'/g, "''")}');\n\n`
        })
    })

    // Insert major category mappings
    sql += '-- Insert Major Category Mappings\n'
    TRANSFER_PATHWAYS.forEach(pathway => {
        Object.entries(MAJOR_CATEGORIES).forEach(([category, majors]) => {
            if (majors.some(major => pathway.major.toLowerCase().includes(major.toLowerCase()))) {
                const categoryId = `(SELECT id FROM major_categories WHERE category_name = '${category}')`
                sql += `INSERT INTO major_category_mappings (category_id, pathway_id) VALUES\n`
                sql += `(${categoryId}, '${pathway.id}');\n\n`
            }
        })
    })

    return sql
}

// Export function to generate JSON data
export function generatePathwayJSON() {
    return {
        pathways: TRANSFER_PATHWAYS,
        categories: MAJOR_CATEGORIES,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    }
}

// Export function to generate CSV data
export function generatePathwayCSV() {
    let csv = 'Pathway ID,Major,Major Code,Target System,University Count,Success Rate,Total Students,Avg GPA\n'

    TRANSFER_PATHWAYS.forEach(pathway => {
        csv += `${pathway.id},${pathway.major},${pathway.majorCode},${pathway.targetSystem},${pathway.targetUniversities.length},${pathway.statistics.successRate},${pathway.statistics.totalStudents},${pathway.statistics.avgGPA}\n`
    })

    return csv
}

// Utility function to validate pathway data
export function validatePathwayData() {
    const errors: string[] = []

    TRANSFER_PATHWAYS.forEach(pathway => {
        if (!pathway.id) errors.push(`Pathway missing ID: ${pathway.major}`)
        if (!pathway.major) errors.push(`Pathway missing major: ${pathway.id}`)
        if (!pathway.majorCode) errors.push(`Pathway missing major code: ${pathway.id}`)
        if (!pathway.targetSystem) errors.push(`Pathway missing target system: ${pathway.id}`)
        if (pathway.targetUniversities.length === 0) errors.push(`Pathway has no target universities: ${pathway.id}`)
        if (pathway.pathwaySteps.length === 0) errors.push(`Pathway has no steps: ${pathway.id}`)

        pathway.targetUniversities.forEach((uni, index) => {
            if (!uni.name) errors.push(`University ${index} missing name in pathway: ${pathway.id}`)
            if (!uni.code) errors.push(`University ${index} missing code in pathway: ${pathway.id}`)
            if (!uni.type) errors.push(`University ${index} missing type in pathway: ${pathway.id}`)
            if (uni.requirements.minGPA < 0 || uni.requirements.minGPA > 4.0) {
                errors.push(`Invalid GPA requirement in pathway: ${pathway.id}, university: ${uni.name}`)
            }
        })
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Export all functions
export default {
    generatePathwaySQL,
    generatePathwayJSON,
    generatePathwayCSV,
    validatePathwayData
}