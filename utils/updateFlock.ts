import { Vector2, Vector3 } from "three";
import { ArrayGrid, updateArrayGrid, worldPosToAdjValueArr } from "./arrayGrid";
import { FlocksContextType } from "./context/FlocksContextProvider";
import { worldPosToGridPos } from "./grid";
import {
  createValueGrid,
  gridPosToValue,
  setValue,
  ValueGrid,
} from "./valueGrid";

const LOOKUP_GRID_CELL_SIZE = 2;

export type BirdsData = {
  posArr: Vector3[];
  velArr: Vector3[];
};

export type CollisionGrids = {
  separationGrid: ArrayGrid<number>;
  alignmentGrid: ArrayGrid<number>;
  cohesionGrid: ArrayGrid<number>;
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
  steer = steer.clone().setLength(flocksContext.steerForce);

  return steer;
};

const getSeparation = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  collisionGrids: CollisionGrids
): Vector3 => {
  const pos = birdsData.posArr[index];

  let steerSum = new Vector3();
  let count = 0;

  const otherIndices = worldPosToAdjValueArr(
    pos,
    collisionGrids.separationGrid
  );
  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const diff = pos.clone().sub(otherPos);
    const dist = diff.clone().length();

    if (dist > flocksContext.separationDist) return;

    const diffScl = diff.clone().divideScalar(dist);
    steerSum.add(diffScl);
    count++;
  });

  for (let otherIndex = 0; otherIndex < flocksContext.numBirds; otherIndex++) {}

  let steerAvg = steerSum.clone().divideScalar(count);
  if (steerAvg.length() > 0) {
    const steerScl = steerAvg.clone().setLength(flocksContext.maxSpeed);
    const vel = birdsData.velArr[index];
    const velDiff = steerScl.clone().sub(vel);
    return velDiff.clone().setLength(flocksContext.steerForce);
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

  const otherIndices = worldPosToAdjValueArr(pos, collisionGrids.alignmentGrid);

  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const dist = pos.clone().distanceTo(otherPos);

    if (dist > flocksContext.alignmentDist) return;

    const otherVel = birdsData.velArr[otherIndex];
    velSum = velSum.clone().add(otherVel);
    count++;
  });

  if (count > 0) {
    const velAvg = velSum.clone().divideScalar(count);
    const velScl = velAvg.clone().setLength(flocksContext.maxSpeed);

    const velDiff = velScl.clone().sub(vel);
    return velDiff.clone().setLength(flocksContext.steerForce);
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

  let posSum = new Vector3();
  let count = 0;

  const otherIndices = worldPosToAdjValueArr(pos, collisionGrids.cohesionGrid);

  otherIndices.forEach((otherIndex) => {
    if (index === otherIndex) return;

    const otherPos = birdsData.posArr[otherIndex];
    const dist = pos.clone().distanceTo(otherPos);

    if (dist > flocksContext.cohesionDist) return;

    posSum = posSum.clone().add(otherPos);
    count++;
  });
  if (count > 0) {
    const posAvg = posSum.clone().divideScalar(count);
    return seek(index, posAvg, flocksContext, birdsData);
  }
  return new Vector3();
};

const getMousePush = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  mousePos: Vector2
) => {
  const pos = birdsData.posArr[index];
  const diff = pos.clone().sub(new Vector3(mousePos.x, mousePos.y, pos.z));
  const dist = diff.clone().length();
  if (dist > flocksContext.mousePushDist) return new Vector3();
  return diff
    .clone()
    .setLength(flocksContext.mousePushForce)
    .divideScalar(Math.max(1, dist));
};

const flock = (
  index: number,
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  mousePos: Vector2,
  acc: Vector3,
  collisionGrids: CollisionGrids,
  lookupGrid: ValueGrid<Vector3>
) => {
  const pos = birdsData.posArr[index];
  const gridPos = worldPosToGridPos(pos, lookupGrid);
  if (gridPos === null) return;
  const lookupForce = gridPosToValue(gridPos, lookupGrid);
  if (lookupForce) {
    acc.add(lookupForce);
    return;
  }

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
  const avoidMouse = getMousePush(index, flocksContext, birdsData, mousePos);

  const separationScaled = separation.multiplyScalar(
    flocksContext.separationWeight
  );
  const alignmentScaled = alignment.multiplyScalar(
    flocksContext.alignmentWeight
  );
  const cohesionScaled = cohesion.multiplyScalar(flocksContext.cohesionWeight);

  const force = new Vector3()
    .add(separationScaled)
    .add(alignmentScaled)
    .add(cohesionScaled)
    .add(avoidMouse);

  acc.add(force);

  setValue(gridPos, force, lookupGrid);
};

