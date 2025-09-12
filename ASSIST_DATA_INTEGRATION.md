# 🎓 Assist California Data Integration

## Overview

Your CCNav platform now has access to comprehensive California college transfer data from the Assist California database. This includes 19 colleges, 909 courses, 2,877 transfer agreements, 1,584 GE requirements, and 951 major requirements.

## 📁 Data Location

All data is located in: `src/data/assist/`

### Files:
- `colleges.json` - 19 California colleges (UC, CSU, CCC)
- `courses.json` - 909 courses across all subjects
- `transfer-agreements.json` - 2,877 transfer pathways
- `ge-requirements.json` - 1,584 general education requirements
- `major-requirements.json` - 951 major requirements
- `metadata.json` - Statistics and data overview
- `types.ts` - TypeScript type definitions
- `utils.ts` - Data access utilities and search functions

## 🚀 Quick Start

### 1. Import the Data

```typescript
import { 
  colleges, 
  courses, 
  transferAgreements,
  getCollegesByType,
  searchColleges,
  getCoursesByCollege,
  getTransferAgreementsByCollege
} from '@/data/assist/utils';
```

### 2. Use the Search Functions

```typescript
// Get all UC colleges
const ucColleges = getCollegesByType('UC');

// Search for colleges
const searchResults = searchColleges('Berkeley');

// Get courses for a specific college
const collegeCourses = getCoursesByCollege(collegeId);

// Get transfer agreements for a college
const transfers = getTransferAgreementsByCollege(collegeId);
```

### 3. View the Demo

Visit: `http://localhost:3000/assist-demo`

## 📊 Data Statistics

- **Colleges**: 19 (9 UC, 5 CSU, 5 CCC)
- **Courses**: 909 across all subjects
- **Transfer Agreements**: 2,877 pathways
- **GE Requirements**: 1,584 (IGETC, CSU GE, UC GE)
- **Major Requirements**: 951 for various programs

## 🏫 College Types

- **UC**: University of California (9 campuses)
- **CSU**: California State University (5 campuses)
- **CCC**: California Community College (5 colleges)

## 🔄 Transfer Types

- **UC_TRANSFERABLE**: 852 agreements
- **CSU_TRANSFERABLE**: 983 agreements
- **IGETC_APPROVED**: 1,042 agreements

## 💡 Use Cases

### 1. Transfer Planning
Help students find transfer pathways between colleges:

```typescript
const transfers = getTransferAgreementsByCollege(sourceCollegeId);
const targetColleges = transfers.map(t => getCollegeById(t.targetCollegeId));
```

### 2. Course Search
Find courses by subject or college:

```typescript
const mathCourses = searchCourses('MATH');
const berkeleyCourses = getCoursesByCollege(1); // UC Berkeley
```

### 3. GE Requirements
Check general education requirements:

```typescript
const geReqs = getGERequirementsByCollege(collegeId);
const igetcReqs = getGERequirementsBySystem('IGETC');
```

### 4. Major Planning
Find major requirements:

```typescript
const majorReqs = getMajorRequirementsByCollege(collegeId);
const csReqs = getMajorRequirementsByMajor('Computer Science');
```

## 🎯 Example Components

### College Selector
```typescript
const CollegeSelector = () => {
  const [selectedType, setSelectedType] = useState<'UC' | 'CSU' | 'CCC'>('UC');
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

### Transfer Pathway Display
```typescript
const TransferPathway = ({ sourceCollegeId, targetCollegeId }) => {
  const transfers = transferAgreements.filter(
    t => t.sourceCollegeId === sourceCollegeId && 
         t.targetCollegeId === targetCollegeId
  );
  
  return (
    <div>
      {transfers.map(transfer => {
        const course = courses.find(c => c.id === transfer.courseId);
        return (
          <div key={transfer.id}>
            {course?.courseCode} transfers as {transfer.equivalentCourse}
          </div>
        );
      })}
    </div>
  );
};
```

## 🔧 Data Updates

The data is currently static but can be updated by:

1. Running the scraper: `python3 main.py full`
2. Re-exporting to CCNav: `python3 export_real_data_to_ccnav.py /path/to/ccnav`
3. The data will be automatically updated in your app

## 📝 TypeScript Support

Full TypeScript support is included with:
- Type definitions for all data structures
- Type-safe utility functions
- IntelliSense support in your IDE

## 🎉 Ready to Use!

Your CCNav platform now has access to real California college transfer data. Start building transfer planning features, course search, and pathway recommendations!

---

**Demo Page**: `irhttp://localhost:3000/assist-demo`  
**Data Location**: `src/data/assist/`  
**Last Updated**: September 7, 2025