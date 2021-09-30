export const modifyNestedValue = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  state: any,
  keyList: any[],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
): any => {
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

export const modifyNestedValueInList = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  state: any,
  keyList: any[],
  index: number,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
): any => {
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

export const deleteNestedValueInList = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  state: any,
  keyList: any[],
  index: number,
): any => {
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

export const addNestedValueInList = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  state: any,
  keyList: any[],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
): any => {
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
