// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const modifyNestedValue = (state: any, keyList: any[], value:any): any => {
    const key = keyList.shift();
  
    if (keyList.length) {
      return {
        ...state,
        [key]: modifyNestedValue(state[key], keyList, value),
      };
    } else {
      return {
        ...state,
        [key]: value,
      };
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  export const modifyNestedValueInList = (state:any, keyList:any[], index:number, value:any): any => {
    const key = keyList.shift();
  
    if (keyList.length) {
      return {
        ...state,
        [key]: modifyNestedValueInList(state[key], keyList, index, value),
      };
    } else {
      const targetArray = [...state[key]];
      targetArray[index] = value;
      return {
        ...state,
        [key]: targetArray,
      };
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  export const deleteNestedValueInList = (state: any, keyList: any[], index: number): any => {
    const key = keyList.shift();
  
    if (keyList.length) {
      return {
        ...state,
        [key]: deleteNestedValueInList(state[key], keyList, index),
      };
    } else {
      const targetArray = [...state[key]];
      targetArray.splice(index, 1);
      return {
        ...state,
        [key]: targetArray,
      };
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  export const addNestedValueInList = (state: any, keyList: any[], value:any): any => {
    const key = keyList.shift();
  
    if (keyList.length) {
      return {
        ...state,
        [key]: addNestedValueInList(state[key], keyList, value),
      };
    } else {
      const targetArray = [...state[key]];
      targetArray.push(value);
      return {
        ...state,
        [key]: targetArray,
      };
    }
  };