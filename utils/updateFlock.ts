import { Euler, Quaternion, Vector3 } from "three";
import {
  CollisionGrid,
  updateGrid,
  worldPosToAdjCellValues,
} from "./collisionGrid";
import { FlocksContextType } from "./context/FlocksContextProvider";

export const BORDER_THICKNESS = 10;
export const BORDER_FORCE = 100000;

export type BirdsData = {
  posArr: Vector3[];
  velArr: Vector3[];
  accArr: Vector3[];
  rotArr: Vector3[];
};

export type CollisionGrids = {
  separationGrid: CollisionGrid;
  alignmentGrid: CollisionGrid;
  cohesionGrid: CollisionGrid;
};

const getFovRequired = (pos: Vector3, vel: Vector3, otherPos: Vector3) => {
  const dir = vel.clone().normalize();

  const diff = otherPos.clone().sub(pos);
  const targetDir = diff.clone().normalize();

  return dir.clone().angleTo(targetDir);
};

const seek = (
  index: number,
  tarPos: Vector3,
  flocksContext: FlocksContextType,
  birdsData: BirdsData
) => {
  const pos = birdsData.posArr[index];
  const vel = birdsData.velArr[index];

  let tarVel = tarPos.clone().sub(pos);
  tarVel = tarVel.clone().setLength(flocksContext.maxSpeed);

  let steer = tarVel.clone().sub(vel);
  steer = steer.clone().setLength(flocksContext.maxForce);

  return steer;
};

const getSeparation = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  collisionGrids: CollisionGrids
): Vector3 => {
  const pos = birdsData.posArr[index];
  const vel = birdsData.velArr[index];

  let steerSum = new Vector3();
  let count = 0;

  const otherIndices = worldPosToAdjCellValues(
    pos,
    collisionGrids.separationGrid
  );
  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const diff = pos.clone().sub(otherPos);
    const dist = diff.clone().length();
    const angle = getFovRequired(pos, vel, otherPos);

    if (dist > flocksContext.separationDist || angle > flocksContext.birdFov)
      return;

    const diffScl = diff.clone().divideScalar(dist * dist);
    steerSum.add(diffScl);
    count++;
  });

  for (let otherIndex = 0; otherIndex < flocksContext.numBirds; otherIndex++) {}

  let steerAvg = steerSum.clone().divideScalar(count);
  if (steerAvg.length() > 0) {
    const steerScl = steerAvg.clone().setLength(flocksContext.maxSpeed);
    const vel = birdsData.velArr[index];
    const velDiff = steerScl.clone().sub(vel);
    return velDiff.clone().setLength(flocksContext.maxForce);
  }
  return new Vector3();
};

const getAlignment = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  collisionGrids: CollisionGrids
): Vector3 => {
  const pos = birdsData.posArr[index];
  const vel = birdsData.velArr[index];

  let velSum = new Vector3();
  let count = 0;

  const otherIndices = worldPosToAdjCellValues(
    pos,
    collisionGrids.alignmentGrid
  );

  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const dist = pos.clone().distanceTo(otherPos);
    const angle = getFovRequired(pos, vel, otherPos);

    if (dist > flocksContext.alignmentDist || angle > flocksContext.birdFov)
      return;

    const otherVel = birdsData.velArr[otherIndex];
    velSum = velSum.clone().add(otherVel);
    count++;
  });

  if (count > 0) {
    const velAvg = velSum.clone().divideScalar(count);
    const velScl = velAvg.clone().setLength(flocksContext.maxSpeed);

    const velDiff = velScl.clone().sub(vel);
    return velDiff.clone().setLength(flocksContext.maxForce);
  }
  return new Vector3();
};

const getCohesion = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  collisionGrids: CollisionGrids
) => {
  const pos = birdsData.posArr[index];
  const vel = birdsData.velArr[index];

  let posSum = new Vector3();
  let count = 0;

  const otherIndices = worldPosToAdjCellValues(
    pos,
    collisionGrids.cohesionGrid
  );

  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const dist = pos.clone().distanceTo(otherPos);
    const angle = getFovRequired(pos, vel, otherPos);

    if (dist > flocksContext.cohesionDist || angle > flocksContext.birdFov)
      return;

    posSum = posSum.clone().add(otherPos);
    count++;
  });
  if (count > 0) {
    const posAvg = posSum.clone().divideScalar(count);
    return seek(index, posAvg, flocksContext, birdsData);
  }
  return new Vector3();
};

const flock = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  draftBirdsData: BirdsData,
  collisionGrids: CollisionGrids
) => {
  const separation = getSeparation(
    index,
    flocksContext,
    birdsData,
    collisionGrids
  );
  const alignment = getAlignment(
    index,
    flocksContext,
    birdsData,
    collisionGrids
  );
  const cohesion = getCohesion(index, flocksContext, birdsData, collisionGrids);

  const separationScaled = separation.multiplyScalar(
    flocksContext.separationWeight
  );
  const alignmentScaled = alignment.multiplyScalar(
    flocksContext.alignmentWeight
  );
  const cohesionScaled = cohesion.multiplyScalar(flocksContext.cohesionWeight);

  draftBirdsData.accArr[index].add(separationScaled);
  draftBirdsData.accArr[index].add(alignmentScaled);
  draftBirdsData.accArr[index].add(cohesionScaled);
};