const softBorder = (
  index: number,
  flocksContext: FlocksContextType,
  draftBirdsData: BirdsData,
  acc: Vector3
) => {
  const pos = draftBirdsData.posArr[index];

  if (pos.x < -flocksContext.worldWidth / 2 + flocksContext.borderPushDist) {
    const dist = Math.max(0.1, pos.x + flocksContext.worldWidth / 2);
    acc.add(
      new Vector3().setX(flocksContext.borderPushForce).divideScalar(dist)
    );
  }
  if (pos.x > flocksContext.worldWidth / 2 - flocksContext.borderPushDist) {
    const dist = Math.max(0.1, flocksContext.worldWidth / 2 - pos.x);
    acc.add(
      new Vector3().setX(-flocksContext.borderPushForce).divideScalar(dist)
    );
  }

  if (pos.y < -flocksContext.worldHeight / 2 + flocksContext.borderPushDist) {
    const dist = Math.max(0.1, pos.y + flocksContext.worldHeight / 2);
    acc.add(
      new Vector3().setY(flocksContext.borderPushForce).divideScalar(dist)
    );
  }
  if (pos.y > flocksContext.worldHeight / 2 - flocksContext.borderPushDist) {
    const dist = Math.max(0.1, flocksContext.worldHeight / 2 - pos.y);
    acc.add(
      new Vector3().setY(-flocksContext.borderPushForce).divideScalar(dist)
    );
  }

  if (pos.z < -flocksContext.worldDepth / 2 + flocksContext.borderPushDist) {
    const dist = Math.max(0.1, pos.z + flocksContext.worldDepth / 2);
    acc.add(
      new Vector3().setZ(flocksContext.borderPushForce).divideScalar(dist)
    );
  }
  if (pos.z > flocksContext.worldDepth / 2 - flocksContext.borderPushDist) {
    const dist = Math.max(0.1, flocksContext.worldDepth / 2 - pos.z);
    acc.add(
      new Vector3().setZ(-flocksContext.borderPushForce).divideScalar(dist)
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
  flocksContext: FlocksContextType,
  draftBirdsData: BirdsData,
  acc: Vector3,
  delta: number
) => {
  const pos = draftBirdsData.posArr[index];
  const vel = draftBirdsData.velArr[index];

  const finalVel = vel
    .clone()
    .clampLength(0, flocksContext.maxSpeed)
    .addScaledVector(acc, delta);
  const finalPos = pos.clone().addScaledVector(finalVel, delta);

  draftBirdsData.velArr[index].copy(finalVel);
  draftBirdsData.posArr[index].copy(finalPos);
  acc.set(0, 0, 0);
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

  updateArrayGrid(
    pos,
    nextPos,
    index,
    collisionGrids.separationGrid,
    draftCollisionsGrids.separationGrid
  );
  updateArrayGrid(
    pos,
    nextPos,
    index,
    collisionGrids.alignmentGrid,
    draftCollisionsGrids.alignmentGrid
  );
  updateArrayGrid(
    pos,
    nextPos,
    index,
    collisionGrids.cohesionGrid,
    draftCollisionsGrids.cohesionGrid
  );
};

export const update = (
  flocksContext: FlocksContextType,
  birdsData: BirdsData,
  draftBirdsData: BirdsData,
  collisionGrids: CollisionGrids,
  draftCollisionGrids: CollisionGrids,
  delta: number,
  mousePos: Vector2
) => {
  const lookupWorldDims = new Vector3(200, 200, 200);
  const lookupWorldOffset = new Vector3(-100, -100, -100);
  const lookupGrid = createValueGrid<Vector3>(
    [],
    lookupWorldDims,
    lookupWorldOffset,
    LOOKUP_GRID_CELL_SIZE
  );

  for (let index = 0; index < flocksContext.numBirds; index++) {
    if (!birdsData.posArr[index] || !birdsData.velArr[index]) continue;

    const acc = new Vector3();

    flock(
      index,
      flocksContext,
      birdsData,
      mousePos,
      acc,
      collisionGrids,
      lookupGrid
    );
    softBorder(index, flocksContext, draftBirdsData, acc);
    hardBorder(index, flocksContext, draftBirdsData);
    applyPhysics(index, flocksContext, draftBirdsData, acc, delta);
    updateGrids(
      index,
      birdsData,
      draftBirdsData,
      collisionGrids,
      draftCollisionGrids
    );
  }
};
