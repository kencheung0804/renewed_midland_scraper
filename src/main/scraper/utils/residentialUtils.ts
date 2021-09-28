// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import combinations from 'combinations-generator'
import moment, { Moment } from 'moment'
import { InputDate, TransactionTypes, UsagePriceDict, UsageTypes } from '../constants';

type searchDateRangeArgs = {
    placeDict: {
        tx_date: InputDate,
    },
    startDate: Moment,
    endDate: Moment
}

export const searchDateRange = ({ placeDict, startDate, endDate }: searchDateRangeArgs) : boolean  => {
    const { tx_date: rawTxDate } = placeDict;
    if (!rawTxDate) {
      return false;
    }
    try {
      const txDate = moment(rawTxDate);
      if (startDate <= txDate && txDate <= endDate) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };


type findResultAndComboArgs = { 
    resResult: any[], 
    combNumber: number,
    usagePriceDict: UsagePriceDict,
    t: TransactionTypes,
    startDate: Moment,
    endDate: Moment,
    usage: UsageTypes,
}

type TempReturns = {
    tempResult: number | null | undefined;
    tempComb: any[] | null;
    totalNumber: number;
    passNumber: number;
}

 export const findResultAndCombo = ({
    resResult,
    combNumber,
    usagePriceDict,
    usage,
    t,
    startDate,
    endDate,
  }: findResultAndComboArgs): TempReturns => {
    resResult = resResult.filter((placeDict) =>
      searchDateRange({ placeDict, startDate, endDate })
    );

    const targetRange = Object.values(usagePriceDict[usage][t]).sort(
      (a: number, b: number) => a - b
    ) as number[];

    const maxRangeNumber = Math.max(...targetRange);
    const minRangeNumber = Math.min(...targetRange);

    const totalNumber = resResult.length
    let passNumber = 0
    resResult.forEach((r: any) => {
      const { price, net_area: netArea } = r;
        const ftPrice = price / netArea;
        if (!!price && !!netArea && price > 0) {
          if (
            maxRangeNumber * 1.15 >= ftPrice &&
            minRangeNumber * 0.85 <= ftPrice
          ) {
            passNumber++;
          }
        }
    })
  
    let tempResult;
    let tempComb;
  
    const combs = combinations(resResult, combNumber);
  
    for (const comb of combs) {
      let result;
      let combSum = 0;
      let count = 0;
  
      comb.forEach((c: any) => {
        const { price, net_area: netArea } = c;
        const ftPrice = price / netArea;
        if (!!price && !!netArea && price > 0) {
          if (
            maxRangeNumber * 1.15 >= ftPrice &&
            minRangeNumber * 0.85 <= ftPrice
          ) {
            combSum += price / netArea;
            count += 1;
          }
        }
      });
      if (count === combNumber) {
        result = combSum / combNumber;
      } else {
        result = -1;
      }
  
      if (result <= maxRangeNumber && result >= minRangeNumber) {
        tempResult = result;
        tempComb = comb;
        break;
      }
    }
  
    return { tempResult, tempComb , totalNumber, passNumber};
  };
  