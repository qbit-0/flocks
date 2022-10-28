import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import produce from "immer";
import { useContext, useEffect, useMemo, useState } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";
import { ArrayGrid, createArrayGrid } from "../utils/arrayGrid";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import {
  BirdsData,
  BORDER_THICKNESS,
  CollisionGrids,
  update,
} from "../utils/updateFlock";

const BIRD_GEOMETRY = <coneGeometry args={[0.25, 0.5, 16, 1]} />;
const BIRD_MATERIAL = (
  <meshStandardMaterial color="white" roughness={0.5} metalness={0.5} />
);

const getRotFromVel = (vel: Vector3) => {
  const rotQuarternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    vel.clone().normalize()
  );
  const rotEuler = new Euler().setFromQuaternion(rotQuarternion);
  return new Vector3(rotEuler.x, rotEuler.y, rotEuler.z);
};

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

  const [posArr, setPosArr] = useState<Vector3[]>();
  const [velArr, setVelArr] = useState<Vector3[]>();
  const [accArr, setAccArr] = useState<Vector3[]>();

  const [separationGrid, setSeparationGrid] = useState<ArrayGrid<number>>();
  const [alignmentGrid, setAlignmentGrid] = useState<ArrayGrid<number>>();
  const [cohesionGrid, setCohesionGrid] = useState<ArrayGrid<number>>();

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

    const nextSeparationGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      separationDist
    );
    setSeparationGrid(nextSeparationGrid);

    const nextAlignmentGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      alignmentDist
    );
    setAlignmentGrid(nextAlignmentGrid);

    const nextCohesionGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      cohesionDist
    );
    setCohesionGrid(nextCohesionGrid);
  }, [
    numBirds,
    separationDist,
    alignmentDist,
    cohesionDist,
    worldWidth,
    worldHeight,
    worldDepth,
  ]);

  useEffect(() => {
    const nextVelArr: Vector3[] = [];
    for (let i = nextVelArr.length; i < numBirds; i++) {
      const vel = new Vector3(
        randFloatSpread(2),
        randFloatSpread(2),
        randFloatSpread(2)
      ).setLength(maxSpeed);
      nextVelArr.push(vel);
    }
    nextVelArr.splice(numBirds);
    setVelArr(nextVelArr);
  }, [numBirds, maxSpeed]);

  useEffect(() => {
    const nextAccArr: Vector3[] = [];
    for (let i = nextAccArr.length; i < numBirds; i++) {
      const acc = new Vector3();
      nextAccArr.push(acc);
    }
    nextAccArr.splice(numBirds);
    setAccArr(nextAccArr);
  }, [numBirds, maxForce]);

  useFrame((state) => {
    if (
      !posArr ||
      !velArr ||
      !accArr ||
      !separationGrid ||
      !alignmentGrid ||
      !cohesionGrid
    )
      return;

    const delta = state.clock.getDelta();

    const birdsData: BirdsData = { posArr, velArr, accArr };

    const collisionGrids: CollisionGrids = {
      separationGrid,
      alignmentGrid,
      cohesionGrid,
    };

    const nextStates = produce(
      {
        birdsData,
        collisionGrids,
      },
      (draft) => {
        const draftBirdsData = draft.birdsData;
        const draftCollisionGrids = draft.collisionGrids;

        draftBirdsData.posArr = birdsData.posArr.map((pos) => pos.clone());
        draftBirdsData.velArr = birdsData.velArr.map((vel) => vel.clone());
        draftBirdsData.accArr = birdsData.accArr.map(() => new Vector3());

        update(
          flocksContext,
          birdsData,
          draftBirdsData,
          collisionGrids,
          draftCollisionGrids,
          delta
        );
      }
    );

    setPosArr(nextStates.birdsData.posArr);
    setVelArr(nextStates.birdsData.velArr);
    setAccArr(nextStates.birdsData.accArr);
    setSeparationGrid(nextStates.collisionGrids.separationGrid);
    setAlignmentGrid(nextStates.collisionGrids.alignmentGrid);
    setCohesionGrid(nextStates.collisionGrids.cohesionGrid);
  });

  const instances = useMemo(() => {
    const instances: React.ReactElement[] = [];
    if (!posArr || !velArr) return null;

    for (let i = 0; i < numBirds; i++) {
      if (!posArr[i] || !velArr[i]) continue;
      const rot = getRotFromVel(velArr[i]);

      instances.push(
        <Instance
          key={i}
          position={posArr[i].toArray()}
          rotation={rot.toArray()}
        />
      );
    }
    return instances;
  }, [numBirds, posArr]);

  return (
    <Instances limit={10000}>
      {BIRD_GEOMETRY}
      {BIRD_MATERIAL}
      {instances}
    </Instances>
  );
};

export default Flocks;
