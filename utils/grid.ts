import { Vector3 } from "three";

export type Grid = {
  worldDims: Vector3;
  worldOffset: Vector3;
  gridDims: Vector3;
};

export const hashPos = (pos: Vector3) => {
  return `${pos.x},${pos.y},${pos.z}`;
};

export const getGridDims = (worldDims: Vector3, cellSize: number) => {
  const gridWidth = Math.ceil(worldDims.x / cellSize);
  const gridHeight = Math.ceil(worldDims.y / cellSize);
  const gridDepth = Math.ceil(worldDims.z / cellSize);
  return new Vector3(gridWidth, gridHeight, gridDepth);
};

export const worldPosToGridPos = (pos: Vector3, grid: Grid) => {
  const offsetPos = pos.clone().sub(grid.worldOffset);

  const gridX = Math.floor((offsetPos.x / grid.worldDims.x) * grid.gridDims.x);
  const gridY = Math.floor((offsetPos.y / grid.worldDims.y) * grid.gridDims.y);
  const gridZ = Math.floor((offsetPos.z / grid.worldDims.z) * grid.gridDims.z);
  if (
    gridX < 0 ||
    gridX >= grid.gridDims.x ||
    gridY < 0 ||
    gridY >= grid.gridDims.y ||
    gridZ < 0 ||
    gridZ >= grid.gridDims.z
  )
    return null;
  return new Vector3(gridX, gridY, gridZ);
};
