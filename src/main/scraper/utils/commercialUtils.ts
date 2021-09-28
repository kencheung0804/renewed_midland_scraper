import { TransactionTypes, UsagePriceDict, UsageTypes } from "../constants";

   
type handleCommercialCombsArgs = {
    usage: UsageTypes;
    t: TransactionTypes;
    combNumber: number;
    combs: any[];
    usagePriceDict: UsagePriceDict;
    transactionList: any[]
}

type handleCommercialCombsReturns = {
    finalResult: number| undefined;
    finalComb: any[]| undefined;
    totalNumber: number;
    passNumber: number;
}

export const handleCommercialCombs = ({
    usagePriceDict,
    usage,
    t,
    combNumber,
    combs,
    transactionList
  }: handleCommercialCombsArgs): handleCommercialCombsReturns => {
    let finalResult;
    let finalComb;
    const targetRange = Object.values(usagePriceDict[usage][t]).sort(
      (a: number, b: number) => a - b
    ) as number[];
    const maxRangeNumber = Math.max(...targetRange);
    const minRangeNumber = Math.min(...targetRange);

    const totalNumber = transactionList.length
    let passNumber = 0

    transactionList.forEach((r:any) => {
      const { ft_sell: ftSell, ft_rent: ftRent } = r;
  
        if (
          t === "selling" &&
          !!ftSell &&
          ftSell > 0 &&
          ftSell >= minRangeNumber &&
          ftSell <= maxRangeNumber * 1.15
        ) {
          passNumber++
        } else if (
          t === "rental" &&
          !!ftRent &&
          ftRent >= minRangeNumber &&
          ftRent <= maxRangeNumber * 1.15
        ) {
          passNumber++
        }
    })
    for (const comb of combs) {
      let combSum = 0;
      let count = 0;
  
      let result;
      for (const c of comb) {
        const { ft_sell: ftSell, ft_rent: ftRent } = c;
  
        if (
          t === "selling" &&
          !!ftSell &&
          ftSell > 0 &&
          ftSell >= minRangeNumber &&
          ftSell <= maxRangeNumber * 1.15
        ) {
          combSum += ftSell;
          count += 1;
        } else if (
          t === "rental" &&
          !!ftRent &&
          ftRent >= minRangeNumber &&
          ftRent <= maxRangeNumber * 1.15
        ) {
          combSum += ftRent;
          count += 1;
        }
      }
  
      if (count === combNumber) {
        result = combSum / combNumber;
      } else {
        result = -1;
      }
  
      if (result <= maxRangeNumber && result >= minRangeNumber) {
        finalResult = result;
        finalComb = comb;
        break;
      }
    }
    return { finalResult, finalComb, totalNumber, passNumber };
  };