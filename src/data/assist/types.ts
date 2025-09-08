// TypeScript type definitions for Assist California data
// Generated automatically - do not edit manually

export interface College {
  id: number;
  name: string;
  code: string;
  type: 'UC' | 'CSU' | 'CCC' | 'AICCU';
  city?: string;
  state?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: number;
  collegeId: number;
  courseCode: string;
  courseTitle: string;
  units?: number;
  description?: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransferAgreement {
  id: number;
  sourceCollegeId: number;
  targetCollegeId?: number;
  courseId: number;
  transferType: 'UC_TRANSFERABLE' | 'CSU_TRANSFERABLE' | 'IGETC_APPROVED' | 'CSU_GE_BREADTH' | 'CSU_US_HISTORY' | 'CAL_GETC';
  equivalentCourse?: string;
  unitsTransferred?: number;
  transferNotes?: string;
  academicYear?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneralEducationRequirement {
  id: number;
  collegeId: number;
  courseId: number;
  geArea: string;
  geSystem: 'IGETC' | 'CSU_GE' | 'UC_GE' | 'CAL_GETC';
  academicYear?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MajorRequirement {
  id: number;
  collegeId: number;
  courseId: number;
  majorName: string;
  majorCode?: string;
  requirementType?: string;
  academicYear?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DataMetadata {
  version: string;
  lastUpdated: string;
  dataSource: string;
  statistics: {
    colleges: number;
    courses: number;
    transferAgreements: number;
    geRequirements: number;
    majorRequirements: number;
  };
  collegeTypes: {
    UC: number;
    CSU: number;
    CCC: number;
    AICCU: number;
  };
  transferTypes: {
    UC_TRANSFERABLE: number;
    CSU_TRANSFERABLE: number;
    IGETC_APPROVED: number;
    CSU_GE_BREADTH: number;
    CAL_GETC: number;
  };
}

// Utility types
export type CollegeType = College['type'];
export type TransferType = TransferAgreement['transferType'];
export type GESystem = GeneralEducationRequirement['geSystem'];
