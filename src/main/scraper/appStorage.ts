import Store from "electron-store";
import {
  defaultResidentialLookupSingle,
  defaultCommercialLookupSingle,
  defaultCommercialLookupMultiple,
  defaultResidentialLookupMultiple,
  LookUpTableTypes,
} from "./constants";

type getLookUpTablesReturns = {
  [LookUpTableTypes.commercialLookupMultiple]: typeof defaultCommercialLookupMultiple;
  [LookUpTableTypes.commercialLookupSingle]: typeof defaultCommercialLookupSingle;
  [LookUpTableTypes.residentialLookupMultiple]: typeof defaultResidentialLookupMultiple;
  [LookUpTableTypes.residentialLookupSingle]: typeof defaultResidentialLookupSingle;
};

export const getLookUpTables = (): getLookUpTablesReturns => {
  const store = new Store({ cwd: "lookUpTables" });

  return {
    residentialLookupSingle: store.get(
      "residentialLookupSingle",
      defaultResidentialLookupSingle,
    ) as typeof defaultResidentialLookupSingle,
    residentialLookupMultiple: store.get(
      "residentialLookupMultiple",
      defaultResidentialLookupMultiple,
    ) as typeof defaultResidentialLookupMultiple,
    commercialLookupSingle: store.get(
      "commercialLookupSingle",
      defaultCommercialLookupSingle,
    ) as typeof defaultCommercialLookupSingle,
    commercialLookupMultiple: store.get(
      "commercialLookupMultiple",
      defaultCommercialLookupMultiple,
    ) as typeof defaultCommercialLookupMultiple,
  };
};

export const saveLookUpTables = (tables: { [key: string]: any }): void => {
  const store = new Store({ cwd: "lookUpTables" });

  for (const [table, value] of Object.entries(tables)) {
    store.set(table, value);
  }
};
