import { Typography } from "@mui/material";
import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import useDetectWebGl from "../utils/hooks/useDetectWebGl";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  const isDetectWebGL = useDetectWebGl();
  if (!isDetectWebGL) {
    return <Typography>WebGl is not supported on this browser.</Typography>;
  }

  return (
    <FlocksContextProvider>
      <FlocksCanvas />
      <FlocksControls />
    </FlocksContextProvider>
  );
};

export default FlockDemo;
