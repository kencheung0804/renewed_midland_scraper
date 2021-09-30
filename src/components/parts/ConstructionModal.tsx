import React from "react";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom";

type ConstructionModalProps = {
  constructModalOpen: boolean;
  errorMessages: string[];
  loading: boolean;
  setConstructModalOpen: (value: boolean) => void;
};

export default function ConstructionModal({
  constructModalOpen,
  errorMessages,
  loading,
  setConstructModalOpen,
}: ConstructionModalProps): JSX.Element {
  const classes = useStyles();

  return (
    <Backdrop open={constructModalOpen} className={classes.backdrop}>
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Target excel file is creating for you now!
        </Typography>
        <ScrollToBottom className={classes.errorBox}>
          {errorMessages.map((e: string, index: number) => (
            <Typography
              variant="subtitle2"
              key={index}
              className={classes.typography}
            >{`${"-"} ${e}`}</Typography>
          ))}
        </ScrollToBottom>
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Button color="primary" onClick={() => setConstructModalOpen(false)}>
            Close
          </Button>
        )}
      </Paper>
    </Backdrop>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: { zIndex: 1000000 },
  paper: {
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    boxSizing: "border-box",
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  errorBox: {
    width: "100%",
    height: "70%",
    backgroundColor: theme.palette.common.black,
    padding: 20,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    boxSizing: "border-box",
    overflowWrap: "break-word",
    overflowY: "scroll",
  },
  typography: {
    color: theme.palette.common.white,
  },
}));
