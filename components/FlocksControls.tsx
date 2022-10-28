import { Box, Paper, Slider, Typography } from "@mui/material";
import React, { useContext } from "react";
import { FlocksContext } from "../utils/context/FlocksContextProvider";

type Props = {};

const FlocksControls = (props: Props) => {
  const {
    numBirds,
    setNumBirds,
    maxSpeed,
    setMaxSpeed,
    steerForce,
    setSteerForce,
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
    <Paper
      sx={{ padding: 2, bgcolor: "transparent", backdropFilter: "blur(5px)" }}
    >
      <Typography>{`Number of Birds: ${numBirds}`}</Typography>
      <Slider
        value={numBirds}
        min={0}
        max={1000}
        step={100}
        onChange={handleSliderChange(setNumBirds)}
      />

      <Typography>{`Max Speed: ${maxSpeed}`}</Typography>
      <Slider
        value={maxSpeed}
        min={500}
        max={2000}
        step={500}
        onChange={handleSliderChange(setMaxSpeed)}
      />

      <Typography>{`Steer Force: ${steerForce}`}</Typography>
      <Slider
        value={steerForce}
        min={0}
        max={400000}
        step={50000}
        onChange={handleSliderChange(setSteerForce)}
      />

      <Typography>{`Separation Distance: ${separationDist}`}</Typography>
      <Slider
        value={separationDist}
        min={0}
        max={5}
        step={0.5}
        onChange={handleSliderChange(setSeparationDist)}
      />

      <Typography>{`Alignment Distance: ${alignmentDist}`}</Typography>
      <Slider
        value={alignmentDist}
        min={0}
        max={5}
        step={0.5}
        onChange={handleSliderChange(setAlignmentDist)}
      />

      <Typography>{`Cohesion Distance: ${cohesionDist}`}</Typography>
      <Slider
        value={cohesionDist}
        min={0}
        max={5}
        step={0.5}
        onChange={handleSliderChange(setCohesionDist)}
      />

      <Typography>{`Separation Weight: ${separationWeight}`}</Typography>
      <Slider
        value={separationWeight}
        min={0}
        max={4}
        step={0.1}
        onChange={handleSliderChange(setSeparationWeight)}
      />

      <Typography>{`Alignment Weight: ${alignmentWeight}`}</Typography>
      <Slider
        value={alignmentWeight}
        min={0}
        max={4}
        step={0.1}
        onChange={handleSliderChange(setAlignmentWeight)}
      />

      <Typography>{`Cohesion Weight: ${cohesionWeight}`}</Typography>
      <Slider
        value={cohesionWeight}
        min={0}
        max={4}
        step={0.1}
        onChange={handleSliderChange(setCohesionWeight)}
      />

      <Typography>{`World Width: ${worldWidth}`}</Typography>
      <Slider
        value={worldWidth}
        min={10}
        max={100}
        step={10}
        onChange={handleSliderChange(setWorldWidth)}
      />

      <Typography>{`World Height: ${worldHeight}`}</Typography>
      <Slider
        value={worldHeight}
        min={10}
        max={100}
        step={10}
        onChange={handleSliderChange(setWorldHeight)}
      />

      <Typography>{`World Depth: ${worldDepth}`}</Typography>
      <Slider
        value={worldDepth}
        min={10}
        max={100}
        step={10}
        onChange={handleSliderChange(setWorldDepth)}
      />
    </Paper>
  );
};

export default FlocksControls;
