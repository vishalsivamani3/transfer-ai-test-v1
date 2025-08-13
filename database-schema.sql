-- Transfer.ai Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

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
('00000000-0000-0000-0000-000000000000', 'UC Berkeley', 'Business Administration', 'California', false, 8, 15, 45, '2-year', 14.4, 3.4, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'USC', 'Business Administration', 'California', false, 10, 15, 52, '2-year', 11.4, 3.5, '2024-11-30'),

-- Other States
('00000000-0000-0000-0000-000000000000', 'University of Washington', 'Computer Science', 'Washington', false, 7, 15, 42, '2-year', 53.5, 3.2, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Oregon', 'Computer Science', 'Oregon', true, 12, 15, 58, '2-year', 83.4, 2.8, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Arizona', 'Computer Science', 'Arizona', true, 11, 15, 55, '2-year', 85.1, 2.7, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'Arizona State University', 'Computer Science', 'Arizona', true, 13, 15, 60, '2-year', 88.2, 2.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Texas at Austin', 'Computer Science', 'Texas', false, 8, 15, 45, '2-year', 31.8, 3.3, '2024-11-30'),

-- 1-year transfers
('00000000-0000-0000-0000-000000000000', 'UC Merced', 'Computer Science', 'California', true, 15, 15, 70, '1-year', 85.4, 2.5, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'UC Riverside', 'Computer Science', 'California', true, 14, 15, 65, '1-year', 65.8, 2.8, '2024-11-30'),

-- Flexible timeline
('00000000-0000-0000-0000-000000000000', 'UC Santa Cruz', 'Computer Science', 'California', false, 6, 15, 35, 'flexible', 47.1, 3.0, '2024-11-30'),
('00000000-0000-0000-0000-000000000000', 'University of Nevada, Reno', 'Computer Science', 'Nevada', true, 12, 15, 58, 'flexible', 88.1, 2.6, '2024-11-30');

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