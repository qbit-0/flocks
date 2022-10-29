import {
  Box,
  Button,
  Divider,
  Drawer,
  Link,
  Paper,
  SlideProps,
  Slider,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { FlocksContext } from "../utils/context/FlocksContextProvider";
import ControlBox from "./ControlBox";

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

  const [open, setOpen] = useState(false);

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
    <>
      <Box component="div" position="absolute" height="100vh">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          sx={{ height: "100%" }}
        >
          setttings
        </Button>
      </Box>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            p: 2,
            bgcolor: "transparent",
            backdropFilter: "blur(5px) brightness(10%)",
          },
        }}
      >
        <Stack spacing={1} divider={<Divider />}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            close
          </Button>
          <ControlBox>
            <Typography>{`Number of Birds: ${numBirds}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={numBirds}
              min={0}
              max={1000}
              step={100}
              onChange={handleSliderChange(setNumBirds)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Max Speed: ${maxSpeed}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={maxSpeed}
              min={500}
              max={2000}
              step={500}
              onChange={handleSliderChange(setMaxSpeed)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Steer Force: ${steerForce}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={steerForce}
              min={0}
              max={400000}
              step={50000}
              onChange={handleSliderChange(setSteerForce)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Separation Distance: ${separationDist}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={separationDist}
              min={0}
              max={5}
              step={0.5}
              onChange={handleSliderChange(setSeparationDist)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Alignment Distance: ${alignmentDist}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={alignmentDist}
              min={0}
              max={5}
              step={0.5}
              onChange={handleSliderChange(setAlignmentDist)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Cohesion Distance: ${cohesionDist}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={cohesionDist}
              min={0}
              max={5}
              step={0.5}
              onChange={handleSliderChange(setCohesionDist)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Separation Weight: ${separationWeight}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={separationWeight}
              min={0}
              max={4}
              step={0.1}
              onChange={handleSliderChange(setSeparationWeight)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Alignment Weight: ${alignmentWeight}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={alignmentWeight}
              min={0}
              max={4}
              step={0.1}
              onChange={handleSliderChange(setAlignmentWeight)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`Cohesion Weight: ${cohesionWeight}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={cohesionWeight}
              min={0}
              max={4}
              step={0.1}
              onChange={handleSliderChange(setCohesionWeight)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`World Width: ${worldWidth}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={worldWidth}
              min={10}
              max={100}
              step={10}
              onChange={handleSliderChange(setWorldWidth)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`World Height: ${worldHeight}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={worldHeight}
              min={10}
              max={100}
              step={10}
              onChange={handleSliderChange(setWorldHeight)}
            />
          </ControlBox>

          <ControlBox>
            <Typography>{`World Depth: ${worldDepth}`}</Typography>
            <Slider
              marks
              valueLabelDisplay="auto"
              value={worldDepth}
              min={10}
              max={100}
              step={10}
              onChange={handleSliderChange(setWorldDepth)}
            />
          </ControlBox>

          <Box component="div" px={2}>
            <Typography fontSize={24} fontWeight="bold" color="primary">
              Created by{" "}
              <Link
                onClick={() => {
                  window.open("https://www.duypham.tech/", "_blank");
                }}
              >
                Duy Pham.
              </Link>{" "}
              <Link
                onClick={() => {
                  window.open("https://github.com/qbit-0/flocks", "_blank");
                }}
              >
                Source code.
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
};

export default FlocksControls;
