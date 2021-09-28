export enum LookUpTableTypes {
    residentialLookupSingle = 'residentialLookupSingle',
    residentialLookupMultiple = 'residentialLookupMultiple',
    commercialLookupSingle = "commercialLookupSingle",
    commercialLookupMultiple = "commercialLookupMultiple"
  }
  
 export const choiceReferenceName = {
    [LookUpTableTypes.residentialLookupSingle]: "Residential: Single Mode",
    [LookUpTableTypes.residentialLookupMultiple]: "Residential: Multiple Mode",
    [LookUpTableTypes.commercialLookupSingle]: "Commercial/Office: Single Mode",
    [LookUpTableTypes.commercialLookupMultiple]: "Commercial/Office: Multiple Mode",
  };

export type LookUpTables = {
    [key in keyof typeof LookUpTableTypes]: any
}