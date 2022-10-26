import { PublicApi, useParticle } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
  ConeGeometry,
  Euler,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { FlocksContext } from "../utils/context/FlocksContextProvider";

const BIRD_GEOMETRY = new ConeGeometry(0.25, 1, 16, 1);

const BIRD_MATERIAL = new MeshStandardMaterial({
  color: "white",
  roughness: 0.5,
  metalness: 1,
});

const getFovRequired = (pos: Vector3, vel: Vector3, otherPos: Vector3) => {
  const dir = vel.clone().normalize();

  const diff = otherPos.clone().sub(pos);
  const targetDir = diff.clone().normalize();

  return dir.clone().angleTo(targetDir);
};

type Props = {};

const Flocks = ({}) => {
  const {
    numBirds,
    separationDist,
    alignmentDist,
    cohesionDist,
    birdFov,
    maxSpeed,
    maxForce,
    separationWeight,
    alignmentWeight,
    cohesionWeight,
    worldWidth,
    worldHeight,
    worldDepth,
  } = useContext(FlocksContext);
  const instancedMeshRef = useRef<InstancedMesh>();
  const posArrRef = useRef<Record<number, Vector3>>(
    new Array(numBirds).fill(0).map(() => new Vector3())
  );
  const velArrRef = useRef<Record<number, Vector3>>(
    new Array(numBirds).fill(0).map(() => new Vector3())
  );

  const [physicsRef, physicsApi] = useParticle(
    () => ({
      mass: 1,
      position: [randFloatSpread(40), randFloatSpread(40), randFloatSpread(40)],
      velocity: [
        randFloatSpread(maxSpeed),
        randFloatSpread(maxSpeed),
        randFloatSpread(maxSpeed),
      ],
    }),
    instancedMeshRef as any
  );

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    for (let index = 0; index < numBirds; index++) {
      unsubscribes.push(
        physicsApi.at(index).position.subscribe((pos) => {
          posArrRef.current[index] = new Vector3(pos[0], pos[1], pos[2]);
        })
      );
      unsubscribes.push(
        physicsApi.at(index).velocity.subscribe((vel) => {
          velArrRef.current[index] = new Vector3(vel[0], vel[1], vel[2]);
        })
      );
    }

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [physicsApi, numBirds]);

  const seek = useCallback(
    (index: number, tarPos: Vector3) => {
      const pos = posArrRef.current[index];
      const vel = velArrRef.current[index];

      let tarVel = tarPos.clone().sub(pos);
      tarVel = tarVel.clone().setLength(maxSpeed);

      let steer = tarVel.clone().sub(vel);
      steer = steer.clone().clampLength(0, maxForce);

      return steer;
    },
    [maxSpeed, maxForce]
  );

  const getSeparation = useCallback(
    (index: number): Vector3 => {
      const pos = posArrRef.current[index];
      const vel = velArrRef.current[index];

      let steerSum = new Vector3();
      let count = 0;

      for (let otherIndex = 0; otherIndex < numBirds; otherIndex++) {
        if (index === otherIndex) continue;

        const otherPos = posArrRef.current[otherIndex];
        const diff = pos.clone().sub(otherPos);
        const dist = diff.clone().length();
        const angle = getFovRequired(pos, vel, otherPos);

        if (dist > separationDist || angle > birdFov) continue;

        const diffScl = diff.clone().setLength(1 / dist);
        steerSum.add(diffScl);
        count++;
      }

      let steerAvg = steerSum.clone().divideScalar(count);
      if (steerAvg.length() > 0) {
        const steerScl = steerAvg.clone().setLength(maxSpeed);
        const vel = velArrRef.current[index];
        const velDiff = steerScl.clone().sub(vel);
        return velDiff.clone().clampLength(0, maxForce);
      }
      return new Vector3();
    },
    [numBirds, maxSpeed, maxForce, birdFov, separationDist]
  );

  const getAlignment = useCallback(
    (index: number): Vector3 => {
      const pos = posArrRef.current[index];
      const vel = velArrRef.current[index];

      let velSum = new Vector3();
      let count = 0;
      for (let otherIndex = 0; otherIndex < numBirds; otherIndex++) {
        if (index === otherIndex) continue;

        const otherPos = posArrRef.current[otherIndex];
        const dist = pos.clone().distanceTo(otherPos);
        const angle = getFovRequired(pos, vel, otherPos);

        if (dist > alignmentDist || angle > birdFov) continue;

        const otherVel = velArrRef.current[otherIndex];
        velSum = velSum.clone().add(otherVel);
        count++;
      }

      if (count > 0) {
        const velAvg = velSum.clone().divideScalar(count);
        const velScl = velAvg.clone().setLength(maxSpeed);

        const velDiff = velScl.clone().sub(vel);
        return velDiff.clone().clampLength(0, maxForce);
      }
      return new Vector3();
    },
    [numBirds, maxSpeed, maxForce, birdFov, alignmentDist]
  );

  const getCohesion = useCallback(
    (index: number) => {
      const pos = posArrRef.current[index];
      const vel = velArrRef.current[index];

      let posSum = new Vector3();
      let count = 0;
      for (let otherIndex = 0; otherIndex < numBirds; otherIndex++) {
        if (index === otherIndex) continue;

        const otherPos = posArrRef.current[otherIndex];
        const dist = pos.clone().distanceTo(otherPos);
        const angle = getFovRequired(pos, vel, otherPos);

        if (dist > cohesionDist || angle > birdFov) continue;

        posSum = posSum.clone().add(otherPos);
        count++;
      }
      if (count > 0) {
        const posAvg = posSum.clone().divideScalar(count);
        return seek(index, posAvg);
      }
      return new Vector3();
    },
    [seek, numBirds, birdFov, cohesionDist]
  );

  const flock = useCallback(
    (physicsApi: PublicApi, index: number) => {
      const separation = getSeparation(index);
      const alignment = getAlignment(index);
      const cohesion = getCohesion(index);

      const separationScaled = separation.multiplyScalar(separationWeight);
      const alignmentScaled = alignment.multiplyScalar(alignmentWeight);
      const cohesionScaled = cohesion.multiplyScalar(cohesionWeight);

      physicsApi.at(index).applyForce(separationScaled.toArray(), [0, 0, 0]);
      physicsApi.at(index).applyForce(alignmentScaled.toArray(), [0, 0, 0]);
      physicsApi.at(index).applyForce(cohesionScaled.toArray(), [0, 0, 0]);
    },
    [
      getSeparation,
      getAlignment,
      getCohesion,
      separationWeight,
      alignmentWeight,
      cohesionWeight,
    ]
  );

  const border = useCallback(
    (physicsApi: PublicApi, index: number) => {
      const pos = posArrRef.current[index];

      if (pos.x < -worldWidth / 2)
        physicsApi.at(index).applyForce([100, 0, 0], [0, 0, 0]);
      if (pos.x > worldWidth / 2)
        physicsApi.at(index).applyForce([-100, 0, 0], [0, 0, 0]);

      if (pos.y < -worldHeight / 2)
        physicsApi.at(index).applyForce([0, 100, 0], [0, 0, 0]);
      if (pos.y > worldHeight / 2)
        physicsApi.at(index).applyForce([0, -100, 0], [0, 0, 0]);

      if (pos.z < -worldDepth / 2)
        physicsApi.at(index).applyForce([0, 0, 100], [0, 0, 0]);
      if (pos.z > worldDepth / 2)
        physicsApi.at(index).applyForce([0, 0, -100], [0, 0, 0]);
    },
    [worldWidth, worldHeight, worldDepth]
  );

  const faceForward = (physicsApi: PublicApi, index: number) => {
    const vel = velArrRef.current[index];

    const rotQuarternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      vel.normalize()
    );
    const rotEuler = new Euler().setFromQuaternion(rotQuarternion);

    physicsApi.at(index).rotation.set(rotEuler.x, rotEuler.y, rotEuler.z);
  };

  useFrame((state) => {
    const instancedMesh = instancedMeshRef.current;
    const physicsObject = physicsRef.current;

    if (!instancedMesh || !physicsObject) return;

    for (let index = 0; index < numBirds; index++) {
      flock(physicsApi, index);
      border(physicsApi, index);
      faceForward(physicsApi, index);
    }
  });

  return (
    <instancedMesh
      ref={instancedMeshRef as any}
      args={[BIRD_GEOMETRY, BIRD_MATERIAL, numBirds]}
    ></instancedMesh>
  );
};

export default Flocks;
