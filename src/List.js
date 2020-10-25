import React, { useState } from "react";
import {
  Paper,
  Box,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Feedback from "./Feedback";
import UpdateDialog from "./UpdateDialog";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: "10px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  action: {
    margin: "auto",
  },
}));

const ListFiles = ({ user, updateFiles, files }) => {
  const classes = useStyles();
  let [feedback, setFeedback] = useState();
  let [updateValues, setUpdateValues] = useState({
    key: null,
    open: false,
  });
  const handleDelete = (key) => {
    let deleteData = {
      key: key,
    };
    fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
      method: "DELETE",
      headers: {
        Authorization: user.token,
      },
      body: JSON.stringify(deleteData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => {
        updateFiles();
        setFeedback({
          show: true,
          message: "Deleted",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (key, description) => {
    setUpdateValues({
      key,
      description,
      open: true,
    });
  };

  const handleDialogClose = () => {
    setUpdateValues({
      key: null,
      open: false,
      description: "",
    });
  };

  const Sub = (file) => {
    return (
      <>
        <Typography variant="caption" display="block">
          {file.fname} {file.lname}
        </Typography>
        <Typography variant="caption" display="block">
          {file.user_id}
        </Typography>
      </>
    );
  };

  const handleFeedbackClose = () => {
    setFeedback({
      show: false,
      message: "",
    });
  };

  return (
    <Paper>
      <UpdateDialog
        user={user}
        updateFiles={updateFiles}
        description={updateValues.description}
        open={updateValues.open}
        fileKey={updateValues.key}
        handleClose={handleDialogClose}
      />
      <Feedback {...feedback} handleClose={handleFeedbackClose} />
      <Box p={5}>
        <Grid container justify="flex-start">
          {files &&
            files.map((file) => {
              return (
                <Grid item xs={3} key={file.key}>
                  <Card className={classes.root}>
                    <CardHeader
                      title={file.key}
                      subheader={Sub(file)}
                      avatar={
                        <a href={file.url} download>
                          <IconButton>
                            <CloudDownloadIcon />
                          </IconButton>
                        </a>
                      }
                    />
                    <CardMedia
                      className={classes.media}
                      image={file.url}
                      title={file.Key}
                    />
                    <CardContent>
                      <Typography
                        variant="caption"
                        display="block"
                        style={{ textAlign: "right" }}
                      >
                        Created: {new Date(file.crtd_date).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        style={{ textAlign: "right" }}
                      >
                        Updated:{" "}
                        {new Date(file.updt_date).toLocaleString()}
                      </Typography>
                      <p>{file.description}</p>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        onClick={() => handleEdit(file.key, file.description)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(file.key)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Paper>
  );
};
export default ListFiles;
