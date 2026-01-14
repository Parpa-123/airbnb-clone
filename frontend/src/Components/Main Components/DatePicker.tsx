import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFilterContext } from "../../services/filterContext";

type DatePickerRef = {
  getDates: () => { checkIn: string | null; checkOut: string | null };
  getDateObjects: () => { checkIn: Dayjs | null; checkOut: Dayjs | null };
};

type DatePickerProps = {
  ref?: React.Ref<DatePickerRef>;
  onChange?: (dates: { checkIn: string | null; checkOut: string | null }) => void;
};

const DatePickerValue = ({ ref, onChange }: DatePickerProps) => {
  const { filters } = useFilterContext();

  const [checkIn, setCheckIn] = React.useState<Dayjs | null>(() => {
    if (filters.check_in) {
      return dayjs(filters.check_in);
    }
    return dayjs().add(1, "day");
  });

  const [checkOut, setCheckOut] = React.useState<Dayjs | null>(() => {
    if (filters.check_out) {
      return dayjs(filters.check_out);
    }
    return dayjs().add(6, "day");
  });

  React.useEffect(() => {
    if (filters.check_in) {
      setCheckIn(dayjs(filters.check_in));
    }
    if (filters.check_out) {
      setCheckOut(dayjs(filters.check_out));
    }
  }, [filters.check_in, filters.check_out]);

  React.useImperativeHandle(
    ref,
    () => ({
      getDates: () => ({
        checkIn: checkIn ? checkIn.format("YYYY-MM-DD") : null,
        checkOut: checkOut ? checkOut.format("YYYY-MM-DD") : null,
      }),
      getDateObjects: () => ({
        checkIn,
        checkOut,
      }),
    }),
    [checkIn, checkOut]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="grid grid-cols-2 divide-x divide-gray-300">
        {}
        <div className="p-3">
          <MUIDatePicker
            label="CHECK-IN"
            value={checkIn}
            onChange={(newValue: Dayjs | null) => {
              setCheckIn(newValue);
              onChange?.({
                checkIn: newValue ? newValue.format("YYYY-MM-DD") : null,
                checkOut: checkOut ? checkOut.format("YYYY-MM-DD") : null,
              });
            }}
            slotProps={{
              textField: {
                variant: "standard",
                InputProps: {
                  disableUnderline: true,
                },
                InputLabelProps: {
                  shrink: true,
                  style: {
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#222222",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  },
                },
                inputProps: {
                  style: {
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#222222",
                    padding: "4px 0 0 0",
                  },
                },
              },
            }}
          />
        </div>

        {}
        <div className="p-3">
          <MUIDatePicker
            label="CHECKOUT"
            value={checkOut}
            onChange={(newValue: Dayjs | null) => {
              setCheckOut(newValue);
              onChange?.({
                checkIn: checkIn ? checkIn.format("YYYY-MM-DD") : null,
                checkOut: newValue ? newValue.format("YYYY-MM-DD") : null,
              });
            }}
            minDate={checkIn ?? undefined}
            slotProps={{
              textField: {
                variant: "standard",
                InputProps: {
                  disableUnderline: true,
                },
                InputLabelProps: {
                  shrink: true,
                  style: {
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#222222",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  },
                },
                inputProps: {
                  style: {
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#222222",
                    padding: "4px 0 0 0",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DatePickerValue;
