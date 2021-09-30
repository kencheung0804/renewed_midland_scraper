import {
  axiosMidlandResidentialData,
  axiosMilandCommercialData,
} from "./axiosRequests";
import { TransactionTypes, UsagePriceDict, UsageTypes } from "./constants";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import combinations from "combinations-generator";
import { handleCommercialCombs } from "./utils/commercialUtils";
import moment, { Moment } from "moment";
import { findResultAndCombo } from "./utils/residentialUtils";

type requestMilandCommercialDataArgs = {
  targetArea: string | number;
  startDate: Moment;
  endDate: Moment;
  usagePriceDict: UsagePriceDict;
  usage: UsageTypes;
  t: TransactionTypes;
  maxTrials: number;
  combNumber: number;
  originalStartDate: Moment;
  originalEndDate: Moment;
};

type FinalReturns = {
  finalResult: number | null | undefined;
  finalComb: any[] | null;
  totalNumber: number;
  passNumber: number;
};

export const requestMilandCommercialData = async ({
  targetArea,
  startDate,
  endDate,
  usagePriceDict,
  usage,
  t,
  maxTrials,
  combNumber,
  originalStartDate,
  originalEndDate,
}: requestMilandCommercialDataArgs): Promise<FinalReturns> => {
  const originalMaxTrials = maxTrials;
  const { transactionList } = await axiosMilandCommercialData({
    targetArea,
    startDate,
    endDate,
    usage,
    t,
  });

  const combs = combinations(transactionList, combNumber);

  const { finalResult, finalComb, totalNumber, passNumber } =
    handleCommercialCombs({
      usagePriceDict,
      usage,
      t,
      combNumber,
      combs,
      transactionList,
    });

  if (!finalComb || !finalResult) {
    maxTrials -= 1;
    if (maxTrials > 0) {
      const newStartDate = moment(startDate).clone().subtract(1, "month");
      return await requestMilandCommercialData({
        targetArea,
        startDate: newStartDate,
        endDate,
        usagePriceDict,
        usage,
        t,
        maxTrials,
        combNumber,
        originalStartDate,
        originalEndDate,
      });
    } else if (maxTrials === 0) {
      const newEndDate = moment(endDate).clone().add(1, "month");
      return await requestMilandCommercialData({
        targetArea,
        startDate,
        endDate: newEndDate,
        usagePriceDict,
        usage,
        t,
        maxTrials,
        combNumber,
        originalStartDate,
        originalEndDate,
      });
    }
    if (combNumber > 3) {
      combNumber -= 1;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return await requestMilandCommercialData({
        targetArea,
        startDate: originalStartDate,
        endDate: originalEndDate,
        usagePriceDict,
        usage,
        t,
        maxTrials: originalMaxTrials,
        combNumber,
        originalStartDate,
        originalEndDate,
      });
    } else {
      return { finalResult: null, finalComb: null, totalNumber, passNumber };
    }
  } else {
    return { finalResult, finalComb, totalNumber, passNumber };
  }
};

type requestMilandResidentialDataArgs = {
  startDate: Moment;
  endDate: Moment;
  usagePriceDict: UsagePriceDict;
  usage: UsageTypes;
  t: TransactionTypes;
  maxTrials: number;
  token: string | undefined;
  combNumber: number;
  targetArea: string | number;
};

export const requestMilandResidentialData = async ({
  startDate,
  endDate,
  usagePriceDict,
  usage,
  t,
  maxTrials,
  token,
  combNumber,
  targetArea,
}: requestMilandResidentialDataArgs): Promise<FinalReturns> => {
  const { resResult } = await axiosMidlandResidentialData({
    t,
    token,
    targetArea,
  });

  const {
    tempResult,
    tempComb,
    totalNumber: ttnumber,
    passNumber: psnumber,
  } = findResultAndCombo({
    resResult,
    combNumber,
    usagePriceDict,
    startDate,
    endDate,
    usage,
    t,
  });

  let finalResult = tempResult;
  let finalComb = tempComb;
  let totalNumber = ttnumber;
  let passNumber = psnumber;

  while ((!finalResult || !finalComb) && maxTrials >= 0) {
    if (maxTrials > 0) {
      startDate = moment(startDate).clone().subtract(1, "month");
    } else {
      endDate = moment(endDate).clone().add(1, "month");
    }

    const {
      tempResult: r,
      tempComb: c,
      totalNumber: tt,
      passNumber: p,
    } = findResultAndCombo({
      resResult,
      combNumber,
      usagePriceDict,
      startDate,
      endDate,
      usage,
      t,
    });
    finalResult = r;
    finalComb = c;
    totalNumber = tt;
    passNumber = p;
    maxTrials -= 1;
  }

  return { finalResult, finalComb, totalNumber, passNumber };
};
