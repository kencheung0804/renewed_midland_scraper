import { Moment } from "moment";

export enum TransactionTypes {
  rental = "rental",
  selling = "selling",
}

export enum UsageTypes {
  Commercial = "Commercial",
  Office = "Office",
  Residential = "Residential",
}

export enum LookUpTableTypes {
  residentialLookupSingle = "residentialLookupSingle",
  residentialLookupMultiple = "residentialLookupMultiple",
  commercialLookupSingle = "commercialLookupSingle",
  commercialLookupMultiple = "commercialLookupMultiple",
}

export enum ModeSelectionTypes {
  single = "single",
  multiple = "multiple",
}

export type InputDate = string | Date | number | Moment;

export type PriceRangeDict = {
  [key in keyof typeof TransactionTypes]: {
    upper: number | null;
    lower: number | null;
  };
};

export type UsagePriceDict = {
  [key in keyof typeof UsageTypes]: PriceRangeDict;
};

export const txType: TransactionTypes[] = [
  TransactionTypes.rental,
  TransactionTypes.selling,
];

export const usageColDict = {
  Commercial: {
    rental: {
      valuation: "X",
      actual: "AE",
    },
    selling: "AL",
  },
  Office: {
    rental: {
      valuation: "Y",
      actual: "AF",
    },
    selling: "AM",
  },
  Residential: {
    rental: {
      valuation: "Z",
      actual: "AG",
    },
    selling: "AL",
  },
};

export const resultColDict = {
  Commercial: {
    rental: "S",
    selling: "AO",
  },
  Office: {
    rental: "T",
    selling: "AP",
  },
  Residential: {
    rental: "U",
    selling: "AQ",
  },
};

export const userAgentList = [
  "Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
];

export const chooseUserAgent = (): string => {
  return userAgentList[Math.floor(Math.random() * userAgentList.length)];
};

export const midlandCommercialQueriesDict = {
  transaction: { rental: "L", selling: "S" },
  usage: { Commercial: "s", Office: "c" },
};

export const defaultResidentialLookupSingle = {
  "100101": ["Central Mid-Levels / Admiralty"],
  "100102": ["Hong Kong West"],
  "100103": ["Western Mid-Levels"],
  "100104": ["Sheung Wan / Central"],
  "100105": ["The Peak"],
  "100201": ["Jardine'S Lookout / Tai Hang"],
  "100202": ["Happy Valley / Mid Level East"],
  "100203": ["Wan Chai / Causeway Bay"],
  "100204": ["Tin Hau"],
  "100301": ["Repulse Bay / Shouson Hill"],
  "100302": ["Stanley"],
  "100303": ["Residence Bel-Air / Pokfulam"],
  "100304": ["Aberdeen / Wong Chuk Hang"],
  "100305": ["Ap Lei Chau"],
  "100306": ["Tai Tam / Shek O"],
  "100401": ["North Point / Fortress Hill"],
  "100402": ["Braemar Hill / North Point Midlevel"],
  "100403": ["Quarry Bay"],
  "100404": ["Chai Wan"],
  "100405": ["Sai Wan Ho / Taikoo"],
  "100406": ["Shau Kei Wan"],
  "100407": ["Heng Fa Chuen (Chai Wan)"],
  "200501": ["Tsim Sha Tsui"],
  "200502": ["Mongkok"],
  "200503": ["Kingspark"],
  "200504": ["Kowloon Station"],
  "200505": ["Olympic"],
  "200506": ["Tai Kok Tsui"],
  "200507": ["Yau Ma Tei"],
  "200601": ["Lai Chi Kok"],
  "200602": ["Cheung Sha Wan / Sham Shui Po"],
  "200603": ["Yau Yat Chuen"],
  "200604": ["Mei Foo"],
  "200701": ["Kowloon Bay"],
  "200702": ["Lam Tin / Yau Tong"],
  "200703": ["Kwun Tong"],
  "200801": ["Wong Tai Sin / Lok Fu"],
  "200802": ["Diamond Hill / San Po Kong / Ngau Chi Wan"],
  "200901": ["Hung Hom"],
  "200902": ["Ho Man Tin"],
  "200903": ["Kowloon Tong / Beacon Hill"],
  "200904": ["To Kwa Wan"],
  "200905": ["Kowloon City"],
  "200906": ["Kai Tak"],
  "201001": ["Hang Hau"],
  "201002": ["Po Lam / Tseung Kwan O Station"],
  "201004": ["Tiu Keng Leng"],
  "201005": ["Lohas Park"],
  "301003": ["Sai Kung / Clear Water Bay"],
  "301101": ["Tsuen Wan"],
  "301102": ["Sham Tseng"],
  "301103": ["Ma Wan"],
  "301201": ["Kwai Chung"],
  "301202": ["Tsing Yi"],
  "301301": ["Tuen Mun"],
  "301401": ["Tin Shui Wai"],
  "301402": ["Yuen Long"],
  "301403": ["Hung Shui Kiu"],
  "301404": ["Fairview / Palm Springs / The Vineyard"],
  "301501": ["Sheung Shui / Fanling"],
  "301502": ["North"],
  "301601": ["Tai Po"],
  "301701": ["Kau To Shan / Fotan"],
  "301702": ["Shatin"],
  "301703": ["Ma On Shan"],
  "301801": ["Lantau / Island"],
  "301802": ["Discovery Bay"],
  "301803": ["Tung Chung"],
};

