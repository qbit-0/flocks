import { Box, Slider, Typography } from "@mui/material";
import React, { useContext } from "react";
import { FlocksContext } from "../utils/context/FlocksContextProvider";

type Props = {};

const FlocksControls = (props: Props) => {
  const {
    numBirds,
    setNumBirds,
    maxSpeed,
    setMaxSpeed,
    maxForce,
    setMaxForce,
    separationDist,
    setSeparationDist,
    alignmentDist,
    setAlignmentDist,
    cohesionDist,
    setCohesionDist,
    separationWeight,
    setSeparationWeight,
    alignmentWeight,
    setAlignmentWeight,
    cohesionWeight,
    setCohesionWeight,
    worldWidth,
    setWorldWidth,
    worldHeight,
    setWorldHeight,
    worldDepth,
    setWorldDepth,
  } = useContext(FlocksContext);

  const handleSliderChange = (setValue: (value: number) => void) => {
    return (_: Event, value: number | number[]) => {
      if (Array.isArray(value)) {
        setValue(value[0]);
      } else {
        setValue(value);
      }
    };
  };

  return (
    <Box component="div" color="white">
      <Typography>{`Number of Birds: ${numBirds}`}</Typography>
      <Slider
        value={numBirds}
        min={0}
        max={10000}
        onChange={handleSliderChange(setNumBirds)}
      />

      <Typography>{`Max Speed: ${maxSpeed}`}</Typography>
      <Slider
        value={maxSpeed}
        min={0}
        max={20000}
        onChange={handleSliderChange(setMaxSpeed)}
      />

      <Typography>{`Max Force: ${maxForce}`}</Typography>
      <Slider
        value={maxForce}
        min={0}
        max={600000}
        onChange={handleSliderChange(setMaxForce)}
      />

      <Typography>{`Separation Distance: ${separationDist}`}</Typography>
      <Slider
        value={separationDist}
        onChange={handleSliderChange(setSeparationDist)}
      />

      <Typography>{`Alignment Distance: ${alignmentDist}`}</Typography>
      <Slider
        value={alignmentDist}
        onChange={handleSliderChange(setAlignmentDist)}
      />

      <Typography>{`Cohesion Distance: ${cohesionDist}`}</Typography>
      <Slider
        value={cohesionDist}
        onChange={handleSliderChange(setCohesionDist)}
      />

      <Typography>{`Separation Weight: ${separationWeight}`}</Typography>
      <Slider
        value={separationWeight}
        min={0}
        max={2}
        step={0.1}
        onChange={handleSliderChange(setSeparationWeight)}
      />

      <Typography>{`Alignment Weight: ${alignmentWeight}`}</Typography>
      <Slider
        value={alignmentWeight}
        min={0}
        max={2}
        step={0.1}
        onChange={handleSliderChange(setAlignmentWeight)}
      />

      <Typography>{`Cohesion Weight: ${cohesionWeight}`}</Typography>
      <Slider
        value={cohesionWeight}
        min={0}
        max={2}
        step={0.1}
        onChange={handleSliderChange(setCohesionWeight)}
      />

      <Typography>{`World Width: ${worldWidth}`}</Typography>
      <Slider
        value={worldWidth}
        min={10}
        max={100}
        step={1}
        onChange={handleSliderChange(setWorldWidth)}
      />

      <Typography>{`World Height: ${worldHeight}`}</Typography>
      <Slider
        value={worldHeight}
        min={10}
        max={100}
        step={1}
        onChange={handleSliderChange(setWorldHeight)}
      />

      <Typography>{`World Depth: ${worldDepth}`}</Typography>
      <Slider
        value={worldDepth}
        min={10}
        max={100}
        step={1}
        onChange={handleSliderChange(setWorldDepth)}
      />
    </Box>
  );
};

export default FlocksControls;
