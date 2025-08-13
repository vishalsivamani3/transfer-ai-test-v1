# Course Selection Feature

## Overview
The course selection feature allows students to browse available courses, select courses they're interested in, and manage their selections across sessions. All selections are persisted in a `student_courses` table in Supabase.

## Database Schema

### student_courses Table
```sql
CREATE TABLE student_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'selected' CHECK (status IN ('selected', 'enrolled', 'completed', 'dropped')),
    selection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    enrollment_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    grade TEXT,
    notes TEXT,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

## Features

### 1. Course Selection in Course Dashboard
- **Select/Deselect Courses**: Students can add or remove courses from their selections
- **Visual Feedback**: Selected courses show a "Remove" button, unselected show "Select"
- **Real-time Updates**: Changes are immediately reflected in the UI
- **Toast Notifications**: Success/error messages for all actions

### 2. Selected Courses Management
- **Dedicated Tab**: New "Selected" tab in the main dashboard
- **Status Management**: Update course status (selected, enrolled, completed, dropped)
- **Priority Setting**: Set priority levels (1-5) for course planning
- **Progress Tracking**: Visual indicators for course completion status

### 3. Data Persistence
- **Cross-session Storage**: All selections persist across browser sessions
- **User-specific Data**: Each user only sees their own course selections
- **Real-time Sync**: Changes are immediately saved to Supabase

## Components

### CourseDashboard
- Enhanced with selection functionality
- Shows selection status for each course
- Displays count of selected courses
- Handles add/remove course operations

### SelectedCoursesTab
- New component for managing selected courses
- Summary statistics (selected, enrolled, completed, total credits)
- Detailed table with course information
- Status and priority management controls

## API Functions

### Core Functions
- `addStudentCourse(userId, courseId, priority?, notes?)`: Add course to selections
- `removeStudentCourse(userId, courseId)`: Remove course from selections
- `getStudentCourses(userId)`: Fetch all selected courses with details
- `isCourseSelected(userId, courseId)`: Check if course is selected
- `updateStudentCourseStatus(userId, courseId, status, grade?, notes?)`: Update course status
- `updateCoursePriority(userId, courseId, priority)`: Update course priority

### Data Types
```typescript
interface StudentCourse {
  id: string
  userId: string
  courseId: string
  status: 'selected' | 'enrolled' | 'completed' | 'dropped'
  selectionDate: string
  enrollmentDate?: string
  completionDate?: string
  grade?: string
  notes?: string
  priority: number
  createdAt: string
  updatedAt: string
  course?: Course
}

interface StudentCourseWithDetails extends StudentCourse {
  course: Course
}
```

## User Experience

### Course Selection Flow
1. User browses courses in the "Courses" tab
2. Clicks "Select" button on desired courses
3. Selected courses show "Remove" button
4. Selection count appears in summary
5. User can manage selections in "Selected" tab

### Selected Courses Management
1. User navigates to "Selected" tab
2. Views summary statistics and course list
3. Updates course status (enrolled, completed, etc.)
4. Sets priority levels for planning
5. Removes courses if needed

## Security Features

### Row Level Security (RLS)
- Users can only view their own course selections
- Users can only modify their own selections
- Automatic cleanup when user account is deleted

### Data Validation
- Status values are constrained to valid options
- Priority values are constrained to 1-5 range
- Unique constraint prevents duplicate selections

## Error Handling

### Graceful Degradation
- Mock data fallback when Supabase is not configured
- Clear error messages for failed operations
- Loading states for better UX

### Toast Notifications
- Success messages for completed actions
- Error messages for failed operations
- Consistent user feedback

## Future Enhancements

### Planned Features
- Course conflict detection (time overlaps)
- Prerequisite checking
- Credit limit validation
- Course recommendations based on selections
- Export selected courses to calendar
- Share course selections with advisors

### Technical Improvements
- Real-time updates using Supabase subscriptions
- Bulk operations (select multiple courses)
- Advanced filtering in selected courses view
- Course comparison features 