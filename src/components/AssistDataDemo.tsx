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
    getDataStatistics,
    getCollegeTypeStatistics,
    getTransferTypeStatistics
} from '@/data/assist/utils';
import { College, Course, TransferAgreement } from '@/data/assist/types';

export default function AssistDataDemo() {
    const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<College[]>([]);
    const [showStats, setShowStats] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            setSearchResults(searchColleges(query));
        } else {
            setSearchResults([]);
        }
    };

    const handleCollegeSelect = (college: College) => {
        setSelectedCollege(college);
        setSearchResults([]);
        setSearchQuery('');
    };

    const getCollegeCourses = (collegeId: number) => {
        return getCoursesByCollege(collegeId).slice(0, 10); // Show first 10 courses
    };

    const getCollegeTransfers = (collegeId: number) => {
        return getTransferAgreementsByCollege(collegeId).slice(0, 5); // Show first 5 transfers
    };

    const stats = getDataStatistics();
    const collegeTypeStats = getCollegeTypeStatistics();
    const transferTypeStats = getTransferTypeStatistics();

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🎓 Assist California Data Integration
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Real college transfer data from the Assist California database
                </p>

                <button
                    onClick={() => setShowStats(!showStats)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {showStats ? 'Hide' : 'Show'} Statistics
                </button>
            </div>

            {showStats && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">📊 Database Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-2">Colleges</h3>
                            <div className="space-y-1">
                                <p>Total: {stats.colleges}</p>
                                <p>UC: {collegeTypeStats.UC}</p>
                                <p>CSU: {collegeTypeStats.CSU}</p>
                                <p>CCC: {collegeTypeStats.CCC}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-2">Courses & Transfers</h3>
                            <div className="space-y-1">
                                <p>Courses: {stats.courses}</p>
                                <p>Transfer Agreements: {stats.transferAgreements}</p>
                                <p>GE Requirements: {stats.geRequirements}</p>
                                <p>Major Requirements: {stats.majorRequirements}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-2">Transfer Types</h3>
                            <div className="space-y-1">
                                <p>UC Transferable: {transferTypeStats.UC_TRANSFERABLE}</p>
                                <p>CSU Transferable: {transferTypeStats.CSU_TRANSFERABLE}</p>
                                <p>IGETC Approved: {transferTypeStats.IGETC_APPROVED}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* College Search */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">🔍 Search Colleges</h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, code, or city..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {searchResults.slice(0, 5).map((college) => (
                                <div
                                    key={college.id}
                                    onClick={() => handleCollegeSelect(college)}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="font-semibold">{college.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {college.code} • {college.type} • {college.city}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedCollege && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Selected College</h3>
                            <div className="space-y-1">
                                <p><strong>Name:</strong> {selectedCollege.name}</p>
                                <p><strong>Code:</strong> {selectedCollege.code}</p>
                                <p><strong>Type:</strong> {selectedCollege.type}</p>
                                <p><strong>Location:</strong> {selectedCollege.city}, {selectedCollege.state}</p>
                                {selectedCollege.website && (
                                    <p><strong>Website:</strong>
                                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline ml-1">
                                            {selectedCollege.website}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* College Types */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">🏫 College Types</h2>

                    <div className="space-y-4">
                        {(['UC', 'CSU', 'CCC'] as const).map((type) => {
                            const typeColleges = getCollegesByType(type);
                            return (
                                <div key={type} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-2">
                                        {type} Colleges ({typeColleges.length})
                                    </h3>
                                    <div className="space-y-1">
                                        {typeColleges.slice(0, 3).map((college) => (
                                            <div
                                                key={college.id}
                                                onClick={() => handleCollegeSelect(college)}
                                                className="text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                            >
                                                {college.name} ({college.code})
                                            </div>
                                        ))}
                                        {typeColleges.length > 3 && (
                                            <div className="text-sm text-gray-500">
                                                +{typeColleges.length - 3} more...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected College Details */}
            {selectedCollege && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        📚 {selectedCollege.name} Details
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Courses */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Sample Courses</h3>
                            <div className="space-y-2">
                                {getCollegeCourses(selectedCollege.id).map((course) => (
                                    <div key={course.id} className="p-3 border border-gray-200 rounded-lg">
                                        <div className="font-medium">{course.courseCode}</div>
                                        <div className="text-sm text-gray-600">{course.courseTitle}</div>
                                        <div className="text-xs text-gray-500">
                                            {course.units} units • {course.department}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transfer Agreements */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Sample Transfer Agreements</h3>
                            <div className="space-y-2">
                                {getCollegeTransfers(selectedCollege.id).map((agreement) => {
                                    const targetCollege = colleges.find(c => c.id === agreement.targetCollegeId);
                                    const course = courses.find(c => c.id === agreement.courseId);

                                    return (
                                        <div key={agreement.id} className="p-3 border border-gray-200 rounded-lg">
                                            <div className="font-medium">{course?.courseCode}</div>
                                            <div className="text-sm text-gray-600">
                                                Transfers to: {targetCollege?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {agreement.transferType} • {agreement.unitsTransferred} units
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Integration Guide */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">🚀 How to Use This Data</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">1. Import the Data</h3>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                            {`import { 
  colleges, 
  courses, 
  transferAgreements,
  getCollegesByType,
  searchColleges 
} from '@/data/assist/utils';`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">2. Use the Search Functions</h3>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                            {`// Search colleges
const ucColleges = getCollegesByType('UC');
const searchResults = searchColleges('Berkeley');

// Get college data
const collegeCourses = getCoursesByCollege(collegeId);
const transfers = getTransferAgreementsByCollege(collegeId);`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">3. Build Transfer Planning Features</h3>
                        <p className="text-gray-700">
                            Use the transfer agreements data to help students plan their transfer pathways
                            between California community colleges, CSUs, and UCs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}