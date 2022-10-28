import { Vector3 } from "three";
import { getGridDims, Grid, hashPos, worldPosToGridPos } from "./grid";

export type ValueGrid<T> = Grid & {
  gridPosValueMap: Map<ReturnType<typeof hashPos>, T>;
};

export const gridPosToValue = <T>(gridPos: Vector3, grid: ValueGrid<T>) =>
  grid.gridPosValueMap.get(hashPos(gridPos));

export const setValue = <T>(gridPos: Vector3, value: T, grid: ValueGrid<T>) => {
  grid.gridPosValueMap.set(hashPos(gridPos), value);
};

export const deleteValue = <T>(gridPos: Vector3, grid: ValueGrid<T>) => {
  grid.gridPosValueMap.delete(hashPos(gridPos));
};

export const createValueGrid = <T>(
  posValuePairs: [Vector3, T][],
  worldDims: Vector3,
  worldOffset: Vector3,
  cellSize: number
): ValueGrid<T> => {
  const gridDims = getGridDims(worldDims, cellSize);
  const gridPosValueMap = new Map<ReturnType<typeof hashPos>, T>();
  const grid: ValueGrid<T> = {
    worldDims,
    worldOffset,
    gridDims,
    gridPosValueMap,
  };

  posValuePairs.forEach(([pos, value]) => {
    const gridPos = worldPosToGridPos(pos, grid);
    if (gridPos === null) return;
    setValue(gridPos, value, grid);
  });

  return grid;
};
