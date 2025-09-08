// Simple test to verify Assist data is working
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Assist Data Integration...\n');

// Test 1: Check if data files exist
const dataDir = path.join(__dirname, 'src', 'data', 'assist');
const files = [
    'colleges.json',
    'courses.json',
    'transfer-agreements.json',
    'ge-requirements.json',
    'major-requirements.json',
    'metadata.json',
    'types.ts',
    'utils.ts'
];

console.log('📁 Checking data files:');
files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 2: Check data content
console.log('\n📊 Data Statistics:');
try {
    const metadata = JSON.parse(fs.readFileSync(path.join(dataDir, 'metadata.json'), 'utf8'));
    console.log(`  Colleges: ${metadata.statistics.colleges}`);
    console.log(`  Courses: ${metadata.statistics.courses}`);
    console.log(`  Transfer Agreements: ${metadata.statistics.transferAgreements}`);
    console.log(`  GE Requirements: ${metadata.statistics.geRequirements}`);
    console.log(`  Major Requirements: ${metadata.statistics.majorRequirements}`);
} catch (error) {
    console.log('  ❌ Could not read metadata');
}

// Test 3: Check sample data
console.log('\n🏫 Sample Colleges:');
try {
    const colleges = JSON.parse(fs.readFileSync(path.join(dataDir, 'colleges.json'), 'utf8'));
    colleges.slice(0, 3).forEach(college => {
        console.log(`  ${college.name} (${college.code}) - ${college.type}`);
    });
} catch (error) {
    console.log('  ❌ Could not read colleges data');
}

console.log('\n🎓 Sample Courses:');
try {
    const courses = JSON.parse(fs.readFileSync(path.join(dataDir, 'courses.json'), 'utf8'));
    courses.slice(0, 3).forEach(course => {
        console.log(`  ${course.courseCode}: ${course.courseTitle}`);
    });
} catch (error) {
    console.log('  ❌ Could not read courses data');
}

console.log('\n✅ Assist data integration test completed!');
console.log('\n🚀 To view the demo, visit: http://localhost:3000/assist-demo');