export const defaultResidentialLookupMultiple = {
  "100101": ["Central Mid-Levels / Admiralty", "Mid-Levels"],
  "100102": ["Hong Kong West"],
  "100103": ["Western Mid-Levels", "Mid-Levels"],
  "100104": ["Sheung Wan / Central"],
  "100105": ["The Peak", "Mid-Levels"],
  "100201": ["Jardine'S Lookout / Tai Hang"],
  "100202": ["Happy Valley / Mid Level East"],
  "100203": ["Wan Chai / Causeway Bay"],
  "100204": ["Tin Hau"],
  "100301": ["Repulse Bay / Shouson Hill", "Mid-Levels"],
  "100302": ["Stanley", "Hong Kong South"],
  "100303": ["Residence Bel-Air / Pokfulam", "Mid-Levels"],
  "100304": ["Aberdeen / Wong Chuk Hang", "Hong Kong South"],
  "100305": ["Ap Lei Chau"],
  "100306": ["Tai Tam / Shek O", "Hong Kong South"],
  "100401": ["North Point / Fortress Hill"],
  "100402": ["Braemar Hill / North Point Midlevel"],
  "100403": ["Quarry Bay"],
  "100404": ["Chai Wan"],
  "100405": ["Sai Wan Ho / Taikoo"],
  "100406": ["Shau Kei Wan"],
  "100407": ["Heng Fa Chuen (Chai Wan)"],
  "200501": ["Tsim Sha Tsui"],
  "200502": ["Mongkok"],
  "200503": ["Kingspark"],
  "200504": ["Kowloon Station", "Tsim Sha Tsui"],
  "200505": ["Olympic"],
  "200506": ["Tai Kok Tsui"],
  "200507": ["Yau Ma Tei", "Tsim Sha Tsui"],
  "200601": ["Lai Chi Kok"],
  "200602": ["Cheung Sha Wan / Sham Shui Po"],
  "200603": ["Yau Yat Chuen"],
  "200604": ["Mei Foo"],
  "200701": ["Kowloon Bay"],
  "200702": ["Lam Tin / Yau Tong"],
  "200703": ["Kwun Tong"],
  "200801": ["Wong Tai Sin / Lok Fu"],
  "200802": ["Diamond Hill / San Po Kong / Ngau Chi Wan"],
  "200901": ["Hung Hom"],
  "200902": ["Ho Man Tin"],
  "200903": ["Kowloon Tong / Beacon Hill"],
  "200904": ["To Kwa Wan"],
  "200905": ["Kowloon City"],
  "200906": ["Kai Tak"],
  "201001": ["Hang Hau"],
  "201002": ["Po Lam / Tseung Kwan O Station"],
  "201004": ["Tiu Keng Leng"],
  "201005": ["Lohas Park"],
  "301003": ["Sai Kung / Clear Water Bay"],
  "301101": ["Tsuen Wan"],
  "301102": ["Sham Tseng"],
  "301103": ["Ma Wan"],
  "301201": ["Kwai Chung"],
  "301202": ["Tsing Yi"],
  "301301": ["Tuen Mun"],
  "301401": ["Tin Shui Wai"],
  "301402": ["Yuen Long"],
  "301403": ["Hung Shui Kiu"],
  "301404": ["Fairview / Palm Springs / The Vineyard"],
  "301501": ["Sheung Shui / Fanling"],
  "301502": ["North"],
  "301601": ["Tai Po"],
  "301701": ["Kau To Shan / Fotan"],
  "301702": ["Shatin"],
  "301703": ["Ma On Shan"],
  "301801": ["Lantau / Island"],
  "301802": ["Discovery Bay"],
  "301803": ["Tung Chung"],
};

