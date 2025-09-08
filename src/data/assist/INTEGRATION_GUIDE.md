# CCNav Integration Guide

This guide explains how to integrate the Assist California college database data into your CCNav application.

## Data Structure

The data is organized in the following files:

- `colleges.json` - College and university information
- `courses.json` - Course catalog data
- `transfer-agreements.json` - Transfer agreement data
- `ge-requirements.json` - General education requirements
- `major-requirements.json` - Major-specific requirements
- `metadata.json` - Data statistics and version information
- `types.ts` - TypeScript type definitions
- `utils.ts` - Data access utility functions

## Integration Steps

### 1. Import the Data

```typescript
import { 
  colleges, 
  courses, 
  transferAgreements, 
  geRequirements, 
  majorRequirements,
  metadata 
} from './data/assist/utils';
```

### 2. Use the Utility Functions

```typescript
// Get all UC colleges
const ucColleges = getCollegesByType('UC');

// Get courses for a specific college
const collegeCourses = getCoursesByCollege(collegeId);

// Get transfer agreements for a course
const agreements = getTransferAgreementsByCourse(courseId);

// Search for colleges
const searchResults = searchColleges('Berkeley');
```

### 3. Build Your UI Components

```typescript
// Example: College selector component
const CollegeSelector = () => {
  const [selectedType, setSelectedType] = useState<CollegeType>('UC');
  const colleges = getCollegesByType(selectedType);
  
  return (
    <select onChange={(e) => setSelectedType(e.target.value)}>
      {colleges.map(college => (
        <option key={college.id} value={college.id}>
          {college.name}
        </option>
      ))}
    </select>
  );
};
```

### 4. Data Updates

To update the data:

1. Run the scraper: `python main.py full`
2. The data files will be automatically updated
3. Restart your development server to pick up changes

## API Integration

If you want to use Supabase as your backend:

1. Set up your Supabase project
2. Configure the environment variables
3. Run: `python main.py export`
4. Use Supabase client in your CCNav app

## Best Practices

1. **Caching**: Consider implementing client-side caching for better performance
2. **Search**: Use the provided search functions for user-friendly search experiences
3. **Filtering**: Combine multiple utility functions for complex filtering
4. **Error Handling**: Always handle cases where data might not be found
5. **Performance**: For large datasets, consider implementing pagination

## Data Schema

See `types.ts` for complete TypeScript definitions of all data structures.

## Support

For questions or issues with the data integration, please refer to the main project documentation or create an issue in the repository.
