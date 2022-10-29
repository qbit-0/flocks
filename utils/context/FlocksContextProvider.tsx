import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";

export type FlocksContextType = {
  numBirds: number;
  setNumBirds: Dispatch<SetStateAction<number>>;
  maxSpeed: number;
  setMaxSpeed: Dispatch<SetStateAction<number>>;
  mousePushForce: number;
  setMousePushForce: Dispatch<SetStateAction<number>>;
  mousePushDist: number;
  setMousePushDist: Dispatch<SetStateAction<number>>;
  steerForce: number;
  setSteerForce: Dispatch<SetStateAction<number>>;
  separationDist: number;
  setSeparationDist: Dispatch<SetStateAction<number>>;
  alignmentDist: number;
  setAlignmentDist: Dispatch<SetStateAction<number>>;
  cohesionDist: number;
  setCohesionDist: Dispatch<SetStateAction<number>>;
  separationWeight: number;
  setSeparationWeight: Dispatch<SetStateAction<number>>;
  alignmentWeight: number;
  setAlignmentWeight: Dispatch<SetStateAction<number>>;
  cohesionWeight: number;
  setCohesionWeight: Dispatch<SetStateAction<number>>;
  worldWidth: number;
  setWorldWidth: Dispatch<SetStateAction<number>>;
  worldHeight: number;
  setWorldHeight: Dispatch<SetStateAction<number>>;
  worldDepth: number;
  setWorldDepth: Dispatch<SetStateAction<number>>;
  borderPushForce: number;
  setBorderPushForce: Dispatch<SetStateAction<number>>;
  borderPushDist: number;
  setBorderPushDist: Dispatch<SetStateAction<number>>;
};

export const FlocksContext = createContext<FlocksContextType>({} as any);

type Props = {
  children: React.ReactNode;
  initialNumBirds?: number;
  initialMaxSpeed?: number;
  initialMousePushForce?: number;
  initialMousePushDist?: number;
  initialSteerForce?: number;
  initialSeparationDist?: number;
  initialAlignmentDist?: number;
  initialCohesionDist?: number;
  initialSeparationWeight?: number;
  initialAlignmentWeight?: number;
  initialCohesionWeight?: number;
  initialWorldWidth?: number;
  initialWorldHeight?: number;
  initialWorldDepth?: number;
  initialBorderPushForce?: number;
  initialBorderPushDist?: number;
};

const FlocksContextProvider: FC<Props> = ({
  children,
  initialNumBirds = 500,
  initialMaxSpeed = 1000,
  initialMousePushForce = 2000000,
  initialMousePushDist = 5,
  initialSteerForce = 100000,
  initialSeparationDist = 2.5,
  initialAlignmentDist = 2.5,
  initialCohesionDist = 2.5,
  initialSeparationWeight = 1.5,
  initialAlignmentWeight = 2,
  initialCohesionWeight = 1.5,
  initialWorldWidth = 40,
  initialWorldHeight = 40,
  initialWorldDepth = 40,
  initialBorderPushForce = 1000000,
  initialBorderPushDist = 10,
}) => {
  const [numBirds, setNumBirds] = useState(initialNumBirds);
  const [maxSpeed, setMaxSpeed] = useState(initialMaxSpeed);

  const [mousePushForce, setMousePushForce] = useState(initialMousePushForce);
  const [mousePushDist, setMousePushDist] = useState(initialMousePushDist);

  const [steerForce, setSteerForce] = useState(initialSteerForce);
  const [separationDist, setSeparationDist] = useState(initialSeparationDist);
  const [alignmentDist, setAlignmentDist] = useState(initialAlignmentDist);
  const [cohesionDist, setCohesionDist] = useState(initialCohesionDist);
  const [separationWeight, setSeparationWeight] = useState(
    initialSeparationWeight
  );
  const [alignmentWeight, setAlignmentWeight] = useState(
    initialAlignmentWeight
  );
  const [cohesionWeight, setCohesionWeight] = useState(initialCohesionWeight);

  const [worldWidth, setWorldWidth] = useState(initialWorldWidth);
  const [worldHeight, setWorldHeight] = useState(initialWorldHeight);
  const [worldDepth, setWorldDepth] = useState(initialWorldDepth);
  const [borderPushForce, setBorderPushForce] = useState(
    initialBorderPushForce
  );
  const [borderPushDist, setBorderPushDist] = useState(initialBorderPushDist);

  return (
    <FlocksContext.Provider
      value={{
        numBirds,
        setNumBirds,
        maxSpeed,
        setMaxSpeed,
        mousePushForce,
        setMousePushForce,
        mousePushDist,
        setMousePushDist,
        steerForce,
        setSteerForce,
        separationDist,
        setSeparationDist,
        alignmentDist,
        setAlignmentDist,
        cohesionDist,
        setCohesionDist,
        separationWeight,
        setSeparationWeight,
        alignmentWeight,
        setAlignmentWeight,
        cohesionWeight,
        setCohesionWeight,
        worldWidth,
        setWorldWidth,
        worldHeight,
        setWorldHeight,
        worldDepth,
        setWorldDepth,
        borderPushForce,
        setBorderPushForce,
        borderPushDist,
        setBorderPushDist,
      }}
    >
      {children}
    </FlocksContext.Provider>
  );
};

export default FlocksContextProvider;
