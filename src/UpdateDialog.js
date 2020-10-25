import React from "react";
import { Dialog } from "@material-ui/core";
import Upload from "./Upload";
const UpdateDialog = ({ user, updateFiles, fileKey, open, description, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Upload user={user} updateFiles={updateFiles} description={description} fileKey={fileKey} title="Update File" method="PUT" handleClose={handleClose} />
    </Dialog>
  );
};

export default UpdateDialog;
