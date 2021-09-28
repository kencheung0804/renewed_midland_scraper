import React, {useEffect, useState, useCallback} from "react";
import { hot } from "react-hot-loader/root";
import moment, { Moment } from "moment";
import acceptedMimeTypes from "../utils/acceptedMimeTypes";
import "./style.css";
import Frame from "./parts/Frame";
import ConstructionModal from "./parts/ConstructionModal";
import { Box, Button, Chip, FormControlLabel, makeStyles, Switch, TextField, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentPicker from "./parts/MomentPicker";
import MomentUtils from "@date-io/moment";
import AlertBar from "./parts/AlertBar";
import FileDrop from "./parts/FileDrop";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

function App() {
  const electron = window.require('electron')
  const ipcRenderer = electron.ipcRenderer
  const classes = useStyles();
  const [notSupportedOpenBar, setNotSupportedOpenBar] = useState(false);
  const [errorMessages, setErrorMessages] = useState(["Loading..."]);
  const [modeSelection, setModeSelection] = useState(true);
  const mode = modeSelection ? "multiple" : "single";
  const [loading, setLoading] = useState(false);
  const [constructModalOpen, setConstructModalOpen] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState<string| null>(null);
  const [startDate, setStartDate] = useState<Moment|MaterialUiPickersDate>(moment().startOf("month"));
  const [endDate, setEndDate] = useState<Moment|MaterialUiPickersDate>(moment().startOf("month"));
  const [resultWbPath, setResultWbPath] = useState<string | null>(null);
  const [resultWbName, setResultWbName] = useState("");


  useEffect(() => {
    const setNotLoading = () => setLoading(false);
    const pushNewError = (e:Electron.IpcRendererEvent , item:string) => {
      setErrorMessages((prevMessages) => [...prevMessages, item]);
    };
    const resultWbPathChosen = (e:Electron.IpcRendererEvent, item: string) => {
      if (item.length) {
        setResultWbPath(item);
      }
    };
    ipcRenderer.on("data:constructed", setNotLoading);
    ipcRenderer.on("error:push", pushNewError);
    ipcRenderer.on("filePath:chosen", resultWbPathChosen);
    return () => {
      ipcRenderer.removeListener("data:constructed", setNotLoading);
      ipcRenderer.removeListener("error:push", pushNewError);
    };
  }, [ipcRenderer])

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedFile = acceptedFiles?.length && acceptedFiles[0];
      if (selectedFile && acceptedMimeTypes.includes(selectedFile.type)) {
        setSelectedExcelFile(selectedFile.path);
      } else {
        setNotSupportedOpenBar(true);
      }
    },
    [setSelectedExcelFile]
  );

  const sendFileToBackend = useCallback(() => {
    setLoading(true);
    setConstructModalOpen(true);
    if (!!selectedExcelFile && !!resultWbPath) {
      ipcRenderer.send("parameters:selected", {
        filename: selectedExcelFile,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        resultWbName: resultWbName + ".xlsx",
        rawResultPath: resultWbPath,
        modeSelection: mode,
      });
    }
  }, [
    selectedExcelFile,
    startDate,
    endDate,
    ipcRenderer,
    setLoading,
    mode,
    resultWbName,
    resultWbPath,
  ]);

  return (
    <Frame
      modal={
        <ConstructionModal
          {...{
            errorMessages,
            setErrorMessages,
            loading,
            constructModalOpen,
            setConstructModalOpen,
          }}
        />
      }
    >
      <FormControlLabel
        label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
        control={
          <Switch
            checked={modeSelection}
            onChange={(e) => setModeSelection(e.target.checked)}
            color="primary"
          />
        }
        className={classes.switch}
      />
      <Box className={classes.locationBox}>
        <Button onClick={() => ipcRenderer.send("select-dirs")} color="primary">
          Select Result File Directory
        </Button>
        {!!resultWbPath && (
          <Typography variant="subtitle2">{resultWbPath}</Typography>
        )}
        <TextField
          label="Desired File Name"
          value={resultWbName}
          onChange={(e) => setResultWbName(e.target.value)}
        />
      </Box>
      <FileDrop {...{ onDrop }} />
      <AlertBar
        {...{
          open: notSupportedOpenBar,
          setOpen: setNotSupportedOpenBar,
          severity: "error",
          message: "Only excel files are accepted!",
        }}
      />
      {!!selectedExcelFile && (
        <Chip
          label={"..." + selectedExcelFile?.slice(-15)}
          onDelete={() => setSelectedExcelFile(null)}
          color="primary"
          className={classes.chip}
        />
      )}
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <Box className={classes.dateBox}>
          <Box style={{marginRight: 20}}>
          <MomentPicker
            {...{ date: startDate, setDate: setStartDate, label: "Start Date" }}
          />
          </Box>
          <MomentPicker
            {...{ date: endDate, setDate: setEndDate, label: "End Date" }}
          />
        </Box>
      </MuiPickersUtilsProvider>

      <Button
        variant="contained"
        disabled={!selectedExcelFile || !resultWbPath || !resultWbName || !mode}
        color="primary"
        size="large"
        className={classes.scrapeButton}
        onClick={sendFileToBackend}
      >
        Scrape Now!
      </Button>
    </Frame>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  scrapeButton: {
    marginTop: 20,
    width: "50%",
    marginBottom: 50,
  },
  dateBox: {
    width: "80%",
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20,
  },
  chip: { marginTop: 20 },
  backdrop: {
    zIndex: 1000000,
  },
  switch: {
    alignSelf: "flex-end",
  },
  locationBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
  },
}));

export default hot(App);