export const defaultCommercialLookupSingle = {
  CEN: ["Central"],
  WES: ["Western District"],
  ADM: ["Admiralty"],
  SHW: ["Sheung Wan"],
  WAC: ["Wan Chai", "Wanchai"],
  WCN: ["Wan Chai Waterfront"],
  CAB: ["Causeway Bay"],
  NOP: ["North Point"],
  SKW: ["Shau Kei Wan"],
  CHW: ["Chai Wan"],
  QUB: ["Quarry Bay"],
  TAK: ["Taikoo Shing"],
  SSW: ["Siu Sai Wan"],
  WCH: ["Wong Chuk Hang"],
  ABE: ["Aberdeen"],
  KWC: ["Kwai Chung"],
  TSW: ["Tsuen Wan"],
  TUM: ["Tuen Mun"],
  YUL: ["Yuen Long"],
  SHS: ["Sheung Shui"],
  SHM: ["Shek Mun"],
  SHT: ["Sha Tin"],
  MOK: ["Mongkok"],
  TST: ["Tsim Sha Tsui"],
  TSI: ["Tsim Sha Tsui West"],
  JOR: ["Jordan"],
  YMT: ["Yau Ma Tei"],
  PRE: ["Prince Edward"],
  TKT: ["Tai Kok Tsui"],
  TSE: ["Tsim Sha Tsui East"],
  SSP: ["Sham Shui Po"],
  CSW: ["Cheung Sha Wan"],
  KOC: ["Kowloon City"],
  HUH: ["Hung Hom"],
  SPK: ["San Po Kong"],
  KWT: ["Kwun Tong"],
  KOB: ["Kowloon Bay"],
};

export const defaultCommercialLookupMultiple = {
  CEN: ["Central"],
  WES: ["Western District"],
  ADM: ["Admiralty"],
  SHW: ["Sheung Wan"],
  WAC: ["Wan Chai Waterfront", "Wan Chai", "Wanchai"],
  WCN: ["Wan Chai Waterfront", "Wan Chai", "Wanchai"],
  CAB: ["Causeway Bay"],
  NOP: ["North Point", "Quarry Bay"],
  SKW: ["Shau Kei Wan"],
  CHW: ["Chai Wan"],
  QUB: ["Quarry Bay", "North Point", "Taikoo Shing"],
  TAK: ["Taikoo Shing", "Quarry Bay"],
  SSW: ["Siu Sai Wan"],
  WCH: ["Wong Chuk Hang"],
  ABE: ["Aberdeen"],
  SOU: ["Stanley"],
  KWC: ["Kwai Chung"],
  TSW: ["Tsuen Wan"],
  TUM: ["Tuen Mun"],
  YUL: ["Yuen Long"],
  SHS: ["Sheung Shui"],
  SHM: ["Shek Mun"],
  SHT: ["Sha Tin"],
  MOK: ["Mong kok", "Yau Ma Tei", "Tai Kok Tsui", "Prince Edward"],
  TST: ["Tsim Sha Tsui", "Tsim Sha Tusi West", "Tsim Sha Tsui East"],
  TSI: ["Tsim Sha Tsui", "Tsim Sha Tusi West", "Tsim Sha Tsui East"],
  JOR: ["Jordan", "Yau Ma Tei", "Mong kok", "Tsim Sha Tsui"],
  YMT: ["Yau Ma Tei", "Mong kok", "Jordan"],
  PRE: ["Prince Edward", "Sham Shui Po", "Tai Kok Tsui", "Mong kok"],
  TKT: ["Tai Kok Tsui", "Mong kok", "Prince Edward"],
  TSE: ["Tsim Sha Tsui", "Tsim Sha Tusi West", "Tsim Sha Tsui East"],
  SSP: ["Sham Shui Po", "Prince Edward", "Cheung Sha Wan"],
  CSW: ["Cheung Sha Wan", "Sham Shui Po"],
  KOC: ["Kowloon City", "San Po Kong"],
  HUH: ["Hung Hom"],
  SPK: ["San Po Kong", "Kowloon City", "Kowloon Bay", "Ngau Tau Kok"],
  KWT: ["Kwun Tong", "Kowloon Bay", "Ngau Tau Kok"],
  KOB: ["Kowloon Bay", "Kwun Tong", "Ngau Tau Kok"],
  YAT: ["Yau Tong", "Kwun Tong"],
  NTK: ["Ngau Tau Kok", "Kowloon Bay", "Kwun Tong"],
};
