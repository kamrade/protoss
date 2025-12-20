import { KYCStatus } from "../kyc";
import { PEPStatus } from "../pep";
import type { IPagination, ISort, IBaseEntity } from '@/features/common-types';

export interface IHSClient {
  companyName: string;
  contactEmail: string;
  createdDate: string;
  id: string;
  kycStatus: string; // TODO: add type
  pepStatus: string; // TODO: add type
  status: string;    // TODO: add type
  tenantId: number;
}

export interface IHSClientResponse {
  content: IHSClient[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPagination;
  size: number;
  sort: ISort[];
  totalElements: number;
  totalPages: number;
}

// получаем для Overview
export interface IHSClientOverview extends IBaseEntity {
  applications: string[];
  businessAddress: string;
  categoryId: number;
  companyName: string;
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactMiddleName: string;
  contactPhone: string;
  contactPosition: string;
  contactTitle: string;
  id: string;
  referralPartner: string;
  relationshipManagerEmail: string;
  salesManager: string;
  salesPersonEmail: string;
  status: string;
  tenantId: number;
}

// Получаем для отрисовки странички Client
export interface IApplication extends IBaseEntity {
  categoryId: number;
  companyName: string;
  haystackClientId: string;
  id: string;
  isIdle: boolean;
  isRiskScoringSubmitted: boolean;
  kind: string; // TYPING "LIVE_PROFILE"
  kycStatus: KYCStatus;
  mainStatus: string; // TYPE "PENDING_ON_CUSTOMER"
  number: string;
  pepStatus: PEPStatus;
  riskScoringVersion: number;
  riskStatus: string; // TYPE "NOT_PERFORMED"
  salesManager: string;
  version: number;
}

export interface IApplicationsResponse {
  content: IApplication[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPagination;
  size: number;
  sort: ISort;
  totalElements: number;
  totalPages: number;
}

// NOTES
export interface ICaseDocument extends IBaseEntity {
  id: string;
  tenantId: number;
  nodeId: string;
  fileName: string;
  fileSize: number;
  contentType: string; // TYPE
  uploadedDate: string;
  uploadedBy: string;
  uploadedByName: string;
  visueStatus: string; // TYPE
}

export interface INote extends IBaseEntity {
  id: string;
  tenantId: number;
  applicationId: string;
  title: string;
  text: string;
  isSummary: boolean;
  isDraft: boolean;
  isInternal: boolean;
  documents: ICaseDocument[];
}

export interface INoteUpdateHeader {
  filterParams: {};
  isDraft: boolean;
  isInternal: boolean;
  isSummary: boolean;
  referenceId: unknown;
  referenceType: unknown;
  taggedUsers: unknown[];
  text: string;
  title: string;
}
