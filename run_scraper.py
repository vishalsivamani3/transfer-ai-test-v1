#!/usr/bin/env python3
"""
Simple script to run the RateMyProfessor scraper with mock models
"""
import sys
import types

# Create mock models to avoid import issues
class MockCollege:
    def __init__(self, id, name, code):
        self.id = id
        self.name = name
        self.code = code

class MockCourse:
    def __init__(self, id, college_id, course_code, course_title):
        self.id = id
        self.college_id = college_id
        self.course_code = course_code
        self.course_title = course_title

# Mock the models module
mock_models = types.ModuleType('models')
mock_models.College = MockCollege
mock_models.Course = MockCourse
sys.modules['models'] = mock_models

# Now try to import and run the scraper
try:
    from ratemyprof_scraper import RateMyProfessorsScraper
    
    print("✅ Successfully imported RateMyProfessorsScraper")
    
    # Create scraper instance
    scraper = RateMyProfessorsScraper()
    
    print("✅ Successfully created scraper instance")
    
    # Run a simple scrape
    print("🚀 Starting professor rating scrape...")
    results = scraper.run_full_scrape(
        college_names=["UC Berkeley", "UCLA"],
        max_pages_per_college=1  # Limit to 1 page for testing
    )
    
    print(f"✅ Scraping completed! Results saved to: {results}")
    
except Exception as e:
    print(f"❌ Error running scraper: {e}")
    import traceback
    traceback.print_exc()