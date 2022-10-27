import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import produce from "immer";
import { useContext, useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { CollisionGrid, createGrid, getGridDims } from "../utils/collisionGrid";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import {
  BirdsData,
  BORDER_THICKNESS,
  CollisionGrids,
  update,
} from "../utils/updateFlock";

const BIRD_GEOMETRY = <coneGeometry args={[0.25, 1, 16, 1]} />;
const BIRD_MATERIAL = (
  <meshStandardMaterial color="white" roughness={0.5} metalness={0.5} />
);

type Props = {};

const Flocks = ({}) => {
  const flocksContext = useContext(FlocksContext);
  const {
    numBirds,
    maxSpeed,
    maxForce,
    separationDist,
    alignmentDist,
    cohesionDist,
    worldWidth,
    worldHeight,
    worldDepth,
  } = flocksContext;

  const [posArr, setPosArr] = useState<Vector3[]>([]);
  const [velArr, setVelArr] = useState<Vector3[]>([]);
  const [accArr, setAccArr] = useState<Vector3[]>([]);
  const [rotArr, setRotArr] = useState<Vector3[]>([]);

  const worldDims = new Vector3(worldWidth, worldHeight, worldDepth);
  const [separationGrid, setSeparationGrid] = useState<CollisionGrid>({
    worldDims: new Vector3(300, 300, 300),
    worldOffset: new Vector3(-150, -150, -150),
    gridDims: getGridDims(worldDims, separationDist),
    values: [],
  });
  const [alignmentGrid, setAlignmentGrid] = useState<CollisionGrid>({
    worldDims: new Vector3(300, 300, 300),
    worldOffset: new Vector3(-150, -150, -150),
    gridDims: getGridDims(worldDims, separationDist),
    values: [],
  });
  const [cohesionGrid, setCohesionGrid] = useState<CollisionGrid>({
    worldDims: new Vector3(300, 300, 300),
    worldOffset: new Vector3(-150, -150, -150),
    gridDims: getGridDims(worldDims, separationDist),
    values: [],
  });

  useEffect(() => {
    const nextPosArr: Vector3[] = [];
    const posCellValuePairs: [Vector3, number][] = [];
    for (let i = 0; i < numBirds; i++) {
      const pos = new Vector3(
        randFloatSpread(worldWidth - BORDER_THICKNESS * 2),
        randFloatSpread(worldHeight - BORDER_THICKNESS * 2),
        randFloatSpread(worldDepth - BORDER_THICKNESS * 2)
      );
      nextPosArr.push(pos);
      posCellValuePairs.push([pos, i]);
    }
    setPosArr(nextPosArr);

    const worldDims = new Vector3(300, 300, 300);
    const worldOffset = new Vector3(-150, -150, -150);

    // const nextSeparationGrid = createGrid(
    //   posCellValuePairs,
    //   worldDims,
    //   worldOffset,
    //   separationDist
    // );
    // setSeparationGrid(nextSeparationGrid);

    // const nextAlignmentGrid = createGrid(
    //   posCellValuePairs,
    //   worldDims,
    //   worldOffset,
    //   alignmentDist
    // );
    // setAlignmentGrid(nextAlignmentGrid);

    // const nextCohesionGrid = createGrid(
    //   posCellValuePairs,
    //   worldDims,
    //   worldOffset,
    //   cohesionDist
    // );
    // setCohesionGrid(nextCohesionGrid);
  }, [
    numBirds,
    separationDist,
    alignmentDist,
    cohesionDist,
    worldWidth,
    worldHeight,
    worldDepth,
    posArr.length,
  ]);

  useEffect(() => {
    setVelArr(
      produce((draft) => {
        for (let i = draft.length; i < numBirds; i++) {
          const vel = new Vector3(
            randFloatSpread(2),
            randFloatSpread(2),
            randFloatSpread(2)
          ).setLength(maxSpeed);
          draft.push(vel);
        }
        draft.splice(numBirds);
      })
    );
  }, [numBirds, maxSpeed, velArr.length]);

  useEffect(() => {
    setAccArr(
      produce((draft) => {
        for (let i = draft.length; i < numBirds; i++) {
          const acc = new Vector3();
          draft.push(acc);
        }
        draft.splice(numBirds);
      })
    );
  }, [numBirds, maxForce, accArr.length]);

  useEffect(() => {
    setRotArr(
      produce((draft) => {
        for (let i = draft.length; i < numBirds; i++) {
          const rot = new Vector3(
            randFloat(0, 2 * Math.PI),
            randFloat(0, 2 * Math.PI),
            randFloat(0, 2 * Math.PI)
          );
          draft.push(rot);
        }
        draft.splice(numBirds);
      })
    );
  }, [numBirds, maxForce, rotArr.length]);

  useFrame((state) => {
    const delta = state.clock.getDelta();

    const birdsData: BirdsData = { posArr, velArr, accArr, rotArr };

    const collisionGrids: CollisionGrids = {
      separationGrid,
      alignmentGrid,
      cohesionGrid,
    };

    // for (let index = 0; index < numBirds; index++) {
    //   if (
    //     !posArr[index] ||
    //     !velArr[index] ||
    //     !accArr[index] ||
    //     !rotArr[index] ||
    //     !separationGrid.values.length ||
    //     !alignmentGrid.values.length ||
    //     !cohesionGrid.values.length
    //   )
    //     return;
    // }

    // const nextStates = produce(
    //   {
    //     birdsData,
    //     collisionGrids,
    //   },
    //   (draft) => {
    //     const draftBirdsData = draft.birdsData;
    //     const draftCollisionGrids = draft.collisionGrids;

    //     for (let index = 0; index < numBirds; index++) {
    //       if (
    //         !posArr[index] ||
    //         !velArr[index] ||
    //         !accArr[index] ||
    //         !rotArr[index] ||
    //         !separationGrid.values.length ||
    //         !alignmentGrid.values.length ||
    //         !cohesionGrid.values.length
    //       )
    //         return;

    //       update(
    //         index,
    //         flocksContext,
    //         birdsData,
    //         draftBirdsData,
    //         collisionGrids,
    //         draftCollisionGrids,
    //         delta
    //       );
    //     }
    //   }
    // );

    setPosArr(posArr);
    setVelArr(velArr);
    setAccArr(accArr);
    setRotArr(rotArr);
    setSeparationGrid(separationGrid);
    setAlignmentGrid(alignmentGrid);
    setCohesionGrid(cohesionGrid);
  });

  const instances = useMemo(() => {
    const instances: React.ReactElement[] = [];
    for (let i = 0; i < numBirds; i++) {
      if (!posArr[i] || !rotArr[i]) continue;

      instances.push(
        <Instance
          key={i}
          position={posArr[i].toArray()}
          rotation={rotArr[i].toArray()}
        />
      );
    }
    return instances;
  }, [numBirds, posArr, rotArr]);

  return (
    <Instances>
      {BIRD_GEOMETRY}
      {BIRD_MATERIAL}
      {instances}
    </Instances>
  );
};

export default Flocks;
