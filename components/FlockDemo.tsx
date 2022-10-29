import FlocksContextProvider from "../utils/context/FlocksContextProvider";
import FlocksCanvas from "./FlocksCanvas";
import FlocksControls from "./FlocksControls";

type Props = {};

const FlockDemo = (props: Props) => {
  return (
    <FlocksContextProvider>
      <FlocksCanvas />
      <FlocksControls />
    </FlocksContextProvider>
  );
};

export default FlockDemo;
