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
  maxForce: number;
  setMaxForce: Dispatch<SetStateAction<number>>;
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
};

export const FlocksContext = createContext<FlocksContextType>({} as any);

type Props = {
  children: React.ReactNode;
  initialNumBirds?: number;
  initialSeparationDist?: number;
  initialAlignmentDist?: number;
  initialCohesionDist?: number;
  initialSeparationWeight?: number;
  initialAlignmentWeight?: number;
  initialCohesionWeight?: number;
  initialMaxSpeed?: number;
  initialMaxForce?: number;
  initialBoundWidth?: number;
  initialBoundHeight?: number;
  initialBoundDepth?: number;
};

const FlocksContextProvider: FC<Props> = ({
  children,
  initialNumBirds = 1000,
  initialSeparationDist = 2,
  initialAlignmentDist = 3,
  initialCohesionDist = 4,
  initialMaxSpeed = 1000,
  initialMaxForce = 100000,
  initialSeparationWeight = 2,
  initialAlignmentWeight = 1,
  initialCohesionWeight = 1.2,
  initialBoundWidth = 40,
  initialBoundHeight = 40,
  initialBoundDepth = 40,
}) => {
  const [numBirds, setNumBirds] = useState(initialNumBirds);
  const [separationDist, setSeparationDist] = useState(initialSeparationDist);
  const [alignmentDist, setAlignmentDist] = useState(initialAlignmentDist);
  const [cohesionDist, setCohesionDist] = useState(initialCohesionDist);
  const [maxSpeed, setMaxSpeed] = useState(initialMaxSpeed);
  const [maxForce, setMaxForce] = useState(initialMaxForce);
  const [separationWeight, setSeparationWeight] = useState(
    initialSeparationWeight
  );
  const [alignmentWeight, setAlignmentWeight] = useState(
    initialAlignmentWeight
  );
  const [cohesionWeight, setCohesionWeight] = useState(initialCohesionWeight);
  const [worldWidth, setWorldWidth] = useState(initialBoundWidth);
  const [worldHeight, setWorldHeight] = useState(initialBoundHeight);
  const [worldDepth, setWorldDepth] = useState(initialBoundDepth);

  return (
    <FlocksContext.Provider
      value={{
        numBirds,
        setNumBirds,
        separationDist,
        setSeparationDist,
        alignmentDist,
        setAlignmentDist,
        cohesionDist,
        setCohesionDist,
        maxSpeed,
        setMaxSpeed,
        maxForce,
        setMaxForce,
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
      }}
    >
      {children}
    </FlocksContext.Provider>
  );
};

export default FlocksContextProvider;
