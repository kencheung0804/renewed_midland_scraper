   
import React from "react";
import { TextField, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  modifyNestedValueInList,
  deleteNestedValueInList,
} from "../../utils/updateState";
import { LookUpTables, LookUpTableTypes } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  textField: {
    flex: 1,
  },
  delete: {
    cursor: "pointer",
  },
}));

type LookupModComponentArgs = {
    setStore: React.Dispatch<React.SetStateAction<LookUpTables>>;
    selectedChoice: LookUpTableTypes;
    targetKey: string;
    arrayIndex: number;
    displayValue: string;
}

export default function LookupModComponent({
  setStore,
  selectedChoice,
  targetKey,
  arrayIndex,
  displayValue,
}: LookupModComponentArgs): JSX.Element {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <TextField
        className={classes.textField}
        value={displayValue}
        onChange={(e) => {
          const value = e.target.value;
          setStore((prevStore) =>
            modifyNestedValueInList(
              prevStore,
              [selectedChoice, targetKey],
              arrayIndex,
              value
            )
          );
        }}
      />

      <CancelIcon
        color="error"
        fontSize="small"
        className={classes.delete}
        onClick={() =>
          setStore((prevStore) =>
            deleteNestedValueInList(
              prevStore,
              [selectedChoice, targetKey],
              arrayIndex
            )
          )
        }
      />
    </Box>
  );
}