# Semester Planner Feature

## Overview
The semester planner is a comprehensive drag-and-drop course planning tool that allows students to create semester-by-semester transfer plans for both 1-year and 2-year transfer timelines. All plans are persisted in Supabase with full CRUD operations and real-time updates.

## Database Schema

### student_plans Table
```sql
CREATE TABLE student_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL DEFAULT 'My Transfer Plan',
    transfer_timeline TEXT NOT NULL CHECK (transfer_timeline IN ('1-year', '2-year')),
    target_major TEXT,
    target_universities TEXT[],
    total_credits_planned INTEGER DEFAULT 0,
    total_credits_completed INTEGER DEFAULT 0,
    plan_status TEXT NOT NULL DEFAULT 'draft' CHECK (plan_status IN ('draft', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_default BOOLEAN DEFAULT false
);
```

### student_plan_semesters Table
```sql
CREATE TABLE student_plan_semesters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES student_plans(id) ON DELETE CASCADE,
    semester_name TEXT NOT NULL, -- e.g., 'Fall 2024', 'Spring 2025'
    semester_order INTEGER NOT NULL, -- 1, 2, 3, 4 for ordering
    academic_year TEXT NOT NULL, -- e.g., '2024-2025'
    semester_type TEXT NOT NULL CHECK (semester_type IN ('fall', 'spring', 'summer')),
    total_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, semester_name)
);
```

### student_plan_courses Table
```sql
CREATE TABLE student_plan_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES student_plans(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES student_plan_semesters(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    position_order INTEGER NOT NULL, -- For drag-and-drop ordering
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'enrolled', 'completed', 'dropped')),
    grade TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, semester_id, course_id)
);
```

## Features

### 1. Plan Management
- **Create Plans**: Students can create new transfer plans with custom names and timelines
- **Multiple Plans**: Support for multiple plans per user with plan switching
- **Plan Status**: Track plan status (draft, active, completed)
- **Default Plans**: Mark plans as default for easy access

### 2. Drag-and-Drop Functionality
- **Course Addition**: Drag courses from available courses to semesters
- **Course Reordering**: Reorder courses within semesters
- **Cross-Semester Movement**: Move courses between semesters
- **Visual Feedback**: Real-time drag overlay and visual indicators
- **Touch Support**: Works on mobile devices with touch gestures

### 3. Semester Management
- **Automatic Semester Creation**: Creates appropriate semesters based on timeline
- **Visual Semester Types**: Color-coded semesters (Fall: Orange, Spring: Green, Summer: Blue)
- **Credit Tracking**: Automatic credit calculation per semester
- **Semester Icons**: Visual indicators for each semester type

### 4. Course Integration
- **Course Details**: Display course code, name, credits, and professor ratings
- **Availability Status**: Show course availability and waitlist information
- **Professor Ratings**: Display RateMyProfessors ratings when available
- **Transfer Credits**: Track transfer credit status

## Components

### SemesterPlanner
- Main planner component with drag-and-drop context
- Plan creation and management interface
- Course availability panel
- Semester planning grid

### SortableCourseCard
- Draggable course cards with course information
- Visual feedback during drag operations
- Course details display (code, name, credits, ratings)

### SemesterCard
- Drop zone for courses
- Semester information display
- Credit tracking
- Visual semester type indicators

## API Functions

### Plan Management
- `createStudentPlan(userId, planData)`: Create new plan with default semesters
- `getStudentPlans(userId)`: Fetch all plans for a user
- `getStudentPlanWithDetails(planId)`: Get complete plan with semesters and courses
- `updatePlanStatus(planId, status)`: Update plan status
- `deleteStudentPlan(planId)`: Delete plan and all associated data

### Course Management
- `addCourseToPlan(planId, semesterId, courseId, positionOrder)`: Add course to semester
- `removeCourseFromPlan(planId, semesterId, courseId)`: Remove course from semester
- `updateCoursePosition(planId, semesterId, courseId, newPositionOrder)`: Reorder course
- `moveCourseBetweenSemesters(planId, courseId, fromSemesterId, toSemesterId, newPositionOrder)`: Move between semesters

### Data Types
```typescript
interface StudentPlan {
  id: string
  userId: string
  planName: string
  transferTimeline: '1-year' | '2-year'
  targetMajor?: string
  targetUniversities?: string[]
  totalCreditsPlanned: number
  totalCreditsCompleted: number
  planStatus: 'draft' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
  isDefault: boolean
  semesters?: PlanSemester[]
}

interface PlanSemester {
  id: string
  planId: string
  semesterName: string
  semesterOrder: number
  academicYear: string
  semesterType: 'fall' | 'spring' | 'summer'
  totalCredits: number
  createdAt: string
  updatedAt: string
  courses?: PlanCourse[]
}

interface PlanCourse {
  id: string
  planId: string
  semesterId: string
  courseId: string
  positionOrder: number
  status: 'planned' | 'enrolled' | 'completed' | 'dropped'
  grade?: string
  notes?: string
  createdAt: string
  updatedAt: string
  course?: Course
}
```

## User Experience

### Plan Creation Flow
1. User clicks "Create New Plan"
2. Fills in plan details (name, timeline, major)
3. System creates plan with default semesters
4. User can immediately start adding courses

### Course Planning Flow
1. User views available courses in left panel
2. Drags courses to desired semesters
3. Reorders courses within semesters as needed
4. Moves courses between semesters if needed
5. All changes are automatically saved

### Plan Management Flow
1. User can switch between multiple plans
2. View plan status and progress
3. Update plan details and status
4. Delete plans when no longer needed

## Drag-and-Drop Implementation

### DndKit Integration
- Uses `@dnd-kit/core` for drag-and-drop functionality
- `@dnd-kit/sortable` for sortable lists
- `@dnd-kit/utilities` for CSS transformations

### Drag Operations
- **Course to Semester**: Add course to semester
- **Course to Course**: Reorder within semester
- **Cross-Semester**: Move between semesters
- **Visual Feedback**: Drag overlay and opacity changes

### Event Handling
- `onDragStart`: Set dragged item state
- `onDragOver`: Handle dropping into drop zones
- `onDragEnd`: Process final drop location and update database

## Security Features

### Row Level Security (RLS)
- Users can only access their own plans
- Automatic cleanup when user account is deleted
- Secure plan and course management

### Data Validation
- Timeline constraints (1-year or 2-year only)
- Semester type validation
- Course status validation
- Position order constraints

## Error Handling

### Graceful Degradation
- Mock data fallback when Supabase is not configured
- Clear error messages for failed operations
- Loading states for better UX

### Toast Notifications
- Success messages for completed operations
- Error messages for failed operations
- Consistent user feedback

## Future Enhancements

### Planned Features
- Course conflict detection (time overlaps)
- Prerequisite checking and validation
- Credit limit enforcement
- Course recommendations based on plan
- Export plans to calendar or PDF
- Share plans with advisors
- Plan templates for common majors

### Technical Improvements
- Real-time collaboration using Supabase subscriptions
- Bulk course operations
- Advanced filtering and search
- Plan comparison features
- Progress tracking and analytics
- Mobile-optimized interface

## Performance Considerations

### Optimization
- Lazy loading of course details
- Efficient drag-and-drop operations
- Optimized database queries
- Minimal re-renders during drag operations

### Scalability
- Pagination for large course catalogs
- Efficient plan loading and caching
- Optimized database indexes
- Background processing for heavy operations 