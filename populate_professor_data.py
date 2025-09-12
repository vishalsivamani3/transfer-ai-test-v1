#!/usr/bin/env python3
"""
Simple script to populate professor rating data into the existing course data
This creates realistic professor ratings for the courses in the system
"""

import json
import random
from datetime import datetime

# Professor names and their typical ratings
PROFESSOR_DATA = {
    'Dr. Sarah Johnson': {'rating': 4.2, 'difficulty': 2.8, 'would_take_again': 0.85, 'total_ratings': 127},
    'Prof. Michael Chen': {'rating': 3.8, 'difficulty': 3.2, 'would_take_again': 0.72, 'total_ratings': 89},
    'Dr. Emily Rodriguez': {'rating': 4.5, 'difficulty': 3.5, 'would_take_again': 0.91, 'total_ratings': 156},
    'Prof. David Kim': {'rating': 3.9, 'difficulty': 3.8, 'would_take_again': 0.68, 'total_ratings': 94},
    'Dr. Robert Wilson': {'rating': 4.1, 'difficulty': 3.1, 'would_take_again': 0.78, 'total_ratings': 203},
    'Prof. Lisa Thompson': {'rating': 4.3, 'difficulty': 3.4, 'would_take_again': 0.82, 'total_ratings': 167},
    'Dr. James Anderson': {'rating': 4.0, 'difficulty': 3.6, 'would_take_again': 0.75, 'total_ratings': 142},
    'Dr. Patricia Martinez': {'rating': 4.4, 'difficulty': 3.3, 'would_take_again': 0.87, 'total_ratings': 178},
    'Prof. Kevin O\'Brien': {'rating': 3.7, 'difficulty': 3.7, 'would_take_again': 0.71, 'total_ratings': 134},
    'Dr. Jennifer Lee': {'rating': 4.2, 'difficulty': 2.5, 'would_take_again': 0.88, 'total_ratings': 245},
    'Prof. Thomas Garcia': {'rating': 3.9, 'difficulty': 2.8, 'would_take_again': 0.79, 'total_ratings': 198},
    'Dr. Amanda Foster': {'rating': 4.0, 'difficulty': 2.3, 'would_take_again': 0.85, 'total_ratings': 167},
    'Prof. Christopher Brown': {'rating': 3.6, 'difficulty': 3.9, 'would_take_again': 0.65, 'total_ratings': 112},
    'Dr. Maria Santos': {'rating': 4.1, 'difficulty': 3.0, 'would_take_again': 0.83, 'total_ratings': 189},
    'Prof. Alex Johnson': {'rating': 3.8, 'difficulty': 3.5, 'would_take_again': 0.74, 'total_ratings': 156},
    'Dr. Rachel Green': {'rating': 4.3, 'difficulty': 2.9, 'would_take_again': 0.89, 'total_ratings': 201},
    'Prof. Mark Davis': {'rating': 3.9, 'difficulty': 3.2, 'would_take_again': 0.77, 'total_ratings': 143},
    'Dr. Susan White': {'rating': 4.0, 'difficulty': 3.1, 'would_take_again': 0.81, 'total_ratings': 167},
    'Prof. John Smith': {'rating': 3.7, 'difficulty': 3.6, 'would_take_again': 0.69, 'total_ratings': 125},
    'Dr. Lisa Wang': {'rating': 4.2, 'difficulty': 2.7, 'would_take_again': 0.86, 'total_ratings': 178}
}

# Department-specific professor preferences
DEPARTMENT_PROFESSORS = {
    'MATH': ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez', 'Prof. David Kim', 'Dr. Robert Wilson'],
    'CS': ['Prof. Lisa Thompson', 'Dr. James Anderson', 'Dr. Patricia Martinez', 'Prof. Kevin O\'Brien', 'Dr. Jennifer Lee'],
    'PHYSICS': ['Prof. Thomas Garcia', 'Dr. Amanda Foster', 'Prof. Christopher Brown', 'Dr. Maria Santos'],
    'ENGLISH': ['Prof. Alex Johnson', 'Dr. Rachel Green', 'Prof. Mark Davis', 'Dr. Susan White'],
    'BUSINESS': ['Prof. John Smith', 'Dr. Lisa Wang', 'Dr. Sarah Johnson', 'Prof. Michael Chen'],
    'CHEMISTRY': ['Dr. Emily Rodriguez', 'Prof. David Kim', 'Dr. Robert Wilson', 'Prof. Lisa Thompson'],
    'BIOLOGY': ['Dr. James Anderson', 'Dr. Patricia Martinez', 'Prof. Kevin O\'Brien', 'Dr. Jennifer Lee'],
    'PSYCHOLOGY': ['Prof. Thomas Garcia', 'Dr. Amanda Foster', 'Prof. Christopher Brown', 'Dr. Maria Santos'],
    'HISTORY': ['Prof. Alex Johnson', 'Dr. Rachel Green', 'Prof. Mark Davis', 'Dr. Susan White'],
    'ART': ['Prof. John Smith', 'Dr. Lisa Wang', 'Dr. Sarah Johnson', 'Prof. Michael Chen']
}

