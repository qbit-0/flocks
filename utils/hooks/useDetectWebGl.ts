import { useEffect, useState } from "react";

const useDetectWebGL = () => {
  const [isWebGlDetected, setIsWebGlDetected] = useState(false);

  useEffect(() => {
    const testCanvas = document.createElement("canvas");
    let gl = null;

    try {
      gl = testCanvas.getContext("webgl");
    } catch {
      gl = null;
    }

    if (gl === null) {
      try {
        gl = testCanvas.getContext("experimental-webgl");
      } catch {
        gl = null;
      }
    }

    setIsWebGlDetected(!!gl);
  }, []);

  return isWebGlDetected;
};

export default useDetectWebGL;
