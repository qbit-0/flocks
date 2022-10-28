import { createTheme, ThemeOptions } from "@mui/material";

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
      main: "#212121",
    },
    box: {
      main: "#424242",
    },
    bird: ["#F06292", "#4DD0E1", "#FFD54F"],
  },
};

const theme = createTheme(themeOptions);

export default theme;
