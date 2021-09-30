import React from "react";
import { DatePicker } from "@material-ui/pickers";
import { Moment } from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

type MomentPickerProps = {
  date: MaterialUiPickersDate | Moment;
  setDate: (value: MaterialUiPickersDate | Moment) => void;
  label: string;
};

export default function MomentPicker({
  date,
  setDate,
  label,
}: MomentPickerProps): JSX.Element {
  return (
    <DatePicker
      inputVariant="outlined"
      openTo="year"
      views={["year", "month"]}
      label={label}
      value={date}
      onChange={(d) => setDate(d)}
    />
  );
}
