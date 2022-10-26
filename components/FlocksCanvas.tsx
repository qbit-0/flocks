import { Physics } from "@react-three/cannon";
import {
  Environment,
  PerspectiveCamera,
  Plane,
  ScreenQuad,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useContext } from "react";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import Flocks from "./Flocks";

const TILE_SIZE = 0.5;

type Props = {};

const FlocksCanvas = (props: Props) => {
  const { worldWidth, worldHeight, worldDepth } = useContext(FlocksContext);

  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, worldDepth / 2 + 40]}
        fov={60}
      />
      <directionalLight position={[-100, 100, 100]} />
      <Environment preset="warehouse" />
      <ScreenQuad position={[0, 0, -100]} scale={1000}>
        <meshBasicMaterial color="brown" />
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
        <meshBasicMaterial color="black" wireframe />
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
        <meshBasicMaterial color="black" wireframe />
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
        <meshBasicMaterial color="black" wireframe />
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
        <meshBasicMaterial color="black" wireframe />
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
        <meshBasicMaterial color="black" wireframe />
      </Plane>
      <Physics gravity={[0, 0, 0]}>
        <Flocks />
      </Physics>
    </Canvas>
  );
};

export default FlocksCanvas;
