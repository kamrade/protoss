export interface UserPermissionResource {
  createdDate: string;
  id: number;
  name: string;
  scope: string;
  description: string;
  hasAmcSupport: boolean;
}

export interface UserPermission {
  id: number;
  name: string;
  description?: string;
  scope: string;
  type?: string;
  resource?: UserPermissionResource;
}

export interface UserDepartment {
  id: number;
  category: string;
}

export interface TenantDepartment extends UserDepartment {
  tenantId: number;
}

export interface TenantProductApi {
  id: number;
  apiName: string;
}

export interface UserTenant {
  id: number;
  name: string;
  baseCurrency: string;
  indexPattern: string;
  productUrl: string;
  imageUrl: string;
  sanctionProcessorType: string;
  productApi: TenantProductApi;
}

export interface UserGroup {
  id: number;
  name: string;
  permissions: UserPermission[];
}

export interface TenantGroup extends UserGroup {
  tenantId: number;
}

export interface IUser {
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  createdByName: string;
  modifiedByName: string;
  id: string;
  keycloakId: string;
  tenantId: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  permissions: UserPermission[];
  departments: UserDepartment[];
  tenants: UserTenant[];
  groups: UserGroup[];
  tenantPermissions: UserPermission[];
  tenantDepartments: TenantDepartment[];
  tenantGroups: TenantGroup[];
}
