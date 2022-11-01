import { Typography } from "@mui/material";
import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import useDetectWebGL from "../utils/hooks/useDetectWebGL";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  const isDetectWebGl = useDetectWebGL();
  if (!isDetectWebGl) {
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
