-- Update courses table to include ASSIST-specific fields and college-native tags
-- This script enhances the existing courses table with proper ASSIST integration

-- Add new columns to courses table for ASSIST integration
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_id INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_code TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_type TEXT CHECK (college_type IN ('UC', 'CSU', 'CCC', 'AICCU'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_city TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_state TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS college_website TEXT;

-- Add transfer agreement and GE requirement tracking
ALTER TABLE courses ADD COLUMN IF NOT EXISTS transfer_types TEXT[]; -- Array of transfer types like ['UC_TRANSFERABLE', 'CSU_TRANSFERABLE']
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ge_areas TEXT[]; -- Array of GE areas like ['A1', 'B2', 'C1']
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ge_systems TEXT[]; -- Array of GE systems like ['IGETC', 'CSU_GE', 'UC_GE']
ALTER TABLE courses ADD COLUMN IF NOT EXISTS major_requirements TEXT[]; -- Array of major names this course satisfies
ALTER TABLE courses ADD COLUMN IF NOT EXISTS equivalent_courses JSONB; -- JSON object mapping target colleges to equivalent courses

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);
CREATE INDEX IF NOT EXISTS idx_courses_college_type ON courses(college_type);
CREATE INDEX IF NOT EXISTS idx_courses_transfer_types ON courses USING GIN(transfer_types);
CREATE INDEX IF NOT EXISTS idx_courses_ge_areas ON courses USING GIN(ge_areas);
CREATE INDEX IF NOT EXISTS idx_courses_ge_systems ON courses USING GIN(ge_systems);
CREATE INDEX IF NOT EXISTS idx_courses_major_requirements ON courses USING GIN(major_requirements);

-- Create transfer_agreements table for detailed transfer information
CREATE TABLE IF NOT EXISTS transfer_agreements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    target_college_id INTEGER NOT NULL,
    target_college_name TEXT NOT NULL,
    target_college_code TEXT,
    target_course_code TEXT,
    target_course_name TEXT,
    transfer_type TEXT NOT NULL CHECK (transfer_type IN ('UC_TRANSFERABLE', 'CSU_TRANSFERABLE', 'IGETC_APPROVED', 'CSU_GE_BREADTH', 'CSU_US_HISTORY', 'CAL_GETC')),
    units_transferred DECIMAL(4,2),
    transfer_notes TEXT,
    academic_year TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ge_requirements table for General Education tracking
CREATE TABLE IF NOT EXISTS ge_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    college_id INTEGER NOT NULL,
    ge_area TEXT NOT NULL, -- e.g., 'A1', 'B2', 'C1'
    ge_system TEXT NOT NULL CHECK (ge_system IN ('IGETC', 'CSU_GE', 'UC_GE', 'CAL_GETC')),
    academic_year TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create major_requirements table for major-specific course requirements
CREATE TABLE IF NOT EXISTS major_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    college_id INTEGER NOT NULL,
    major_name TEXT NOT NULL,
    major_code TEXT,
    requirement_type TEXT, -- e.g., 'prerequisite', 'core', 'elective'
    academic_year TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges table for college information
CREATE TABLE IF NOT EXISTS colleges (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('UC', 'CSU', 'CCC', 'AICCU')),
    city TEXT,
    state TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_transfer_agreements_source_course ON transfer_agreements(source_course_id);
CREATE INDEX IF NOT EXISTS idx_transfer_agreements_target_college ON transfer_agreements(target_college_id);
CREATE INDEX IF NOT EXISTS idx_transfer_agreements_transfer_type ON transfer_agreements(transfer_type);
CREATE INDEX IF NOT EXISTS idx_ge_requirements_course ON ge_requirements(course_id);
CREATE INDEX IF NOT EXISTS idx_ge_requirements_college ON ge_requirements(college_id);
CREATE INDEX IF NOT EXISTS idx_ge_requirements_ge_system ON ge_requirements(ge_system);
CREATE INDEX IF NOT EXISTS idx_major_requirements_course ON major_requirements(course_id);
CREATE INDEX IF NOT EXISTS idx_major_requirements_college ON major_requirements(college_id);
CREATE INDEX IF NOT EXISTS idx_major_requirements_major ON major_requirements(major_name);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transfer_agreements_updated_at 
    BEFORE UPDATE ON transfer_agreements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ge_requirements_updated_at 
    BEFORE UPDATE ON ge_requirements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_major_requirements_updated_at 
    BEFORE UPDATE ON major_requirements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at 
    BEFORE UPDATE ON colleges 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for new tables
ALTER TABLE transfer_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ge_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE major_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (allow public read access for transfer data)
CREATE POLICY "Allow public read access to transfer agreements" ON transfer_agreements
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to ge requirements" ON ge_requirements
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to major requirements" ON major_requirements
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to colleges" ON colleges
    FOR SELECT USING (true);

-- Update the courses table to reference colleges
ALTER TABLE courses ADD CONSTRAINT fk_courses_college_id 
    FOREIGN KEY (college_id) REFERENCES colleges(id);

-- Add comments for documentation
COMMENT ON TABLE transfer_agreements IS 'Detailed transfer agreement information between courses and target colleges';
COMMENT ON TABLE ge_requirements IS 'General Education requirements satisfied by courses';
COMMENT ON TABLE major_requirements IS 'Major-specific requirements satisfied by courses';
COMMENT ON TABLE colleges IS 'College and university information for ASSIST integration';

COMMENT ON COLUMN courses.transfer_types IS 'Array of transfer types this course satisfies (UC_TRANSFERABLE, CSU_TRANSFERABLE, etc.)';
COMMENT ON COLUMN courses.ge_areas IS 'Array of GE areas this course satisfies (A1, B2, C1, etc.)';
COMMENT ON COLUMN courses.ge_systems IS 'Array of GE systems this course satisfies (IGETC, CSU_GE, UC_GE, etc.)';
COMMENT ON COLUMN courses.major_requirements IS 'Array of major names this course satisfies';
COMMENT ON COLUMN courses.equivalent_courses IS 'JSON mapping of target colleges to equivalent course codes';
