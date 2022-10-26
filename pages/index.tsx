import { Box } from "@mui/material";
import Head from "next/head";
import FlockDemo from "../components/FlockDemo";

export default function Home() {
  return (
    <Box component="div">
      <Head>
        <title>Flocks</title>
      </Head>
      <Box component="div" display="flex" width="100%" height="100vh">
        <FlockDemo />
      </Box>
    </Box>
  );
}
