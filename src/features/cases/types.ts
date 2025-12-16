import type { IPagination, ISort } from '@/features/common-types';

export interface ICaseMetadata {
  applicationCaseType: string;
  applicationNumber: number;
  companyName: string;
  haystackClientId: string;
  isOnboardingEvent: string; // BOOLEAN
  riskLevel: string; // TYPE
}

export interface ICase {
  assigneeId: string;
  caseCategory: string; // TYPE
  caseId: string;
  caseMetaData: ICaseMetadata;
  caseStatus: string; // TYPE
  caseType: string; // TYPE
  closingDate: string;
  createdDateTime: string;
  description: string;
  jiraKey: unknown;
  referenceId: string;
  tenantId: number;
}

export interface ICaseResponse {
  content: ICase[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPagination;
  size: number;
  sort: ISort[];
  totalElement: number;
  totalPages: number;
}