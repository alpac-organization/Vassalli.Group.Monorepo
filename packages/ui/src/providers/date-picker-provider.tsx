import type { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

const muiPickersTheme = createTheme();

export type DatePickerProviderProps = {
  children: ReactNode;
  adapterLocale?: string;
};

export function DatePickerProvider({
  children,
  adapterLocale = "es",
}: DatePickerProviderProps) {
  dayjs.locale(adapterLocale);

  return (
    <MuiThemeProvider theme={muiPickersTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}
      localeText={{
      datePickerToolbarTitle: "Seleccionar fecha",
      okButtonLabel: "Aceptar",
      cancelButtonLabel: "Cancelar",
  }}>
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  );
}
