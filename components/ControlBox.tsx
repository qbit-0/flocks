import { Box, Typography } from "@mui/material";
import React, { FC } from "react";

type Props = { children: React.ReactNode };

const ControlBox: FC<Props> = ({ children }) => {
  return (
    <Box component="div" px={2}>
      {children}
    </Box>
  );
};

export default ControlBox;
