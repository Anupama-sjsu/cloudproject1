import React from "react";
import { Snackbar } from "@material-ui/core";
const Feedback = ({ show, message }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={show}
      autoHideDuration={6000}
      message={message}
    />
  );
};

export default Feedback;
