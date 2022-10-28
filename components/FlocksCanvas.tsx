import { useTheme } from "@mui/material";
import {
  Environment,
  Loader,
  PerspectiveCamera,
  Plane,
  ScreenQuad,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useContext } from "react";
import { Fog } from "three";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import Flocks from "./Flocks";

const TILE_SIZE = 1;

type Props = {};

const FlocksCanvas = (props: Props) => {
  const theme = useTheme();
  const { worldWidth, worldHeight, worldDepth } = useContext(FlocksContext);

  return (
    <>
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, worldDepth / 2 + 40]}
          fov={60}
        />
        <fog
          attach="fog"
          args={[
            theme.palette.canvasBg.main,
            Math.max(50, worldDepth / 2),
            Math.max(100, worldDepth * 2),
          ]}
        />
        <ambientLight intensity={0.5} />
        <pointLight
          position={[
            -worldDepth / 2 + 5,
            worldHeight / 2 - 5,
            worldDepth / 2 - 5,
          ]}
          intensity={1}
        />
        <Environment preset="city" />
        <ScreenQuad position={[0, 0, -100]} scale={1000}>
          <meshBasicMaterial color={theme.palette.canvasBg.main} />
        </ScreenQuad>
        <Plane
          args={[
            worldDepth,
            worldHeight,
            worldDepth / TILE_SIZE,
            worldHeight / TILE_SIZE,
          ]}
          position={[-worldWidth / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <meshStandardMaterial
            roughness={1}
            metalness={0}
            color={theme.palette.box.main}
          />
        </Plane>
        <Plane
          args={[
            worldDepth,
            worldHeight,
            worldDepth / TILE_SIZE,
            worldHeight / TILE_SIZE,
          ]}
          position={[worldWidth / 2, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <meshStandardMaterial
            roughness={1}
            metalness={0}
            color={theme.palette.box.main}
          />
        </Plane>
        <Plane
          args={[
            worldWidth,
            worldDepth,
            worldWidth / TILE_SIZE,
            worldDepth / TILE_SIZE,
          ]}
          position={[0, worldHeight / 2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            roughness={1}
            metalness={0}
            color={theme.palette.box.main}
          />
        </Plane>
        <Plane
          args={[
            worldWidth,
            worldDepth,
            worldWidth / TILE_SIZE,
            worldDepth / TILE_SIZE,
          ]}
          position={[0, -worldHeight / 2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            roughness={1}
            metalness={0}
            color={theme.palette.box.main}
          />
        </Plane>
        <Plane
          args={[
            worldWidth,
            worldHeight,
            worldWidth / TILE_SIZE,
            worldHeight / TILE_SIZE,
          ]}
          position={[0, 0, -worldDepth / 2]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial
            roughness={1}
            metalness={0}
            color={theme.palette.box.main}
          />
        </Plane>
        <Suspense fallback={null}>
          <Flocks />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default FlocksCanvas;