def get_professor_for_department(department):
    """Get a random professor for a given department"""
    if department in DEPARTMENT_PROFESSORS:
        return random.choice(DEPARTMENT_PROFESSORS[department])
    else:
        return random.choice(list(PROFESSOR_DATA.keys()))

def generate_class_times():
    """Generate realistic class times"""
    time_slots = [
        {'days': 'MW', 'startTime': '09:00', 'endTime': '10:50', 'type': 'Lecture'},
        {'days': 'MW', 'startTime': '11:00', 'endTime': '12:50', 'type': 'Lecture'},
        {'days': 'MW', 'startTime': '14:00', 'endTime': '15:50', 'type': 'Lecture'},
        {'days': 'TTH', 'startTime': '09:00', 'endTime': '10:50', 'type': 'Lecture'},
        {'days': 'TTH', 'startTime': '11:00', 'endTime': '12:50', 'type': 'Lecture'},
        {'days': 'TTH', 'startTime': '14:00', 'endTime': '15:50', 'type': 'Lecture'},
        {'days': 'F', 'startTime': '09:00', 'endTime': '11:50', 'type': 'Lab'},
        {'days': 'F', 'startTime': '13:00', 'endTime': '15:50', 'type': 'Lab'}
    ]
    return [random.choice(time_slots)]

def populate_courses_with_professor_data():
    """Populate the existing course data with professor ratings"""
    
    # Load existing courses
    try:
        with open('src/data/assist/courses.json', 'r') as f:
            courses = json.load(f)
    except FileNotFoundError:
        print("❌ Courses file not found. Please run the basic integration first.")
        return False
    
    print(f"📚 Found {len(courses)} courses to populate with professor data...")
    
    # Update each course with professor data
    updated_courses = []
    for course in courses:
        # Get a professor for this course's department
        professor_name = get_professor_for_department(course.get('department', 'GENERAL'))
        professor_data = PROFESSOR_DATA[professor_name]
        
        # Generate class times
        class_times = generate_class_times()
        
        # Update course with professor data
        updated_course = {
            **course,
            'professorName': professor_name,
            'professorEmail': f"{professor_name.lower().replace(' ', '.').replace('Dr.', '').replace('Prof.', '')}@college.edu",
            'professorRmpId': f"rmp_{hash(professor_name) % 10000}",
            'professorRating': professor_data['rating'],
            'professorDifficulty': professor_data['difficulty'],
            'professorWouldTakeAgain': professor_data['would_take_again'],
            'professorTotalRatings': professor_data['total_ratings'],
            'classTimes': class_times,
            'location': f"{random.choice(['Science', 'Math', 'English', 'Business', 'Art'])} Building {random.randint(100, 500)}",
            'capacity': random.randint(25, 40),
            'enrolled': random.randint(20, 35),
            'waitlistCount': random.randint(0, 5),
            'semester': random.choice(['Fall 2024', 'Spring 2025', 'Summer 2025']),
            'academicYear': '2024-2025',
            'transferCredits': True,
            'transferNotes': 'Transfers to all UC and CSU campuses',
            'updated_at': datetime.now().isoformat()
        }
        
        updated_courses.append(updated_course)
    
    # Save updated courses
    with open('src/data/assist/courses.json', 'w') as f:
        json.dump(updated_courses, f, indent=2)
    
    print(f"✅ Successfully populated {len(updated_courses)} courses with professor data!")
    print("📊 Professor data includes:")
    print("   - Professor names and ratings")
    print("   - Difficulty scores")
    print("   - 'Would take again' percentages")
    print("   - Total review counts")
    print("   - Class schedules and locations")
    print("   - Enrollment and capacity data")
    
    return True

def create_professor_ratings_file():
    """Create a separate file with just professor ratings for reference"""
    professor_ratings = []
    
    for professor_name, data in PROFESSOR_DATA.items():
        professor_rating = {
            'id': hash(professor_name) % 10000,
            'professorName': professor_name,
            'professorId': f"rmp_{hash(professor_name) % 10000}",
            'overallRating': data['rating'],
            'difficultyRating': data['difficulty'],
            'wouldTakeAgain': data['would_take_again'],
            'totalRatings': data['total_ratings'],
            'created_at': datetime.now().isoformat()
        }
        professor_ratings.append(professor_rating)
    
    with open('src/data/assist/professor-ratings.json', 'w') as f:
        json.dump(professor_ratings, f, indent=2)
    
    print(f"📝 Created professor-ratings.json with {len(professor_ratings)} professor records")

if __name__ == "__main__":
    print("🚀 Starting professor data population...")
    
    if populate_courses_with_professor_data():
        create_professor_ratings_file()
        print("\n🎉 Professor data population completed successfully!")
        print("🔄 Please restart your development server to see the changes.")
    else:
        print("❌ Professor data population failed.")