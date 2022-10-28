import { createTheme, ThemeOptions } from "@mui/material";
import {
  amber,
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    canvasBg: {
      main: string;
    };
    box: {
      main: string;
    };
    bird: string[];
  }

  interface PaletteOptions {
    canvasBg: {
      main: string;
    };
    box: {
      main: string;
    };
    bird: string[];
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#F06292",
    },
    canvasBg: {
      main: "#455A64",
    },
    box: {
      main: "#BCAAA4",
    },
    bird: [
      red[600],
      pink[600],
      purple[600],
      deepPurple[600],
      indigo[600],
      blue[600],
      lightBlue[600],
      cyan[600],
      teal[600],
      green[600],
      lightGreen[600],
      lime[600],
      yellow[600],
      amber[600],
      orange[600],
      deepOrange[600],
    ],
  },
};

const theme = createTheme(themeOptions);

export default theme;
