import { KYCStatus } from "../kyc";
import { PEPStatus } from "../pep";
import type { IPagination, ISort } from '@/features/common-types';

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
export interface IHSClientOverview {
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
  createdBy: string;
  createdByName: string;
  createdDate: string;
  id: string;
  referralPartner: string;
  relationshipManagerEmail: string;
  salesManager: string;
  salesPersonEmail: string;
  status: string;
  tenantId: number;
}

// Получаем для отрисовки странички Client
export interface IApplication {
  categoryId: number;
  companyName: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  haystackClientId: string;
  id: string;
  isIdle: boolean;
  isRiskScoringSubmitted: boolean;
  kind: string; // TYPING "LIVE_PROFILE"
  kycStatus: KYCStatus;
  mainStatus: string; // TYPE "PENDING_ON_CUSTOMER"
  modifiedBy: string;
  modifiedByName: string;
  modifiedDate: string;
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
