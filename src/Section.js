import React from "react";
import { Paper, Box } from "@material-ui/core";
const Section = ({ children }) => {
  return (
    <Paper elevation={3}>
      <Box p={5} m={1}>{children}</Box>
    </Paper>
  );
};

export default Section;
