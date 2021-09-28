/* eslint-disable no-useless-concat */
import moment, { Moment } from 'moment'
import Excel, { Workbook, Worksheet } from 'exceljs'
import { midlandCommercialQueriesDict, resultColDict, ModeSelectionTypes, TransactionTypes, UsageTypes, UsagePriceDict } from './constants'
import { getLookUpTables } from './appStorage'
import { BrowserWindow } from 'electron';
import { requestMilandResidentialData,requestMilandCommercialData } from '.';

export const combNumber = 5;
export const maxTrials = 3;

type constructAddressArgs = {
    isCommercial: boolean;
    each: {
        [key: string]: any;
    }
}

export const constructAddress = ({ isCommercial, each }:constructAddressArgs): string => {
    let address = "";
    if (isCommercial) {
      address += each.dist_name_zh ? each.dist_name_zh + "," : "";
      address += each.chi_name ? each.chi_name + "," : "";
      address += each.streetno ? each.streetno + "號" + "," : "";
      address += each.floor ? each.floor + "層" + "," : "";
      address += each.flat ? each.flat + "室" + "," : "";
    } else {
      address += each?.region?.name ? each.region.name + "," : "";
      address += each?.subregion?.name ? each.subregion.name + "," : "";
      address += each?.district?.name ? each.district.name + "," : "";
      address += each?.estate?.name ? each.estate.name + "," : "";
      address += each?.building?.name ? each.building.name + "," : "";
      address += each?.floor_level?.name ? each.floor_level.name + "," : "";
      address += each?.flat?.name ? each.flat.name + "室" + "," : "";
    }

    address = address.replace("**MID**", "中").replace("**HIGH**", "高").replace("**LOW**", "低").replace(",,", "").replace(",,,","")
    return address;
  };

  type handleAreaArgs = {
    isCommercial: boolean;
    modeSelection: ModeSelectionTypes;
    areaList: number[]| string[];
}

  export const handleArea = ({ isCommercial, modeSelection, areaList }: handleAreaArgs) : {
      targetAreaList: string[],
      targetArea: string
  } => {
    let targetAreaList = [];
    const lookUpTables = getLookUpTables();
  
    for (const a of areaList) {
      let chosenTable;
      if (modeSelection === "single") {
        chosenTable = isCommercial
          ? lookUpTables.commercialLookupSingle
          : lookUpTables.residentialLookupSingle;
        for (const [regionId, regionList] of Object.entries(chosenTable)) {
          let foundRegion = false;
  
          for (const reg of regionList) {
            if (a === reg) {
              targetAreaList.push(String(regionId));
              foundRegion = true;
              break;
            }
          }
  
          if (foundRegion) {
            break;
          }
        }
      } else {
        chosenTable = isCommercial
          ? lookUpTables.commercialLookupMultiple
          : lookUpTables.residentialLookupMultiple;
        for (const [regionId, regionList] of Object.entries(chosenTable)) {
          for (const reg of regionList) {
            if (a === reg) {
              targetAreaList.push(String(regionId));
            }
          }
        }
      }
    }
  
    targetAreaList = Array.from(new Set(targetAreaList));
  
    const targetArea = targetAreaList.join(",");
  
    return { targetAreaList, targetArea };
  };

  type constructWbArgs = {
      targetWb: Workbook,
      targetSheet: Worksheet,
      filename: string, 
      rowIndex: number,
      t: TransactionTypes,
      usage: UsageTypes,
      targetPropertyName: string, 
      mainWindow: BrowserWindow,
      tx: string,
      isCommercial: boolean,
      finalResult: number| null | undefined,
      finalComb: any[]| null,
      resultWbPath: string,
      totalNumber: number,
      passNumber: number
  }

  export const constructWb = async ({
    targetWb,
    targetSheet,
    filename,
    rowIndex,
    t,
    usage,
    targetPropertyName,
    resultWbPath,
    mainWindow,
    tx,
    isCommercial,
    finalResult,
    finalComb,
    totalNumber,
    passNumber
  }: constructWbArgs) : Promise<void>=> {
    if (!!finalResult && !!finalComb) {
      targetSheet.getCell(
        `${resultColDict[usage][t]}${rowIndex}`
      ).value = finalResult;
      targetWb.xlsx.writeFile(filename);
  
      let resultWb = new Excel.Workbook();
      try {
        resultWb = await resultWb.xlsx.readFile(resultWbPath);
      } catch {}
  
      let resultWs;
      if (!resultWb.worksheets.map((s) => s.name).includes("Result Sheet")) {
        resultWs = resultWb.addWorksheet("Result Sheet");
        resultWs.getCell("A1").value = `${usage} ${String(
          t
        ).toUpperCase()} Price for ${targetPropertyName}`;
      } else {
        resultWs = resultWb.getWorksheet("Result Sheet");
        const titleRow = resultWs.rowCount + 2;
        resultWs.getCell(`A${titleRow}`).value = `${usage} ${String(
          t
        ).toUpperCase()} Price for ${targetPropertyName}`;
      }
  
      const startRow = resultWs.rowCount + 1;
      resultWs.getCell(`A${startRow}`).value = "Transaction Date";
      resultWs.getCell(`B${startRow}`).value = "Market Info";
      resultWs.getCell(`C${startRow}`).value = "Approx. Area";
      resultWs.getCell(`D${startRow}`).value = "Leased Price";
      resultWs.getCell(`E${startRow}`).value = "Sell Price";

      resultWs.getCell(`H${startRow}`).value = "Number of transactions screened";
      resultWs.getCell(`I${startRow}`).value = "Total Number of transactions";
      resultWs.getCell(`K${startRow}`).value = "Pass %";

  
      let writeRow = startRow;
      resultWs.getCell(`H${writeRow + 1}`).value = `${passNumber}`
      resultWs.getCell(`I${writeRow + 1}`).value = `${totalNumber}`
      resultWs.getCell(`K${writeRow + 1}`).value = `=${(passNumber === 0 || totalNumber === 0)? 0: 100*passNumber/totalNumber}%`

      for (const each of finalComb) {
        writeRow += 1;
        if (isCommercial) {
          resultWs.getCell(`A${writeRow}`).value = each.tx_date.split(" ")[0];
          resultWs.getCell(`B${writeRow}`).value = constructAddress({
            isCommercial,
            each,
          });
          resultWs.getCell(`C${writeRow}`).value = Number(each.area);
          resultWs.getCell(`D${writeRow}`).value = !!each.ft_rent
            ? Number(each.ft_rent).toFixed(0)
            : "NA";
          resultWs.getCell(`E${writeRow}`).value = !!each.ft_sell
            ? Number(each.ft_sell).toFixed(0)
            : "NA";
        } else {
          resultWs.getCell(`A${writeRow}`).value = moment(each.tx_date).format(
            "YYYY-MM-DD"
          );
          resultWs.getCell(`B${writeRow}`).value = constructAddress({
            isCommercial,
            each,
          });
          resultWs.getCell(`C${writeRow}`).value = Number(each.net_area);
          resultWs.getCell(`D${writeRow}`).value =
            tx === "L"
              ? (Number(each.price) / Number(each.net_area)).toFixed()
              : "NA";
          resultWs.getCell(`E${writeRow}`).value =
            tx === "S"
              ? (Number(each.price) / Number(each.net_area)).toFixed()
              : "NA";
        }
      }
  
      writeRow += 2;
      resultWs.getCell(`A${writeRow}`).value = "(source: Midland)";
  
      writeRow += 2;
      resultWs.getCell(`A${writeRow}`).value = `Avg ${usage} ${String(
        t
      ).toUpperCase()} Price per square feet:`;
  
      writeRow += 1;
      resultWs.getCell(`A${writeRow}`).value = finalResult;
  
      await resultWb.xlsx.writeFile(resultWbPath);
    } else {
      mainWindow.webContents.send(
        "error:push",
        `Could not find row ${rowIndex} result within 10% difference of valuation price!`
      );
    }
  };


  type prepareSheetArgs = {
      targetWb: Workbook,
      targetSheet: Worksheet,
      filename: string,
      rowIndex: number,
      t: TransactionTypes,
      usage: UsageTypes,
      areaList: number[] | string[], 
      startDate: Moment,
      endDate: Moment,
      usagePriceDict: UsagePriceDict,
      targetPropertyName: string,
      resultWbPath: string,
      modeSelection: ModeSelectionTypes,
      mainWindow: BrowserWindow,
      isCommercial: boolean,
      token: string | undefined 

  }

  export const prepareSheet = async ({
    targetWb,
    targetSheet,
    filename,
    rowIndex,
    t,
    usage,
    areaList,
    startDate,
    endDate,
    usagePriceDict,
    targetPropertyName,
    resultWbPath,
    modeSelection,
    mainWindow,
    isCommercial,
    token,
  }: prepareSheetArgs): Promise<void>=> {
    const tx = midlandCommercialQueriesDict.transaction[t];
  
    const { targetAreaList, targetArea } = handleArea({
      isCommercial,
      modeSelection,
      areaList,
    });
  
    let finalResult;
    let finalComb;
    let totalNumber = 0;
    let passNumber = 0
  
    if (!!targetAreaList.length) {
      const requestResult = isCommercial
        ? await requestMilandCommercialData({
            targetArea,
            startDate,
            endDate,
            usagePriceDict,
            usage,
            t,
            maxTrials,
            combNumber,
            originalStartDate: startDate,
            originalEndDate: endDate,
          })
        : await requestMilandResidentialData({
            startDate,
            endDate,
            usagePriceDict,
            usage,
            t,
            maxTrials,
            token,
            combNumber,
            targetArea,
          });
      finalResult = requestResult.finalResult;
      finalComb = requestResult.finalComb;
      totalNumber = requestResult.totalNumber
      passNumber = requestResult.passNumber
    } else {
      finalResult = null;
      finalComb = null;
    }
  
    await constructWb({
      targetWb,
      targetSheet,
      filename,
      rowIndex,
      t,
      usage,
      targetPropertyName,
      resultWbPath,
      mainWindow,
      tx,
      isCommercial,
      finalResult,
      finalComb,
      totalNumber,
      passNumber
    });
  };
  