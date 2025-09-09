-- Transfer Pathways Database Schema
-- This schema supports comprehensive transfer pathway data for community college to CSU/UC transfer

-- Transfer Pathways Table
CREATE TABLE transfer_pathways (
    id VARCHAR(50) PRIMARY KEY,
    major VARCHAR(100) NOT NULL,
    major_code VARCHAR(10) NOT NULL,
    target_system ENUM('UC', 'CSU', 'BOTH') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_major (major),
    INDEX idx_major_code (major_code),
    INDEX idx_target_system (target_system)
);

-- Target Universities Table
CREATE TABLE target_universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pathway_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type ENUM('UC', 'CSU') NOT NULL,
    min_gpa DECIMAL(3,2) NOT NULL,
    min_units INT NOT NULL,
    transfer_guarantee BOOLEAN DEFAULT FALSE,
    priority_deadline DATE,
    application_deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    INDEX idx_pathway_id (pathway_id),
    INDEX idx_name (name),
    INDEX idx_type (type)
);

-- Required Courses Table
CREATE TABLE required_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    course_type ENUM('required', 'recommended') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES target_universities(id) ON DELETE CASCADE,
    INDEX idx_university_id (university_id),
    INDEX idx_course_type (course_type)
);

-- Additional Requirements Table
CREATE TABLE additional_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES target_universities(id) ON DELETE CASCADE,
    INDEX idx_university_id (university_id)
);

-- Common Requirements Table
CREATE TABLE common_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pathway_id VARCHAR(50) NOT NULL,
    igetc_required BOOLEAN DEFAULT FALSE,
    csuge_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    INDEX idx_pathway_id (pathway_id)
);

-- Major Preparation Requirements Table
CREATE TABLE major_prep_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    common_req_id INT NOT NULL,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (common_req_id) REFERENCES common_requirements(id) ON DELETE CASCADE,
    INDEX idx_common_req_id (common_req_id)
);

-- General Education Requirements Table
CREATE TABLE general_ed_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    common_req_id INT NOT NULL,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (common_req_id) REFERENCES common_requirements(id) ON DELETE CASCADE,
    INDEX idx_common_req_id (common_req_id)
);

-- Pathway Steps Table
CREATE TABLE pathway_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pathway_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timeline VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    INDEX idx_pathway_id (pathway_id),
    INDEX idx_step_number (step_number)
);

-- Pathway Step Courses Table
CREATE TABLE pathway_step_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (step_id) REFERENCES pathway_steps(id) ON DELETE CASCADE,
    INDEX idx_step_id (step_id)
);

-- Pathway Statistics Table
CREATE TABLE pathway_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pathway_id VARCHAR(50) NOT NULL,
    total_students INT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_gpa DECIMAL(3,2) DEFAULT 0.00,
    avg_transfer_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    INDEX idx_pathway_id (pathway_id)
);

-- Pathway Resources Table
CREATE TABLE pathway_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pathway_id VARCHAR(50) NOT NULL,
    resource_type ENUM('counselor', 'website', 'document') NOT NULL,
    resource_name VARCHAR(200) NOT NULL,
    resource_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    INDEX idx_pathway_id (pathway_id),
    INDEX idx_resource_type (resource_type)
);

-- Major Categories Table
CREATE TABLE major_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
);

-- Major Category Mappings Table
CREATE TABLE major_category_mappings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    pathway_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES major_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    UNIQUE KEY unique_mapping (category_id, pathway_id),
    INDEX idx_category_id (category_id),
    INDEX idx_pathway_id (pathway_id)
);

-- Student Pathway Tracking Table
CREATE TABLE student_pathway_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    pathway_id VARCHAR(50) NOT NULL,
    target_university_id INT NOT NULL,
    current_step INT DEFAULT 1,
    completed_courses JSON,
    gpa DECIMAL(3,2),
    status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
    start_date DATE,
    target_transfer_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES transfer_pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (target_university_id) REFERENCES target_universities(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_pathway_id (pathway_id),
    INDEX idx_status (status)
);

-- Course Equivalencies Table (for mapping community college courses to university requirements)
CREATE TABLE course_equivalencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    community_college_code VARCHAR(20) NOT NULL,
    community_college_title VARCHAR(200) NOT NULL,
    university_code VARCHAR(20) NOT NULL,
    university_title VARCHAR(200) NOT NULL,
    university_id INT NOT NULL,
    equivalency_type ENUM('direct', 'partial', 'recommended') NOT NULL,
    units_transferred DECIMAL(3,1),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES target_universities(id) ON DELETE CASCADE,
    INDEX idx_cc_code (community_college_code),
    INDEX idx_university_code (university_code),
    INDEX idx_university_id (university_id),
    INDEX idx_equivalency_type (equivalency_type)
);

-- Views for easier querying
CREATE VIEW pathway_summary AS
SELECT 
    tp.id,
    tp.major,
    tp.major_code,
    tp.target_system,
    COUNT(DISTINCT tu.id) as university_count,
    AVG(tu.min_gpa) as avg_min_gpa,
    AVG(ps.success_rate) as avg_success_rate,
    AVG(ps.total_students) as avg_students
FROM transfer_pathways tp
LEFT JOIN target_universities tu ON tp.id = tu.pathway_id
LEFT JOIN pathway_statistics ps ON tp.id = ps.pathway_id
GROUP BY tp.id, tp.major, tp.major_code, tp.target_system;

CREATE VIEW university_requirements AS
SELECT 
    tu.id as university_id,
    tu.name as university_name,
    tu.code as university_code,
    tu.type as university_type,
    tp.major,
    tp.major_code,
    tu.min_gpa,
    tu.min_units,
    tu.transfer_guarantee,
    COUNT(rc.id) as required_course_count,
    COUNT(CASE WHEN rc.course_type = 'recommended' THEN 1 END) as recommended_course_count
FROM target_universities tu
JOIN transfer_pathways tp ON tu.pathway_id = tp.id
LEFT JOIN required_courses rc ON tu.id = rc.university_id
GROUP BY tu.id, tu.name, tu.code, tu.type, tp.major, tp.major_code, tu.min_gpa, tu.min_units, tu.transfer_guarantee;

-- Insert sample data
INSERT INTO major_categories (category_name, description) VALUES
('STEM', 'Science, Technology, Engineering, and Mathematics'),
('Business', 'Business Administration and related fields'),
('Liberal Arts', 'Humanities and Social Sciences'),
('Health Sciences', 'Health and Medical related fields'),
('Education', 'Teaching and Education fields'),
('Arts & Design', 'Creative and Design fields');

-- Sample pathway data insertion (this would be populated from the TypeScript data)
-- INSERT INTO transfer_pathways (id, major, major_code, target_system) VALUES
-- ('cs-uc-pathway', 'Computer Science', 'CS', 'UC'),
-- ('business-csu-pathway', 'Business Administration', 'BUS', 'CSU'),
-- ('nursing-pathway', 'Nursing', 'NURS', 'BOTH');