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
        padding={4}
        maxWidth="25vw"
        height="90vh"
        overflow="auto"
      >
        <FlocksControls />
      </Box>

      <Box
        component="div"
        display="flex"
        justifyContent="center"
        position="absolute"
        width="100%"
        bottom={4}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Created by{" "}
          <Link
            onClick={() => {
              window.open("https://www.duypham.tech/", "_blank");
            }}
          >
            Duy Pham.
          </Link>{" "}
          <Link
            onClick={() => {
              window.open("https://github.com/qbit-0/flocks", "_blank");
            }}
          >
            Source code.
          </Link>
        </Typography>
      </Box>
    </FlocksContextProvider>
  );
};

export default FlockDemo;
