import { Box } from "@mui/material";
import Head from "next/head";
import FlockDemo from "../components/FlockDemo";

export default function Home() {
  return (
    <Box component="div">
      <Head>
        <title>Flocks</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Box component="div" display="flex" width="100%" height="100vh">
        <FlockDemo />
      </Box>
    </Box>
  );
}
