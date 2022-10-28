import { Vector3 } from "three";
import { getGridDims, Grid, hashPos, worldPosToGridPos } from "./grid";

export type ArrayGrid<T> = Grid & {
  gridPosValueArrMap: Map<ReturnType<typeof hashPos>, T[]>;
};

export const gridPosToValueArr = <T>(gridPos: Vector3, grid: ArrayGrid<T>) =>
  grid.gridPosValueArrMap.get(hashPos(gridPos));

export const worldPosToValueArr = <T>(pos: Vector3, grid: ArrayGrid<T>) => {
  const gridPos = worldPosToGridPos(pos, grid);
  if (gridPos === null) return;
  return gridPosToValueArr(gridPos, grid);
};

export const worldPosToAdjValueArr = <T>(pos: Vector3, grid: ArrayGrid<T>) => {
  const gridPos = worldPosToGridPos(pos, grid);

  const allAdjGridValueArr: T[] = [];
  if (gridPos === null) return allAdjGridValueArr;

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

  adjGridPosArr.forEach((adjGridPos) => {
    const adjGridValueArr = grid.gridPosValueArrMap.get(hashPos(adjGridPos));
    if (adjGridValueArr === undefined) return;
    adjGridValueArr.forEach((adjGridValue) => {
      allAdjGridValueArr.push(adjGridValue);
    });
  });

  return allAdjGridValueArr;
};

export const addValue = <T>(gridPos: Vector3, value: T, grid: ArrayGrid<T>) => {
  let currValueArr = grid.gridPosValueArrMap.get(hashPos(gridPos));
  if (currValueArr === undefined)
    grid.gridPosValueArrMap.set(hashPos(gridPos), []);
  else grid.gridPosValueArrMap.set(hashPos(gridPos), [...currValueArr, value]);
};

export const removeValue = <T>(
  gridPos: Vector3,
  value: T,
  grid: ArrayGrid<T>
) => {
  let currValueArr = grid.gridPosValueArrMap.get(hashPos(gridPos));
  if (currValueArr === undefined) return;
  currValueArr = currValueArr.filter((currValue) => currValue !== value);
  if (currValueArr.length === 0)
    grid.gridPosValueArrMap.delete(hashPos(gridPos));
  else grid.gridPosValueArrMap.set(hashPos(gridPos), currValueArr);
};

export const createArrayGrid = <T>(
  posValuePairs: [Vector3, T][],
  worldDims: Vector3,
  worldOffset: Vector3,
  cellSize: number
): ArrayGrid<T> => {
  const gridDims = getGridDims(worldDims, cellSize);
  const gridPosValueArrMap = new Map<ReturnType<typeof hashPos>, T[]>();
  const grid: ArrayGrid<T> = {
    worldDims,
    worldOffset,
    gridDims,
    gridPosValueArrMap,
  };

  posValuePairs.forEach(([pos, value]) => {
    const gridPos = worldPosToGridPos(pos, grid);
    if (gridPos === null) return;
    addValue(gridPos, value, grid);
  });

  return grid;
};

export const updateArrayGrid = <T>(
  pos: Vector3,
  nextPos: Vector3,
  value: T,
  grid: ArrayGrid<T>,
  nextGrid: ArrayGrid<T>
) => {
  const gridPos = worldPosToGridPos(pos, grid);
  if (gridPos === null) return;

  const nextGridPos = worldPosToGridPos(nextPos, grid);
  if (nextGridPos === null) return;

  if (!gridPos.equals(nextGridPos)) {
    removeValue(gridPos, value, nextGrid);
    addValue(nextGridPos, value, nextGrid);
  }
};
