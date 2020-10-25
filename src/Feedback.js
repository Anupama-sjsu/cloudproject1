import React from "react";
import { Snackbar } from "@material-ui/core";
const Feedback = ({ show, message, handleClose }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={show}
      onClose={handleClose}
      autoHideDuration={5000}
      message={message}
    />
  );
};

export default Feedback;
