import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {};

const FlocksControls = (props: Props) => {
  const flocksContext = useContext(FlocksContext);

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
        <Stack spacing={1}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            close
          </Button>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Global </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ControlBox>
                <Typography>{`Number of Birds: ${flocksContext.numBirds}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.numBirds}
                  min={0}
                  max={1000}
                  step={100}
                  onChange={handleSliderChange(flocksContext.setNumBirds)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Max Speed: ${flocksContext.maxSpeed}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.maxSpeed}
                  min={500}
                  max={2000}
                  step={500}
                  onChange={handleSliderChange(flocksContext.setMaxSpeed)}
                />
              </ControlBox>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Mouse</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ControlBox>
                <Typography>{`Mouse Push Force: ${flocksContext.mousePushForce}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.mousePushForce}
                  min={-4000000}
                  max={4000000}
                  step={500000}
                  onChange={handleSliderChange(flocksContext.setMousePushForce)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Mouse Push Distance: ${flocksContext.mousePushDist}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.mousePushDist}
                  min={0}
                  max={10}
                  step={0.5}
                  onChange={handleSliderChange(flocksContext.setMousePushDist)}
                />
              </ControlBox>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Flocking</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ControlBox>
                <Typography>{`Steer Force: ${flocksContext.steerForce}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.steerForce}
                  min={0}
                  max={400000}
                  step={50000}
                  onChange={handleSliderChange(flocksContext.setSteerForce)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Separation Distance: ${flocksContext.separationDist}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.separationDist}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={handleSliderChange(flocksContext.setSeparationDist)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Alignment Distance: ${flocksContext.alignmentDist}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.alignmentDist}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={handleSliderChange(flocksContext.setAlignmentDist)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Cohesion Distance: ${flocksContext.cohesionDist}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.cohesionDist}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={handleSliderChange(flocksContext.setCohesionDist)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Separation Weight: ${flocksContext.separationWeight}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.separationWeight}
                  min={0}
                  max={4}
                  step={0.1}
                  onChange={handleSliderChange(
                    flocksContext.setSeparationWeight
                  )}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Alignment Weight: ${flocksContext.alignmentWeight}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.alignmentWeight}
                  min={0}
                  max={4}
                  step={0.1}
                  onChange={handleSliderChange(
                    flocksContext.setAlignmentWeight
                  )}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Cohesion Weight: ${flocksContext.cohesionWeight}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.cohesionWeight}
                  min={0}
                  max={4}
                  step={0.1}
                  onChange={handleSliderChange(flocksContext.setCohesionWeight)}
                />
              </ControlBox>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>World</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ControlBox>
                <Typography>{`World Width: ${flocksContext.worldWidth}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.worldWidth}
                  min={10}
                  max={100}
                  step={10}
                  onChange={handleSliderChange(flocksContext.setWorldWidth)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`World Height: ${flocksContext.worldHeight}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.worldHeight}
                  min={10}
                  max={100}
                  step={10}
                  onChange={handleSliderChange(flocksContext.setWorldHeight)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`World Depth: ${flocksContext.worldDepth}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.worldDepth}
                  min={10}
                  max={100}
                  step={10}
                  onChange={handleSliderChange(flocksContext.setWorldDepth)}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Border Push Force: ${flocksContext.borderPushForce}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.borderPushForce}
                  min={0}
                  max={2000000}
                  step={100000}
                  onChange={handleSliderChange(
                    flocksContext.setBorderPushForce
                  )}
                />
              </ControlBox>

              <ControlBox>
                <Typography>{`Border Push Distance: ${flocksContext.borderPushDist}`}</Typography>
                <Slider
                  marks
                  valueLabelDisplay="auto"
                  value={flocksContext.borderPushDist}
                  min={0}
                  max={20}
                  step={0.5}
                  onChange={handleSliderChange(flocksContext.setBorderPushDist)}
                />
              </ControlBox>
            </AccordionDetails>
          </Accordion>

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
