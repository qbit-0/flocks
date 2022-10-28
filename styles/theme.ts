import { createTheme, ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#F06292",
    },
    background: {
      main: "#212121",
    },
    box: {
      main: "#424242",
    },
    birdA: {
      main: "#F06292",
    },
    birdB: {
      main: "#4DD0E1",
    },
    birdC: {
      main: "#FFD54F",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
