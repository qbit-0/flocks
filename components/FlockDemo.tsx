import { Box } from "@mui/material";
import React from "react";
import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  return (
    <FlocksContextProvider>
      <FlocksCanvas />
      <Box component="div" position="absolute" padding={4} maxWidth="25vw">
        <FlocksControls />
      </Box>
    </FlocksContextProvider>
  );
};

export default FlockDemo;
