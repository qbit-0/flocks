import { Vector3 } from "three";

export const hashPos = (pos: Vector3) => {
  return `${pos.x},${pos.y},${pos.z}`;
};

export type CollisionGrid = {
  worldDims: Vector3;
  worldOffset: Vector3;
  gridDims: Vector3;
  gridPosCellValuesMap: Map<ReturnType<typeof hashPos>, Set<number>>;
};

export const worldPosToGridPos = (pos: Vector3, grid: CollisionGrid) => {
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

export const worldPosToAdjCellValues = (pos: Vector3, grid: CollisionGrid) => {
  const gridPos = worldPosToGridPos(pos, grid);

  if (gridPos === null) return new Set<number>();

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

  return adjGridPosArr.reduce((partialAdjCellValues, adjGridPos) => {
    const adjGridCellValues = grid.gridPosCellValuesMap.get(
      hashPos(adjGridPos)
    );
    if (adjGridCellValues === undefined) return partialAdjCellValues;
    return new Set([...partialAdjCellValues, ...adjGridCellValues]);
  }, new Set<number>());
};

const addCellValue = (
  gridPos: Vector3,
  cellValue: number,
  grid: CollisionGrid
) => {
  let currCellValues = grid.gridPosCellValuesMap.get(hashPos(gridPos));
  if (currCellValues === undefined)
    grid.gridPosCellValuesMap.set(hashPos(gridPos), new Set<number>());
  else
    grid.gridPosCellValuesMap.set(
      hashPos(gridPos),
      new Set([...currCellValues, cellValue])
    );
};

const removeCellValue = (
  gridPos: Vector3,
  cellValue: number,
  grid: CollisionGrid
) => {
  let currCellValues = grid.gridPosCellValuesMap.get(hashPos(gridPos));
  if (currCellValues === undefined) return;
  currCellValues.delete(cellValue);
  if (currCellValues.size === 0)
    grid.gridPosCellValuesMap.delete(hashPos(gridPos));
  else grid.gridPosCellValuesMap.set(hashPos(gridPos), currCellValues);
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
  const gridPosCellValuesMap = new Map<
    ReturnType<typeof hashPos>,
    Set<number>
  >();
  const grid: CollisionGrid = {
    worldDims,
    worldOffset,
    gridDims,
    gridPosCellValuesMap,
  };

  posCellValuePairs.forEach(([pos, cellValue]) => {
    const gridPos = worldPosToGridPos(pos, grid);
    if (gridPos === null) return;
    addCellValue(gridPos, cellValue, grid);
  });

  return grid;
};

export const updateGrid = (
  pos: Vector3,
  nextPos: Vector3,
  cellValue: number,
  grid: CollisionGrid,
  nextGrid: CollisionGrid
) => {
  const gridPos = worldPosToGridPos(pos, grid);
  if (gridPos === null) return;

  const nextGridPos = worldPosToGridPos(nextPos, grid);
  if (nextGridPos === null) return;

  if (!gridPos.equals(nextGridPos)) {
    removeCellValue(gridPos, cellValue, nextGrid);
    addCellValue(nextGridPos, cellValue, nextGrid);
  }
};
