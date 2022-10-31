const useDetectWebGl = () => {
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

  if (gl) return true;
  else return false;
};

export default useDetectWebGl;
