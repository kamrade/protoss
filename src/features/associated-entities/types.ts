export type DialogType = "individual" | "corporate";
export type EntitySectionAffiliation = "SHAREHOLDER" | "DIRECTOR" | "AUTHORISED_SIGNATORY" | "USER";

export type AffiliationType =
  'WALLET_SIGNATORY'
  | 'SHAREHOLDER'
  | 'INDIRECT_SHAREHOLDER'
  | 'DIRECTOR'
  | 'AUTHORISED_SIGNATORY'
  | 'USER'
  | 'HAYSTACK_CLIENT';

export interface Affiliation {
  type: AffiliationType;
  shareholding?: number;
  parentEntity?: string;
}

export interface BaseEntity {
  id: string;
  affiliation: Affiliation[];
}

export interface IndividualAssociatedEntity extends BaseEntity {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  idNumber: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  email: string;

  // if user
  mobileNumber: string;
  accessRights: string;


}

export interface CorporateAssociatedEntity  extends BaseEntity {
  name: string;
  tradingName: string;
  companyNumber: string;
  legalEntityType: string;
  countryOfIncorporation: string;
  dateOfIncorporation: string;
}


export type AssociatedEntity = CorporateAssociatedEntity | IndividualAssociatedEntity;
