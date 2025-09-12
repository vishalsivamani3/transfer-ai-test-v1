// Data access utilities for Assist California data
// Generated automatically - do not edit manually

import { College, Course, TransferAgreement, GeneralEducationRequirement, MajorRequirement, DataMetadata } from './types';

// Import data
import collegesData from './colleges.json';
import coursesData from './courses.json';
import transferAgreementsData from './transfer-agreements.json';
import geRequirementsData from './ge-requirements.json';
import majorRequirementsData from './major-requirements.json';
import metadataData from './metadata.json';

export const colleges: College[] = collegesData;
export const courses: Course[] = coursesData;
export const transferAgreements: TransferAgreement[] = transferAgreementsData;
export const geRequirements: GeneralEducationRequirement[] = geRequirementsData;
export const majorRequirements: MajorRequirement[] = majorRequirementsData;
export const metadata: DataMetadata = metadataData;

// Utility functions
export const getCollegeById = (id: number): College | undefined => {
  return colleges.find(college => college.id === id);
};

export const getCollegeByCode = (code: string): College | undefined => {
  return colleges.find(college => college.code === code);
};

export const getCollegesByType = (type: College['type']): College[] => {
  return colleges.filter(college => college.type === type);
};

export const getCoursesByCollege = (collegeId: number): Course[] => {
  return courses.filter(course => course.collegeId === collegeId);
};

export const getTransferAgreementsByCollege = (collegeId: number): TransferAgreement[] => {
  return transferAgreements.filter(agreement => agreement.sourceCollegeId === collegeId);
};

export const getTransferAgreementsByCourse = (courseId: number): TransferAgreement[] => {
  return transferAgreements.filter(agreement => agreement.courseId === courseId);
};

export const getTransferAgreementsByType = (transferType: TransferAgreement['transferType']): TransferAgreement[] => {
  return transferAgreements.filter(agreement => agreement.transferType === transferType);
};

export const getGERequirementsByCollege = (collegeId: number): GeneralEducationRequirement[] => {
  return geRequirements.filter(ge => ge.collegeId === collegeId);
};

export const getGERequirementsBySystem = (geSystem: GeneralEducationRequirement['geSystem']): GeneralEducationRequirement[] => {
  return geRequirements.filter(ge => ge.geSystem === geSystem);
};

export const getMajorRequirementsByCollege = (collegeId: number): MajorRequirement[] => {
  return majorRequirements.filter(major => major.collegeId === collegeId);
};

export const getMajorRequirementsByMajor = (majorName: string): MajorRequirement[] => {
  return majorRequirements.filter(major => major.majorName === majorName);
};

// Search functions
export const searchColleges = (query: string): College[] => {
  const lowerQuery = query.toLowerCase();
  return colleges.filter(college => 
    college.name.toLowerCase().includes(lowerQuery) ||
    college.code.toLowerCase().includes(lowerQuery) ||
    (college.city && college.city.toLowerCase().includes(lowerQuery))
  );
};

export const searchCourses = (query: string): Course[] => {
  const lowerQuery = query.toLowerCase();
  return courses.filter(course =>
    course.courseCode.toLowerCase().includes(lowerQuery) ||
    course.courseTitle.toLowerCase().includes(lowerQuery) ||
    (course.department && course.department.toLowerCase().includes(lowerQuery))
  );
};

// Statistics functions
export const getDataStatistics = () => {
  return metadata.statistics;
};

export const getCollegeTypeStatistics = () => {
  return metadata.collegeTypes;
};

export const getTransferTypeStatistics = () => {
  return metadata.transferTypes;
};
