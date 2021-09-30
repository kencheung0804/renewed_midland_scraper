import { BrowserWindow } from "electron";
import { Worksheet } from "exceljs";
import setCookie from "set-cookie-parser";
import axios from "axios";
import {
  PriceRangeDict,
  txType,
  usageColDict,
  UsagePriceDict,
  UsageTypes,
} from "../constants";

export const setUpResidentialToken = async (): Promise<string | undefined> => {
  const res = await axios.get("https://www.midland.com.hk/en/list/transaction");
  const rawToken = res.headers["set-cookie"][0] as string;
  const tokenObj = setCookie.parse(rawToken)[0];
  return tokenObj.value;
};

type getAreaListArgs = {
  ws: Worksheet;
  rowIndex: number;
};

export const getAreaList = ({ ws, rowIndex }: getAreaListArgs): string[] => {
  const rawArea = ws.getCell(`H${rowIndex}`).value as string;
  const areaList: string[] = [];
  rawArea
    .replace(" And ", " & ")
    .replace(" AND ", " & ")
    .replace(" and ", " & ")
    .split("&")
    ?.forEach((a: string) => {
      areaList.push(a.trim());
    });
  return areaList;
};

type getUsageListArgs = {
  ws: Worksheet;
  rowIndex: number;
  mainWindow: BrowserWindow;
};

export const getUsageList = ({
  ws,
  rowIndex,
  mainWindow,
}: getUsageListArgs): UsageTypes[] => {
  const rawUsages = ws.getCell(`I${rowIndex}`).value as string;
  const usages: UsageTypes[] = [];
  rawUsages.split("/").forEach((u) => {
    let rUsage = u.trim();
    if (
      ["Apartments", "Residential", "Office", "Commercial"].includes(rUsage)
    ) {
      if (rUsage === "Apartments") {
        rUsage = "Residential";
      }
      usages.push(rUsage as UsageTypes);
    } else {
      mainWindow.webContents.send(
        "error:push",
        `Usage in row ${rowIndex} not valid. Only Apartments, Residential, Office and Commercial are available!`,
      );
    }
  });

  return Array.from(new Set(usages));
};

type makeUsagePriceDictArgs = {
  ws: Worksheet;
  rowIndex: number;
  usages: UsageTypes[];
  mainWindow: BrowserWindow;
};

export const makeUsagePriceDict = ({
  ws,
  rowIndex,
  usages,
  mainWindow,
}: makeUsagePriceDictArgs): UsagePriceDict => {
  const rawPriceRangeDict: PriceRangeDict = {
    rental: {
      upper: null,
      lower: null,
    },
    selling: {
      upper: null,
      lower: null,
    },
  };

  const usagePriceDict = {
    [UsageTypes.Commercial]: { ...rawPriceRangeDict },
    [UsageTypes.Office]: { ...rawPriceRangeDict },
    [UsageTypes.Residential]: { ...rawPriceRangeDict },
  };

  usages?.forEach((usage) => {
    const priceRangeDict: PriceRangeDict = { ...rawPriceRangeDict };

    txType.forEach((t) => {
      if (t === "rental") {
        const rawRentalValuationCell = `${usageColDict[usage][t]["valuation"]}${rowIndex}`;
        const rentalValuation =
          !!ws.getCell(rawRentalValuationCell).value ||
          ws.getCell(rawRentalValuationCell).value !== "NA"
            ? String(ws.getCell(rawRentalValuationCell).value)
            : null;

        const rawRentalActualCell = `${usageColDict[usage][t]["actual"]}${rowIndex}`;
        const rentalActual =
          !!ws.getCell(rawRentalActualCell).value ||
          ws.getCell(rawRentalActualCell).value !== "NA"
            ? String(ws.getCell(rawRentalActualCell).value)
            : null;

        if (!!rentalValuation !== !!rentalActual) {
          mainWindow.webContents.send(
            "error:push",
            `Actual or valuation price misses in row ${rowIndex}'s Rental Price Valuation Summary`,
          );
          return;
        }
        if (!!rentalValuation && !!rentalActual) {
          const valuationRangeList = rentalValuation
            .split("-")
            .map((limit) => Number(String(limit).trim().replace(",", "")));

          const actual = Number(String(rentalActual).trim().replace(",", ""));

          const valuationRange = [
            valuationRangeList[0] * 0.9,
            valuationRangeList.slice(-1)[0] * 1.1,
          ];

          const actualRange = [actual * 0.9, actual * 1.1];

          if (
            actualRange[1] <= valuationRange[0] ||
            (actualRange[1] <= valuationRange[1] &&
              valuationRange[1] <= actualRange[0])
          ) {
            priceRangeDict[t]["upper"] = valuationRange[1];
            priceRangeDict[t]["lower"] = valuationRange[0];
          } else if (
            actualRange[0] >= valuationRange[0] &&
            actualRange[1] <= valuationRange[1]
          ) {
            priceRangeDict[t]["upper"] = valuationRange[1];
            priceRangeDict[t]["lower"] = valuationRange[0];
          } else if (
            actualRange[0] <= valuationRange[0] &&
            actualRange[1] >= valuationRange[0] &&
            actualRange[1] <= valuationRange[1]
          ) {
            priceRangeDict[t]["upper"] = actualRange[1];
            priceRangeDict[t]["lower"] = valuationRange[0];
          } else if (
            actualRange[0] >= valuationRange[0] &&
            actualRange[0] <= valuationRange[1] &&
            actualRange[1] >= valuationRange[1]
          ) {
            priceRangeDict[t]["upper"] = valuationRange[1];
            priceRangeDict[t]["lower"] = actualRange[0];
          } else if (
            actualRange[1] >= valuationRange[1] &&
            valuationRange[0] >= actualRange[0]
          ) {
            priceRangeDict[t]["upper"] = valuationRange[1];
            priceRangeDict[t]["lower"] = valuationRange[0];
          }
        } else {
          priceRangeDict[t]["upper"] = null;
          priceRangeDict[t]["lower"] = null;
        }
      } else if (t === "selling") {
        const rawSellingCell = `${usageColDict[usage][t]}${rowIndex}`;
        const sellingValuation =
          !!ws.getCell(rawSellingCell).value ||
          ws.getCell(rawSellingCell).value !== "NA"
            ? String(ws.getCell(rawSellingCell).value)
            : null;
        if (!!sellingValuation) {
          const valuationRangeList = sellingValuation
            .split("-")
            .map((limit) => Number(String(limit).trim().replace(",", "")));

          const valuationRange = [
            valuationRangeList[0] * 0.9,
            valuationRangeList.slice(-1)[0] * 1.1,
          ];

          priceRangeDict[t]["upper"] = valuationRange[1] * 1.1;
          priceRangeDict[t]["lower"] = valuationRange[0] * 0.9;
        } else {
          priceRangeDict[t]["upper"] = null;
          priceRangeDict[t]["lower"] = null;
        }
      }

      usagePriceDict[usage] = priceRangeDict;
    });
  });

  return usagePriceDict;
};
