-- Transfer.ai Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    current_college TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    intended_major TEXT,
    target_state TEXT,
    degree_goal TEXT,
    target_universities TEXT[],
    preferred_transfer_timeline TEXT,
    current_gpa DECIMAL(3,2),
    completed_credits INTEGER DEFAULT 0,
    transfer_goals TEXT[],
    career_interests TEXT[],
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for student_profiles
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_email ON student_profiles(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_state ON student_profiles(target_state);
CREATE INDEX IF NOT EXISTS idx_student_profiles_major ON student_profiles(intended_major);

-- Create trigger for student_profiles updated_at
CREATE TRIGGER update_student_profiles_updated_at 
    BEFORE UPDATE ON student_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for student_profiles
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_profiles
CREATE POLICY "Users can view their own student profile" ON student_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile" ON student_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile" ON student_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own student profile" ON student_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution TEXT NOT NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    department TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    prerequisites TEXT[],
    corequisites TEXT[],
    professor_name TEXT,
    professor_email TEXT,
    professor_rmp_id TEXT, -- RateMyProfessors ID for API integration
    professor_rating DECIMAL(3,2),
    professor_difficulty DECIMAL(3,2),
    professor_would_take_again DECIMAL(3,2),
    professor_total_ratings INTEGER DEFAULT 0,
    class_times JSONB, -- Store multiple time slots as JSON
    location TEXT,
    capacity INTEGER,
    enrolled INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,
    semester TEXT NOT NULL, -- e.g., "Fall 2024", "Spring 2025"
    academic_year TEXT NOT NULL,
    transfer_credits BOOLEAN DEFAULT true,
    transfer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for courses table
CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_professor ON courses(professor_name);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(professor_rating);
CREATE INDEX IF NOT EXISTS idx_courses_course_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_transfer_credits ON courses(transfer_credits);

-- Create trigger for courses updated_at
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses (public read access)
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert courses" ON courses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update courses" ON courses
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete courses" ON courses
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create transfer_pathways table
CREATE TABLE IF NOT EXISTS transfer_pathways (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_university TEXT NOT NULL,
    major TEXT NOT NULL,
    state TEXT NOT NULL,
    guaranteed_transfer BOOLEAN DEFAULT false,
    requirements_met INTEGER DEFAULT 0,
    total_requirements INTEGER DEFAULT 15,
    estimated_transfer_credits INTEGER DEFAULT 0,
    timeline TEXT DEFAULT '2-year',
    acceptance_rate DECIMAL(5,2),
    min_gpa DECIMAL(3,2),
    application_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transfer_pathways_user_id ON transfer_pathways(user_id);
CREATE INDEX IF NOT EXISTS idx_transfer_pathways_state ON transfer_pathways(state);
CREATE INDEX IF NOT EXISTS idx_transfer_pathways_major ON transfer_pathways(major);
CREATE INDEX IF NOT EXISTS idx_transfer_pathways_guaranteed ON transfer_pathways(guaranteed_transfer);
CREATE INDEX IF NOT EXISTS idx_transfer_pathways_timeline ON transfer_pathways(timeline);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_transfer_pathways_updated_at 
    BEFORE UPDATE ON transfer_pathways 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE transfer_pathways ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own transfer pathways" ON transfer_pathways
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transfer pathways" ON transfer_pathways
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transfer pathways" ON transfer_pathways
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transfer pathways" ON transfer_pathways
    FOR DELETE USING (auth.uid() = user_id);

-- Create a public view for browsing transfer pathways (without user-specific data)
CREATE OR REPLACE VIEW public_transfer_pathways AS
SELECT 
    id,
    target_university,
    major,
    state,
    guaranteed_transfer,
    requirements_met,
    total_requirements,
    estimated_transfer_credits,
    timeline,
    acceptance_rate,
    min_gpa,
    application_deadline
FROM transfer_pathways;

-- Grant access to the public view
GRANT SELECT ON public_transfer_pathways TO anon;
GRANT SELECT ON public_transfer_pathways TO authenticated;

-- Insert sample data for demonstration
INSERT INTO transfer_pathways (
    user_id,
    target_university,
    major,
    state,
    guaranteed_transfer,
    requirements_met,
    total_requirements,
    estimated_transfer_credits,
    timeline,
    acceptance_rate,
    min_gpa,
    application_deadline
) VALUES 
-- California Universities
('00000000-0000-0000-0000-000000000000', 'UCLA', 'Computer Science', 'California', true, 12, 15, 60, '2-year', 12.4, 3.4, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Berkeley', 'Computer Science', 'California', true, 10, 15, 55, '2-year', 14.4, 3.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC San Diego', 'Computer Science', 'California', false, 8, 15, 45, '2-year', 34.3, 3.2, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Irvine', 'Computer Science', 'California', false, 9, 15, 50, '2-year', 28.7, 3.3, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Davis', 'Computer Science', 'California', true, 11, 15, 58, '2-year', 46.3, 3.1, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'USC', 'Computer Science', 'California', false, 7, 15, 40, '2-year', 11.4, 3.6, '2024-11-30'),

-- Engineering
('00000000-0000-0000-0000-000000000000', 'UCLA', 'Engineering', 'California', true, 13, 15, 62, '2-year', 12.4, 3.4, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Berkeley', 'Engineering', 'California', true, 11, 15, 56, '2-year', 14.4, 3.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'Stanford University', 'Engineering', 'California', false, 6, 15, 35, '2-year', 4.3, 3.8, '2024-11-30'),

-- Business
('00000000-0000-0000-0000-000000000000', 'UCLA', 'Business Administration', 'California', false, 9, 15, 48, '2-year', 12.4, 3.3, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Berkeley', 'Business Administration', 'California', false, 8, 15, 45, '2024-11-30', 14.4, 3.4, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'USC', 'Business Administration', 'California', false, 10, 15, 52, '2024-11-30', 11.4, 3.5, '2024-11-30'),

-- Other States
('00000000-0000-0000-0000-000000000000', 'University of Washington', 'Computer Science', 'Washington', false, 7, 15, 42, '2024-11-30', 53.5, 3.2, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Oregon', 'Computer Science', 'Oregon', true, 12, 15, 58, '2024-11-30', 83.4, 2.8, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Arizona', 'Computer Science', 'Arizona', true, 11, 15, 55, '2024-11-30', 85.1, 2.7, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'Arizona State University', 'Computer Science', 'Arizona', true, 13, 15, 60, '2024-11-30', 88.2, 2.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Texas at Austin', 'Computer Science', 'Texas', false, 8, 15, 45, '2024-11-30', 31.8, 3.3, '2024-11-30'),

-- 1-year transfers
('00000000-0000-0000-0000-000000000000', 'UC Merced', 'Computer Science', 'California', true, 15, 15, 70, '1-year', 85.4, 2.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Riverside', 'Computer Science', 'California', true, 14, 15, 65, '1-year', 65.8, 2.8, '2024-11-30'),

-- Flexible timeline
('00000000-0000-0000-0000-000000000000', 'UC Santa Cruz', 'Computer Science', 'California', false, 6, 15, 35, 'flexible', 47.1, 3.0, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Nevada, Reno', 'Computer Science', 'Nevada', true, 12, 15, 58, 'flexible', 88.1, 2.6, '2024-11-30');

-- Insert sample courses data
INSERT INTO courses (
    institution,
    course_code,
    course_name,
    department,
    credits,
    description,
    prerequisites,
    professor_name,
    professor_rating,
    professor_difficulty,
    professor_would_take_again,
    professor_total_ratings,
    class_times,
    location,
    capacity,
    enrolled,
    semester,
    academic_year,
    transfer_credits
) VALUES 
-- Computer Science Courses
('Santa Monica College', 'CS 1', 'Introduction to Computer Science', 'Computer Science', 4, 'Fundamental concepts of computer programming and problem solving using Python.', ARRAY['Math 1'], 'Dr. Sarah Johnson', 4.2, 2.8, 0.85, 127, '[{"days": "MW", "start_time": "09:00", "end_time": "10:50", "type": "Lecture"}, {"days": "F", "start_time": "09:00", "end_time": "11:50", "type": "Lab"}]', 'Science Building 101', 30, 28, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'CS 1', 'Introduction to Computer Science', 'Computer Science', 4, 'Fundamental concepts of computer programming and problem solving using Python.', ARRAY['Math 1'], 'Prof. Michael Chen', 3.8, 3.2, 0.72, 89, '[{"days": "TTh", "start_time": "14:00", "end_time": "15:50", "type": "Lecture"}, {"days": "F", "start_time": "14:00", "end_time": "16:50", "type": "Lab"}]', 'Science Building 102', 30, 25, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'CS 2', 'Data Structures and Algorithms', 'Computer Science', 4, 'Advanced programming concepts including data structures, algorithms, and object-oriented design.', ARRAY['CS 1'], 'Dr. Emily Rodriguez', 4.5, 3.5, 0.91, 156, '[{"days": "MW", "start_time": "11:00", "end_time": "12:50", "type": "Lecture"}, {"days": "T", "start_time": "11:00", "end_time": "13:50", "type": "Lab"}]', 'Science Building 201', 25, 22, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'CS 3', 'Computer Architecture', 'Computer Science', 3, 'Introduction to computer hardware, assembly language, and system architecture.', ARRAY['CS 2'], 'Prof. David Kim', 3.9, 3.8, 0.68, 94, '[{"days": "TTh", "start_time": "09:00", "end_time": "10:15", "type": "Lecture"}]', 'Science Building 301', 20, 18, 'Fall 2024', '2024-2025', true),

-- Mathematics Courses
('Santa Monica College', 'Math 1', 'Calculus I', 'Mathematics', 5, 'Limits, continuity, differentiation, and applications of derivatives.', ARRAY['Precalculus'], 'Dr. Robert Wilson', 4.1, 3.1, 0.78, 203, '[{"days": "MWF", "start_time": "08:00", "end_time": "09:15", "type": "Lecture"}, {"days": "TTh", "start_time": "08:00", "end_time": "09:50", "type": "Discussion"}]', 'Math Building 101', 35, 32, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'Math 2', 'Calculus II', 'Mathematics', 5, 'Integration techniques, applications of integrals, and infinite series.', ARRAY['Math 1'], 'Prof. Lisa Thompson', 4.3, 3.4, 0.82, 167, '[{"days": "MWF", "start_time": "10:00", "end_time": "11:15", "type": "Lecture"}, {"days": "TTh", "start_time": "10:00", "end_time": "11:50", "type": "Discussion"}]', 'Math Building 102', 30, 28, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'Math 3', 'Linear Algebra', 'Mathematics', 4, 'Systems of linear equations, matrices, vector spaces, and linear transformations.', ARRAY['Math 2'], 'Dr. James Anderson', 4.0, 3.6, 0.75, 142, '[{"days": "TTh", "start_time": "11:00", "end_time": "12:15", "type": "Lecture"}, {"days": "F", "start_time": "11:00", "end_time": "12:50", "type": "Discussion"}]', 'Math Building 201', 25, 23, 'Fall 2024', '2024-2025', true),

-- Physics Courses
('Santa Monica College', 'Physics 1', 'Mechanics and Wave Motion', 'Physics', 4, 'Classical mechanics, wave phenomena, and laboratory experiments.', ARRAY['Math 1'], 'Dr. Patricia Martinez', 4.4, 3.3, 0.87, 178, '[{"days": "MW", "start_time": "13:00", "end_time": "14:50", "type": "Lecture"}, {"days": "T", "start_time": "13:00", "end_time": "15:50", "type": "Lab"}]', 'Physics Building 101', 28, 26, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'Physics 2', 'Electricity and Magnetism', 'Physics', 4, 'Electric fields, magnetic fields, electromagnetic waves, and laboratory experiments.', ARRAY['Physics 1'], 'Prof. Kevin O''Brien', 3.7, 3.7, 0.71, 134, '[{"days": "TTh", "start_time": "13:00", "end_time": "14:50", "type": "Lecture"}, {"days": "W", "start_time": "13:00", "end_time": "15:50", "type": "Lab"}]', 'Physics Building 102', 25, 22, 'Fall 2024', '2024-2025', true),

-- English Courses
('Santa Monica College', 'English 1', 'Composition and Reading', 'English', 4, 'College-level writing, critical reading, and analytical thinking.', ARRAY[], 'Dr. Jennifer Lee', 4.2, 2.5, 0.88, 245, '[{"days": "MW", "start_time": "10:00", "end_time": "11:50", "type": "Lecture"}]', 'Humanities Building 101', 30, 29, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'English 2', 'Critical Thinking and Composition', 'English', 4, 'Advanced composition, argumentation, and research methods.', ARRAY['English 1'], 'Prof. Thomas Garcia', 3.9, 2.8, 0.79, 198, '[{"days": "TTh", "start_time": "10:00", "end_time": "11:50", "type": "Lecture"}]', 'Humanities Building 102', 28, 26, 'Fall 2024', '2024-2025', true),

-- Business Courses
('Santa Monica College', 'Business 1', 'Introduction to Business', 'Business', 3, 'Overview of business concepts, management, marketing, and economics.', ARRAY[], 'Dr. Amanda Foster', 4.0, 2.3, 0.85, 167, '[{"days": "MWF", "start_time": "14:00", "end_time": "15:15", "type": "Lecture"}]', 'Business Building 101', 35, 33, 'Fall 2024', '2024-2025', true),
('Santa Monica College', 'Business 2', 'Principles of Marketing', 'Business', 3, 'Marketing concepts, consumer behavior, and market analysis.', ARRAY['Business 1'], 'Prof. Christopher Brown', 4.1, 2.6, 0.83, 145, '[{"days": "TTh", "start_time": "14:00", "end_time": "15:15", "type": "Lecture"}]', 'Business Building 102', 30, 28, 'Fall 2024', '2024-2025', true);

-- Create a function to get unique states
CREATE OR REPLACE FUNCTION get_unique_states()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT DISTINCT state 
        FROM transfer_pathways 
        WHERE state IS NOT NULL 
        ORDER BY state
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get unique majors
CREATE OR REPLACE FUNCTION get_unique_majors()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT DISTINCT major 
        FROM transfer_pathways 
        WHERE major IS NOT NULL 
        ORDER BY major
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get unique departments
CREATE OR REPLACE FUNCTION get_unique_departments()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT DISTINCT department 
        FROM courses 
        WHERE department IS NOT NULL 
        ORDER BY department
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get unique institutions
CREATE OR REPLACE FUNCTION get_unique_institutions()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT DISTINCT institution 
        FROM courses 
        WHERE institution IS NOT NULL 
        ORDER BY institution
    );
END;
$$ LANGUAGE plpgsql; 