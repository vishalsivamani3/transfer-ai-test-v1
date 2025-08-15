# Mock Data System for Transfer.ai

## Overview
The application now uses a modular mock data system that allows full testing of all features without requiring Supabase configuration. This system can be easily swapped out when you're ready to connect to a real database.

## How It Works

### 1. **Automatic Fallback**
When Supabase is not configured (`isSupabaseConfigured()` returns `false`), the application automatically uses mock data functions instead of database queries.

### 2. **In-Memory Storage**
Mock data is stored in memory using these variables:
- `mockPlans: StudentPlan[]` - Stores all created plans
- `mockPlanSemesters: PlanSemester[]` - Stores all semesters
- `mockPlanCourses: PlanCourse[]` - Stores all course assignments

### 3. **Function Mapping**
Each database function has a corresponding mock function:

| Database Function | Mock Function | Purpose |
|------------------|---------------|---------|
| `createStudentPlan` | `createMockStudentPlan` | Creates new plans with semesters |
| `getStudentPlans` | `getMockStudentPlans` | Retrieves user's plans |
| `getStudentPlanWithDetails` | `getMockStudentPlanWithDetails` | Gets plan with courses |
| `addCourseToPlan` | `addMockCourseToPlan` | Adds courses to semesters |
| `removeCourseFromPlan` | `removeMockCourseFromPlan` | Removes courses from semesters |
| `updateCoursePosition` | `updateMockCoursePosition` | Updates course order |
| `moveCourseBetweenSemesters` | `moveMockCourseBetweenSemesters` | Moves courses between semesters |
| `updatePlanStatus` | `updateMockPlanStatus` | Updates plan status |
| `deleteStudentPlan` | `deleteMockStudentPlan` | Deletes plans |

## Current Features Working with Mock Data

### ✅ **Semester Planner**
- Create new transfer plans (1-year or 2-year)
- Drag and drop courses into semesters
- Reorder courses within semesters
- Move courses between semesters
- Remove courses from semesters
- Plan status management

### ✅ **Course Dashboard**
- Browse available courses
- Search and filter courses
- View professor ratings (mock data)
- Select/deselect courses

### ✅ **Student Profile**
- Create and update student profiles
- Store transfer goals and preferences

### ✅ **Transfer Pathways**
- View transfer pathway data
- Search and filter pathways

## Demo Mode Notice
The application shows a blue "Demo Mode" alert when using mock data, informing users that:
- Data is stored in memory
- Data will reset when the page is refreshed
- This is for testing purposes

## Switching to Supabase Later

### Step 1: Configure Environment Variables
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Set Up Database Schema
Run the SQL from `database-schema.sql` in your Supabase project.

### Step 3: The Switch Happens Automatically
Once Supabase is configured, `isSupabaseConfigured()` will return `true`, and the application will automatically use real database functions instead of mock functions.

### Step 4: Remove Mock Data Notice
Update the SemesterPlanner component to remove the "Demo Mode" alert when Supabase is configured.

## Benefits of This Approach

1. **Immediate Testing** - No setup required to test all features
2. **Modular Design** - Easy to swap between mock and real data
3. **Development Speed** - Can develop UI/UX without database setup
4. **Demo Capability** - Can demonstrate features without backend
5. **Fallback Safety** - Application works even if database is down

## Mock Data Structure

### Student Plans
```typescript
{
  id: string,
  userId: string,
  planName: string,
  transferTimeline: '1-year' | '2-year',
  targetMajor?: string,
  targetUniversities?: string[],
  totalCreditsPlanned: number,
  totalCreditsCompleted: number,
  planStatus: 'draft' | 'active' | 'completed',
  isDefault: boolean,
  semesters: PlanSemester[]
}
```

### Plan Semesters
```typescript
{
  id: string,
  planId: string,
  semesterName: string,
  semesterOrder: number,
  academicYear: string,
  semesterType: 'fall' | 'spring' | 'summer',
  totalCredits: number,
  courses: PlanCourse[]
}
```

### Plan Courses
```typescript
{
  id: string,
  planId: string,
  semesterId: string,
  courseId: string,
  positionOrder: number,
  status: 'planned' | 'enrolled' | 'completed' | 'dropped',
  course?: Course
}
```

## Testing the System

1. **Create a Plan**: Click "Create New Plan" and fill in details
2. **Add Courses**: Drag courses from the left panel to semesters
3. **Reorder Courses**: Drag courses within semesters to reorder
4. **Move Courses**: Drag courses between different semesters
5. **Remove Courses**: Use the remove button on course cards
6. **Switch Plans**: Use the plan selector dropdown

All operations will work exactly as they would with a real database, but data will be stored in memory and reset on page refresh.

## Future Enhancements

When switching to Supabase, consider adding:
- Data persistence across sessions
- Real-time updates with Supabase subscriptions
- User authentication and authorization
- Data backup and recovery
- Analytics and reporting 