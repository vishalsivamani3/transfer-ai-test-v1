'use client';

import React, { useState } from 'react';
import {
    colleges,
    courses,
    transferAgreements,
    getCollegesByType,
    getCoursesByCollege,
    getTransferAgreementsByCollege,
    searchColleges,
    searchCourses,
    getDataStatistics
} from '../data/assist/utils';
import type { College, Course, TransferAgreement, CollegeType } from '../data/assist/types';

export default function AssistDataExample() {
    const [selectedCollegeType, setSelectedCollegeType] = useState<CollegeType>('UC');
    const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredColleges = getCollegesByType(selectedCollegeType);
    const collegeCourses = selectedCollege ? getCoursesByCollege(selectedCollege.id) : [];
    const collegeTransferAgreements = selectedCollege ? getTransferAgreementsByCollege(selectedCollege.id) : [];
    const searchResults = searchQuery ? searchColleges(searchQuery) : [];

    const stats = getDataStatistics();

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🎓 Assist California Data Integration
                </h1>
                <p className="text-lg text-gray-600">
                    Sample data from the Assist California College Database
                </p>
            </div>

            {/* Statistics */}
            <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">📊 Data Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{stats.colleges}</div>
                        <div className="text-sm text-gray-600">Colleges</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{stats.courses}</div>
                        <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{stats.transferAgreements}</div>
                        <div className="text-sm text-gray-600">Transfer Agreements</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{stats.geRequirements}</div>
                        <div className="text-sm text-gray-600">GE Requirements</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{stats.majorRequirements}</div>
                        <div className="text-sm text-gray-600">Major Requirements</div>
                    </div>
                </div>
            </div>

            {/* College Type Filter */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">🏫 Filter by College Type</h2>
                <div className="flex space-x-4">
                    {(['UC', 'CSU', 'CCC', 'AICCU'] as CollegeType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedCollegeType(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCollegeType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {type} ({getCollegesByType(type).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">🔍 Search Colleges</h2>
                <input
                    type="text"
                    placeholder="Search by name, code, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Search Results:</h3>
                        <div className="space-y-2">
                            {searchResults.map((college) => (
                                <div
                                    key={college.id}
                                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedCollege(college)}
                                >
                                    <div className="font-medium">{college.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {college.code} • {college.type} • {college.city}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Colleges List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    {selectedCollegeType} Colleges ({filteredColleges.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredColleges.map((college) => (
                        <div
                            key={college.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedCollege?.id === college.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            onClick={() => setSelectedCollege(college)}
                        >
                            <div className="font-medium text-lg">{college.name}</div>
                            <div className="text-sm text-gray-600">
                                {college.code} • {college.city}, {college.state}
                            </div>
                            {college.website && (
                                <div className="text-sm text-blue-600 mt-1">
                                    <a href={college.website} target="_blank" rel="noopener noreferrer">
                                        {college.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected College Details */}
            {selectedCollege && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        📚 {selectedCollege.name} Details
                    </h2>

                    {/* Courses */}
                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-3">Courses ({collegeCourses.length})</h3>
                        <div className="space-y-2">
                            {collegeCourses.map((course) => (
                                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium">{course.courseCode}: {course.courseTitle}</div>
                                    <div className="text-sm text-gray-600">
                                        {course.units} units • {course.department}
                                    </div>
                                    {course.description && (
                                        <div className="text-sm text-gray-500 mt-1">{course.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transfer Agreements */}
                    <div>
                        <h3 className="text-xl font-medium mb-3">
                            🔄 Transfer Agreements ({collegeTransferAgreements.length})
                        </h3>
                        <div className="space-y-2">
                            {collegeTransferAgreements.map((agreement) => {
                                const targetCollege = colleges.find(c => c.id === agreement.targetCollegeId);
                                const course = courses.find(c => c.id === agreement.courseId);
                                return (
                                    <div key={agreement.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="font-medium">
                                            {course?.courseCode} → {agreement.equivalentCourse}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            To: {targetCollege?.name} • {agreement.transferType}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {agreement.unitsTransferred} units • {agreement.academicYear}
                                        </div>
                                        {agreement.transferNotes && (
                                            <div className="text-sm text-gray-500 mt-1">{agreement.transferNotes}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Integration Info */}
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h2 className="text-2xl font-semibold mb-4">🚀 Integration Ready!</h2>
                <div className="space-y-2 text-sm">
                    <p>✅ Data files created in <code>src/data/assist/</code></p>
                    <p>✅ TypeScript types generated</p>
                    <p>✅ Utility functions available</p>
                    <p>✅ Integration guide created</p>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        This is sample data. To get real data from Assist.org, run the scraper:
                    </p>
                    <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
                        python3 main.py full
                    </code>
                </div>
            </div>
        </div>
    );
}