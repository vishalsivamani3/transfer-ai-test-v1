# Course Selection Testing Guide

## Testing Steps

### 1. Application Startup
- [ ] Navigate to http://localhost:3000
- [ ] Verify the application loads without white screen
- [ ] Check browser console for any errors
- [ ] Should see login/signup screen initially

### 2. Authentication Flow
- [ ] Click "Don't have an account? Sign up"
- [ ] Fill in signup form with test data:
  - Email: test@example.com
  - Password: testpassword123
  - First Name: Test
  - Last Name: Student
  - Current College: Santa Monica College
  - Academic Year: Sophomore
- [ ] Click "Create Account"
- [ ] Should see onboarding flow or dashboard

### 3. Course Selection Testing
- [ ] Navigate to "Courses" tab
- [ ] Verify course list loads with mock data
- [ ] Look for "Select" buttons on course cards
- [ ] Click "Select" on a course
- [ ] Verify button changes to "Remove" with red styling
- [ ] Check for toast notification: "Course added to selections"
- [ ] Verify selection count appears in summary

### 4. Selected Courses Management
- [ ] Navigate to "Selected" tab
- [ ] Verify selected course appears in the table
- [ ] Check summary statistics show correct counts
- [ ] Test priority setting (1-5 dropdown)
- [ ] Test status updates (selected → enrolled → completed → dropped)
- [ ] Test removing course with trash button
- [ ] Verify course disappears from selected list

### 5. Cross-Session Persistence
- [ ] Select multiple courses
- [ ] Refresh the browser page
- [ ] Navigate to "Selected" tab
- [ ] Verify all selections are still there
- [ ] Test logging out and back in (if Supabase is configured)

### 6. Error Handling
- [ ] Test with network disconnected (should show mock data)
- [ ] Verify error messages appear for failed operations
- [ ] Check loading states during operations

## Expected Behavior

### Course Dashboard
- Shows list of available courses
- Each course has Select/Remove button
- Selected courses show "Remove" button (red)
- Unselected courses show "Select" button (blue)
- Selection count appears in summary
- Toast notifications for all actions

### Selected Courses Tab
- Summary cards showing counts by status
- Detailed table with all selected courses
- Priority dropdown (1-5) for each course
- Status dropdown (selected/enrolled/completed/dropped)
- Remove button for each course
- Proper sorting by priority

### Data Persistence
- Selections persist across page refreshes
- User-specific data (each user sees only their selections)
- Real-time updates when selections change

## Troubleshooting

### White Screen Issues
- Check browser console for JavaScript errors
- Verify all imports are correct
- Check for missing dependencies
- Ensure environment variables are set

### Course Selection Not Working
- Verify user is logged in
- Check browser console for API errors
- Verify Supabase configuration
- Check network connectivity

### Data Not Persisting
- Verify Supabase is properly configured
- Check RLS policies are set correctly
- Verify user authentication is working
- Check database schema is applied

## Mock Data Fallback
If Supabase is not configured, the application will:
- Show mock course data
- Allow course selection (stored in memory)
- Show appropriate messages about mock mode
- Still provide full functionality for testing 