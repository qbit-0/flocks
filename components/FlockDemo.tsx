import { Typography } from "@mui/material";
import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import WebGL from "../utils/WebGL";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  if (!WebGL.isWebGLAvailable()) {
    return <Typography>WebGl is not supported on this browser. </Typography>;
  }

  return (
    <FlocksContextProvider>
      <FlocksCanvas />
      <FlocksControls />
    </FlocksContextProvider>
  );
};

export default FlockDemo;
