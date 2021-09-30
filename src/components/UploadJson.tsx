import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Button,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Frame from "./parts/Frame";
import LookupTable from "./parts/LookupTable";
import AlertBar from "./parts/AlertBar";
import {
  choiceReferenceName,
  LookUpTables,
  LookUpTableTypes,
} from "../utils/constants";

const useStyles = makeStyles((theme) => ({
  select: { minWidth: 200 },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  emptyText: { paddingTop: 100 },
  fileInput: { paddingBottom: 50 },
}));

export default function UploadJson(): JSX.Element {
  const classes = useStyles();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [store, setStore] = useState<LookUpTables>({
    [LookUpTableTypes.commercialLookupMultiple]: null,
    [LookUpTableTypes.commercialLookupSingle]: null,
    [LookUpTableTypes.residentialLookupMultiple]: null,
    [LookUpTableTypes.residentialLookupSingle]: null,
  });
  const [selectedChoice, setSelectedChoice] = useState<LookUpTableTypes | null>(
    null,
  );
  const [tableSavedShow, setTableSavedShow] = useState(false);
  const choices = Object.keys(store) as LookUpTableTypes[];

  useEffect(() => {
    ipcRenderer.send("store:request");
  }, [ipcRenderer]);

  useEffect(() => {
    const getStoreFromElectron = (
      e: Electron.IpcRendererEvent,
      item: LookUpTables,
    ) => {
      setStore(item);
    };
    const handleTableSaved = () => setTableSavedShow(true);
    ipcRenderer.on("store:send", getStoreFromElectron);
    ipcRenderer.on("store:saved", handleTableSaved);

    return () => {
      ipcRenderer.removeListener("store:send", getStoreFromElectron);
      ipcRenderer.removeListener("store:saved", handleTableSaved);
    };
  }, [setStore, ipcRenderer]);
  return (
    <Frame>
      <FormControl className={classes.select}>
        <InputLabel>Choose Table</InputLabel>
        <Select
          value={selectedChoice}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedChoice(e.target.value as LookUpTableTypes)
          }
        >
          {choices.map((c, index) => (
            <MenuItem key={index} value={c}>
              {choiceReferenceName[c] ? choiceReferenceName[c] : index}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {store && selectedChoice ? (
        <React.Fragment>
          <Button
            onClick={() => {
              ipcRenderer.send("store:store", store);
            }}
            className={classes.saveButton}
            color="primary"
          >
            Save Table
          </Button>

          <input
            type="file"
            name="Upload Whole Json File"
            accept="application/json"
            className={classes.fileInput}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const fileReader = new FileReader();
              const target = e.target as HTMLInputElement;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              fileReader.readAsText(target.files![0], "UTF-8");
              fileReader.onload = (e) => {
                setStore((prevStore) => ({
                  ...prevStore,
                  [selectedChoice]: JSON.parse(e.target?.result as string),
                }));
              };
            }}
          />
          <LookupTable
            {...{
              selectedTable: store[selectedChoice],
              setStore,
              selectedChoice,
            }}
          />
        </React.Fragment>
      ) : (
        <Typography variant="h4" align="center" className={classes.emptyText}>
          Please Choose A Table Above
        </Typography>
      )}
      <AlertBar
        {...{
          open: tableSavedShow,
          setOpen: setTableSavedShow,
          severity: "success",
          message: "Table Saved",
        }}
      />
    </Frame>
  );
}
