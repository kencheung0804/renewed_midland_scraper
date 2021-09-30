import React, { useCallback } from "react";
import { Snackbar } from "@material-ui/core";
import { Color } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";

type AlertBarProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  severity: Color | undefined;
  message: string;
};

function AlertBar({
  open,
  setOpen,
  severity,
  message,
}: AlertBarProps): JSX.Element {
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertBar;