const softBorder = (
  index: number,
  flocksContext: FlocksContextType,
  draftBirdsData: BirdsData
) => {
  const pos = draftBirdsData.posArr[index];

  if (pos.x < -flocksContext.worldWidth / 2 + BORDER_THICKNESS) {
    const dist = Math.max(1, -flocksContext.worldWidth / 2 - pos.x);
    draftBirdsData.accArr[index].add(
      new Vector3().setX(BORDER_FORCE).divideScalar(dist)
    );
  }
  if (pos.x > flocksContext.worldWidth / 2 - BORDER_THICKNESS) {
    const dist = Math.max(1, flocksContext.worldWidth / 2 - pos.x);
    draftBirdsData.accArr[index].add(
      new Vector3().setX(-BORDER_FORCE).divideScalar(dist)
    );
  }

  if (pos.y < -flocksContext.worldHeight / 2 + BORDER_THICKNESS) {
    const dist = Math.max(1, -flocksContext.worldHeight / 2 - pos.y);
    draftBirdsData.accArr[index].add(
      new Vector3().setY(BORDER_FORCE).divideScalar(dist)
    );
  }
  if (pos.y > flocksContext.worldHeight / 2 - BORDER_THICKNESS) {
    const dist = Math.max(1, flocksContext.worldHeight / 2 - pos.y);
    draftBirdsData.accArr[index].add(
      new Vector3().setY(-BORDER_FORCE).divideScalar(dist)
    );
  }

  if (pos.z < -flocksContext.worldDepth / 2 + BORDER_THICKNESS) {
    const dist = Math.max(1, -flocksContext.worldDepth / 2 - pos.z);
    draftBirdsData.accArr[index].add(
      new Vector3().setZ(BORDER_FORCE).divideScalar(dist)
    );
  }
  if (pos.z > flocksContext.worldDepth / 2 - BORDER_THICKNESS) {
    const dist = Math.max(1, flocksContext.worldDepth / 2 - pos.z);
    draftBirdsData.accArr[index].add(
      new Vector3().setZ(-BORDER_FORCE).divideScalar(dist)
    );
  }
};

const hardBorder = (
  index: number,
  flocksContext: FlocksContextType,
  draftBirdsData: BirdsData
) => {
  const pos = draftBirdsData.posArr[index];
  const vel = draftBirdsData.velArr[index];

  if (pos.x < -flocksContext.worldWidth / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setX(-flocksContext.worldWidth / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setX(0));
  }
  if (pos.x > flocksContext.worldWidth / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setX(flocksContext.worldWidth / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setX(0));
  }

  if (pos.y < -flocksContext.worldHeight / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setY(-flocksContext.worldHeight / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setY(0));
  }
  if (pos.y > flocksContext.worldHeight / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setY(flocksContext.worldHeight / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setY(0));
  }

  if (pos.z < -flocksContext.worldDepth / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setZ(-flocksContext.worldDepth / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setZ(0));
  }
  if (pos.z > flocksContext.worldDepth / 2) {
    draftBirdsData.posArr[index].copy(
      pos.clone().setZ(flocksContext.worldDepth / 2)
    );
    draftBirdsData.velArr[index].copy(vel.clone().setZ(0));
  }
};

const applyPhysics = (
  index: number,
  draftBirdsData: BirdsData,
  delta: number
) => {
  const pos = draftBirdsData.posArr[index];
  const vel = draftBirdsData.velArr[index];
  const acc = draftBirdsData.accArr[index];

  const finalVel = vel.clone().addScaledVector(acc, delta);
  const finalPos = pos.clone().addScaledVector(finalVel, delta);

  draftBirdsData.velArr[index].copy(finalVel);
  draftBirdsData.posArr[index].copy(finalPos);
  draftBirdsData.accArr[index].set(0, 0, 0);
};

const updateGrids = (
  index: number,
  birdsData: BirdsData,
  draftBirdsData: BirdsData,
  collisionGrids: CollisionGrids,
  draftCollisionsGrids: CollisionGrids
) => {
  const pos = birdsData.posArr[index];
  const nextPos = draftBirdsData.posArr[index];

  updateGrid(
    pos,
    nextPos,
    index,
    collisionGrids.separationGrid,
    draftCollisionsGrids.separationGrid
  );
  updateGrid(
    pos,
    nextPos,
    index,
    collisionGrids.alignmentGrid,
    draftCollisionsGrids.alignmentGrid
  );
  updateGrid(
    pos,
    nextPos,
    index,
    collisionGrids.cohesionGrid,
    draftCollisionsGrids.cohesionGrid
  );
};

const faceForward = (index: number, draftBirdsData: BirdsData) => {
  const vel = draftBirdsData.velArr[index];

  const rotQuarternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    vel.clone().normalize()
  );
  const finalRot = new Euler().setFromQuaternion(rotQuarternion);
  draftBirdsData.rotArr[index].set(finalRot.x, finalRot.y, finalRot.z);
};

export const update = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  draftBirdsData: BirdsData,
  collisionGrids: CollisionGrids,
  draftCollisionGrids: CollisionGrids,
  delta: number
) => {
  flock(index, flocksContext, birdsData, draftBirdsData, collisionGrids);
  softBorder(index, flocksContext, draftBirdsData);
  hardBorder(index, flocksContext, draftBirdsData);
  applyPhysics(index, draftBirdsData, delta);
  faceForward(index, draftBirdsData);
  updateGrids(
    index,
    birdsData,
    draftBirdsData,
    collisionGrids,
    draftCollisionGrids
  );
};
