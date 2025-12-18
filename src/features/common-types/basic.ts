export interface IBaseEntity {
  createdDate: string;
  createdBy: string;
  createdByName: string;
  modifiedDate?: string;
  modifiedBy?: string;
  modifiedByName?: string;
}