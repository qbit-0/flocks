import { Box, Link, Typography } from "@mui/material";
import { Loader } from "@react-three/drei";
import React from "react";
import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  return (
    <FlocksContextProvider>
      <FlocksCanvas />
      <Box
        component="div"
        position="absolute"
        padding={1}
        maxWidth="25vw"
        height="90vh"
        overflow="auto"
      >
        <FlocksControls />
      </Box>
    </FlocksContextProvider>
  );
};

export default FlockDemo;
