# Student Profile Mutations Documentation

This document explains the Supabase insert/update mutation functions for storing student profile data in the `student_profiles` table.

## 🗄️ Database Schema

### Student Profiles Table
```sql
CREATE TABLE student_profiles (
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
```

### Key Features
- **Row Level Security**: Users can only access their own profiles
- **Unique User ID**: Each user can only have one profile
- **Automatic Timestamps**: `created_at` and `updated_at` are managed automatically
- **Flexible Fields**: Optional fields for academic goals and preferences

## 🔧 Mutation Functions

### 1. `upsertStudentProfile(profileData: StudentProfileData)`

Creates a new student profile or updates an existing one if the user already has a profile.

```typescript
import { upsertStudentProfile } from '@/lib/queries'

const profileData = {
  user_id: 'user-uuid',
  email: 'student@example.com',
  first_name: 'John',
  last_name: 'Doe',
  current_college: 'Community College',
  academic_year: 'sophomore',
  intended_major: 'Computer Science',
  target_state: 'California',
  degree_goal: 'Bachelor of Science',
  current_gpa: 3.45,
  completed_credits: 24,
  onboarding_completed: true
}

const result = await upsertStudentProfile(profileData)

if (result.success) {
  console.log('Profile created/updated successfully:', result.data)
} else {
  console.error('Error:', result.error)
}
```

### 2. `updateStudentProfile(userId: string, updateData: StudentProfileUpdateData)`

Updates specific fields in an existing student profile.

```typescript
import { updateStudentProfile } from '@/lib/queries'

const updateData = {
  intended_major: 'Engineering',
  target_state: 'Texas',
  degree_goal: 'Bachelor of Engineering',
  current_gpa: 3.6,
  completed_credits: 30
}

const result = await updateStudentProfile('user-uuid', updateData)

if (result.success) {
  console.log('Profile updated successfully:', result.data)
} else {
  console.error('Error:', result.error)
}
```

### 3. `updateStudentGoals(userId: string, targetState: string, intendedMajor: string, degreeGoal: string)`

Convenience function to update the three key goal fields: state, major, and degree goal.

```typescript
import { updateStudentGoals } from '@/lib/queries'

const result = await updateStudentGoals(
  'user-uuid',
  'California',
  'Computer Science',
  'Bachelor of Science'
)

if (result.success) {
  console.log('Goals updated successfully')
} else {
  console.error('Error:', result.error)
}
```

### 4. `getStudentProfile(userId: string)`

Retrieves a student profile by user ID.

```typescript
import { getStudentProfile } from '@/lib/queries'

const result = await getStudentProfile('user-uuid')

if (result.success && result.data) {
  const profile = result.data
  console.log('Profile:', {
    name: `${profile.first_name} ${profile.last_name}`,
    major: profile.intended_major,
    state: profile.target_state,
    degree: profile.degree_goal
  })
} else {
  console.error('Error:', result.error)
}
```

## 📝 Type Definitions

### StudentProfileData Interface
```typescript
export interface StudentProfileData {
  user_id: string
  email: string
  first_name: string
  last_name: string
  current_college: string
  academic_year: string
  intended_major?: string
  target_state?: string
  degree_goal?: string
  target_universities?: string[]
  preferred_transfer_timeline?: string
  current_gpa?: number
  completed_credits?: number
  transfer_goals?: string[]
  career_interests?: string[]
  onboarding_completed?: boolean
}
```

### StudentProfileUpdateData Interface
```typescript
export interface StudentProfileUpdateData {
  intended_major?: string
  target_state?: string
  degree_goal?: string
  target_universities?: string[]
  preferred_transfer_timeline?: string
  current_gpa?: number
  completed_credits?: number
  transfer_goals?: string[]
  career_interests?: string[]
  onboarding_completed?: boolean
}
```

## 🎯 Usage Examples

### Example 1: Complete Profile Creation
```typescript
const createCompleteProfile = async (user: User) => {
  const profileData: StudentProfileData = {
    user_id: user.id,
    email: user.email,
    first_name: 'Jane',
    last_name: 'Smith',
    current_college: 'Santa Monica College',
    academic_year: 'sophomore',
    intended_major: 'Computer Science',
    target_state: 'California',
    degree_goal: 'Bachelor of Science',
    target_universities: ['UCLA', 'UC Berkeley', 'USC'],
    preferred_transfer_timeline: '2-year',
    current_gpa: 3.75,
    completed_credits: 28,
    transfer_goals: ['Maximize transfer credits', 'Maintain high GPA'],
    career_interests: ['Software Engineering', 'Data Science'],
    onboarding_completed: true
  }

  const result = await upsertStudentProfile(profileData)
  return result
}
```

### Example 2: Update Academic Goals
```typescript
const updateAcademicGoals = async (userId: string) => {
  const result = await updateStudentProfile(userId, {
    intended_major: 'Business Administration',
    target_state: 'New York',
    degree_goal: 'Bachelor of Business Administration',
    target_universities: ['NYU', 'Columbia University'],
    current_gpa: 3.8,
    completed_credits: 32
  })

  return result
}
```

### Example 3: React Component Integration
```typescript
import { useState } from 'react'
import { updateStudentGoals } from '@/lib/queries'

function GoalUpdateForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [goals, setGoals] = useState({
    state: '',
    major: '',
    degree: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateStudentGoals(
        userId,
        goals.state,
        goals.major,
        goals.degree
      )

      if (result.success) {
        alert('Goals updated successfully!')
      } else {
        alert('Failed to update goals')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Goals'}
      </button>
    </form>
  )
}
```

## 🔒 Security Features

### Row Level Security (RLS)
The `student_profiles` table has RLS enabled with the following policies:

- **SELECT**: Users can only view their own profile
- **INSERT**: Users can only insert profiles with their own user_id
- **UPDATE**: Users can only update their own profile
- **DELETE**: Users can only delete their own profile

### Authentication Required
All mutation functions require a valid user session. The `user_id` field must match the authenticated user's ID.

## 🚀 Error Handling

All functions return a consistent response format:

```typescript
{
  success: boolean
  data: T | null
  error: any | null
}
```

### Example Error Handling
```typescript
const handleProfileUpdate = async () => {
  const result = await updateStudentProfile(userId, updateData)
  
  if (result.success) {
    // Handle success
    console.log('Profile updated:', result.data)
  } else {
    // Handle error
    console.error('Update failed:', result.error)
    
    // Check for specific error types
    if (result.error?.code === 'PGRST116') {
      console.error('Profile not found')
    } else if (result.error?.code === '42501') {
      console.error('Permission denied')
    }
  }
}
```

## 📊 Mock Data Support

When Supabase is not configured (development mode), the functions return mock data instead of throwing errors. This allows for frontend development without a database connection.

## 🔄 Database Migration

To set up the database schema, run the SQL commands from `database-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the schema creation commands
4. Execute the script

The schema includes:
- Table creation with proper constraints
- Indexes for performance
- RLS policies for security
- Triggers for automatic timestamp updates 