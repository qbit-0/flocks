import { useTheme } from "@mui/material";
import { Instance, Instances } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import produce from "immer";
import React, { useContext, useEffect, useState } from "react";
import { Euler, Quaternion, Vector2, Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";
import { ArrayGrid, createArrayGrid } from "../utils/arrayGrid";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import { BirdsData, CollisionGrids, update } from "../utils/updateFlock";

const BIRD_GEOMETRY = <coneGeometry args={[0.25, 0.5, 5, 1, false]} />;
const BIRD_MATERIAL = <meshStandardMaterial roughness={1} metalness={0} />;

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
  const theme = useTheme();

  const flocksContext = useContext(FlocksContext);
  const {
    numBirds,
    maxSpeed,
    separationDist,
    alignmentDist,
    cohesionDist,
    worldWidth,
    worldHeight,
    worldDepth,
  } = flocksContext;

  const [posArr, setPosArr] = useState<Vector3[]>();
  const [velArr, setVelArr] = useState<Vector3[]>();

  const [separationGrid, setSeparationGrid] = useState<ArrayGrid<number>>();
  const [alignmentGrid, setAlignmentGrid] = useState<ArrayGrid<number>>();
  const [cohesionGrid, setCohesionGrid] = useState<ArrayGrid<number>>();

  const [instances, setInstances] = useState<React.ReactElement[]>();

  const worldDims = new Vector3(200, 200, 200);
  const worldOffset = new Vector3(-100, -100, -100);

  useEffect(() => {
    const nextPosArr: Vector3[] = [];
    const posCellValuePairs: [Vector3, number][] = [];
    for (let i = 0; i < numBirds; i++) {
      const pos = new Vector3(
        randFloatSpread(worldWidth),
        randFloatSpread(worldHeight),
        randFloatSpread(worldDepth)
      );
      nextPosArr.push(pos);
      posCellValuePairs.push([pos, i]);
    }
    setPosArr(nextPosArr);

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
  }, [numBirds]);

  useEffect(() => {
    if (posArr === undefined) return;

    const posCellValuePairs: [Vector3, number][] = [];
    for (let i = 0; i < numBirds; i++) {
      const pos = posArr[i];
      posCellValuePairs.push([pos, i]);
    }

    const nextSeparationGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      separationDist
    );
    setSeparationGrid(nextSeparationGrid);
  }, [separationDist]);

  useEffect(() => {
    if (posArr === undefined) return;

    const posCellValuePairs: [Vector3, number][] = [];
    for (let i = 0; i < numBirds; i++) {
      const pos = posArr[i];
      posCellValuePairs.push([pos, i]);
    }

    const nextAlignmentGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      alignmentDist
    );
    setAlignmentGrid(nextAlignmentGrid);
  }, [alignmentDist]);

  useEffect(() => {
    if (posArr === undefined) return;

    const posCellValuePairs: [Vector3, number][] = [];
    for (let i = 0; i < numBirds; i++) {
      const pos = posArr[i];
      posCellValuePairs.push([pos, i]);
    }

    const nextCohesionGrid = createArrayGrid(
      posCellValuePairs,
      worldDims,
      worldOffset,
      cohesionDist
    );
    setCohesionGrid(nextCohesionGrid);
  }, [cohesionDist]);

  useEffect(() => {
    const nextVelArr: Vector3[] = [];
    for (let i = 0; i < numBirds; i++) {
      const vel = new Vector3(
        randFloatSpread(2),
        randFloatSpread(2),
        randFloatSpread(2)
      ).setLength(maxSpeed);
      nextVelArr.push(vel);
    }
    nextVelArr.splice(numBirds);
    setVelArr(nextVelArr);
  }, [numBirds]);

  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    if (
      !posArr ||
      !velArr ||
      !separationGrid ||
      !alignmentGrid ||
      !cohesionGrid
    )
      return;

    const delta = state.clock.getDelta();
    const mousePos = new Vector2(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2
    );

    const birdsData: BirdsData = { posArr, velArr };

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

        update(
          flocksContext,
          birdsData,
          draftBirdsData,
          collisionGrids,
          draftCollisionGrids,
          delta,
          mousePos
        );
      }
    );

    setPosArr(nextStates.birdsData.posArr);
    setVelArr(nextStates.birdsData.velArr);
    setSeparationGrid(nextStates.collisionGrids.separationGrid);
    setAlignmentGrid(nextStates.collisionGrids.alignmentGrid);
    setCohesionGrid(nextStates.collisionGrids.cohesionGrid);

    const instances: React.ReactElement[] = [];
    for (let i = 0; i < numBirds; i++) {
      const nextPos = nextStates.birdsData.posArr[i];
      const nextVel = nextStates.birdsData.velArr[i];
      if (!nextPos || !nextVel) continue;
      const rot = getRotFromVel(nextVel);

      instances.push(
        <Instance
          key={i}
          position={nextStates.birdsData.posArr[i].toArray()}
          rotation={rot.toArray()}
          color={theme.palette.bird[i % theme.palette.bird.length]}
        />
      );
    }
    setInstances(instances);
  });

  return (
    <Instances limit={10000}>
      {BIRD_GEOMETRY}
      {BIRD_MATERIAL}
      {instances}
    </Instances>
  );
};

export default Flocks;
