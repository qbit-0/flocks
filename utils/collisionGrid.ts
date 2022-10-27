import { Vector3 } from "three";

export type CollisionGrid = {
  worldDims: Vector3;
  worldOffset: Vector3;
  gridDims: Vector3;
  values: number[][];
};

// CONVERSION FUNCTIONS

export const worldPosToGridPos = (
  pos: Vector3,
  worldDims: Vector3,
  worldOffset: Vector3,
  gridDims: Vector3
) => {
  const offsetPos = pos.clone().sub(worldOffset);

  const gridX = Math.floor((offsetPos.x / worldDims.x) * gridDims.x);
  const gridY = Math.floor((offsetPos.y / worldDims.y) * gridDims.y);
  const gridZ = Math.floor((offsetPos.z / worldDims.z) * gridDims.z);
  if (
    gridX < 0 ||
    gridX >= gridDims.x ||
    gridY < 0 ||
    gridY >= gridDims.y ||
    gridZ < 0 ||
    gridZ >= gridDims.z
  )
    return null;
  return new Vector3(gridX, gridY, gridZ);
};

export const gridPosToGridIndex = (gridPos: Vector3, gridDims: Vector3) =>
  gridPos.z * gridDims.x * gridDims.y + gridPos.y * gridDims.x + gridPos.x;

export const worldPosToGridIndex = (
  pos: Vector3,
  worldDims: Vector3,
  worldOffset: Vector3,
  gridDims: Vector3
) => {
  const gridPos = worldPosToGridPos(pos, worldDims, worldOffset, gridDims);
  if (gridPos === null) return null;
  return gridPosToGridIndex(gridPos, gridDims);
};

export const gridIndexToGridPos = (gridIndex: number, gridDims: Vector3) => {
  const gridX = (gridIndex % gridDims.z) % gridDims.y;
  const gridY = (gridIndex % gridDims.z) / gridDims.y;
  const gridZ = gridIndex / gridDims.z;
  return new Vector3(gridX, gridY, gridZ);
};

export const worldPosToAdjValues = (pos: Vector3, grid: CollisionGrid) => {
  const gridPos = worldPosToGridPos(
    pos,
    grid.worldDims,
    grid.worldOffset,
    grid.gridDims
  );

  if (gridPos === null) return [];

  const adjGridPosArr: Vector3[] = [];
  for (let offsetX = -1; offsetX <= 1; offsetX++) {
    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      for (let offsetZ = -1; offsetZ <= 1; offsetZ++) {
        const adjPos = gridPos
          .clone()
          .add(new Vector3(offsetX, offsetY, offsetZ));
        if (
          adjPos.x < 0 ||
          adjPos.x >= grid.gridDims.x ||
          adjPos.y < 0 ||
          adjPos.y >= grid.gridDims.y ||
          adjPos.z < 0 ||
          adjPos.z >= grid.gridDims.z
        )
          continue;
        adjGridPosArr.push(adjPos);
      }
    }
  }

  const adjGridIndices = adjGridPosArr.map((adjPos) =>
    gridPosToGridIndex(adjPos, grid.gridDims)
  );

  return adjGridIndices.reduce((partialNeighborValues, adjGridIndex) => {
    return [...partialNeighborValues, ...grid.values[adjGridIndex]];
  }, [] as number[]);
};

export const getGridDims = (worldDims: Vector3, cellSize: number) => {
  const gridWidth = Math.ceil(worldDims.x / cellSize);
  const gridHeight = Math.ceil(worldDims.y / cellSize);
  const gridDepth = Math.ceil(worldDims.z / cellSize);
  return new Vector3(gridWidth, gridHeight, gridDepth);
};

export const createGrid = (
  posCellValuePairs: [Vector3, number][],
  worldDims: Vector3,
  worldOffset: Vector3,
  cellSize: number
): CollisionGrid => {
  const gridDims = getGridDims(worldDims, cellSize);
  const values: number[][] = [];

  for (
    let gridIndex = 0;
    gridIndex < gridDims.x * gridDims.y * gridDims.z;
    gridIndex++
  ) {
    values.push([]);
  }

  posCellValuePairs.forEach(([pos, cellValue]) => {
    const gridIndex = worldPosToGridIndex(
      pos,
      worldDims,
      worldOffset,
      gridDims
    );
    if (gridIndex === null) return;
    values[gridIndex].push(cellValue);
  });

  return {
    worldDims,
    worldOffset,
    gridDims,
    values,
  };
};

export const updateGrid = (
  pos: Vector3,
  nextPos: Vector3,
  value: number,
  grid: CollisionGrid
) => {
  const gridIndex = worldPosToGridIndex(
    pos,
    grid.gridDims,
    grid.worldOffset,
    grid.gridDims
  );
  if (gridIndex === null) return;

  const nextGridIndex = worldPosToGridIndex(
    nextPos,
    grid.gridDims,
    grid.worldOffset,
    grid.gridDims
  );
  if (nextGridIndex === null) return;

  if (gridIndex !== nextGridIndex) {
    grid.values[gridIndex] = grid.values[gridIndex].filter(
      (gridValue) => gridValue === value
    );
    grid.values[nextGridIndex].push(value);
  }
};
