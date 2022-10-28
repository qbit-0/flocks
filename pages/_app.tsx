import type { AppProps } from "next/app";
import "../styles/globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { enableMapSet } from "immer";
import theme from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  enableMapSet();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
