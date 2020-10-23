import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Feedback from "./Feedback";
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

const List = ({ user, updateImages, images }) => {
  const classes = useStyles();
  let [feedback, setFeedback] = useState();
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
        updateImages();
        setFeedback({
          show: true,
          message: "Deleted"
        })
      })
      .catch((err) => console.log(err));
  };

  const Sub = (image) => (
    <>
      <p>
        {image.fname} {image.lname}
      </p>
      <p>{image.user_id}</p>
    </>
  );
  return (
    <Paper>
      <Feedback {...feedback} />
      <Box p={5}>
        <Grid container justify="flex-start">
          {images &&
            images.map((image, i) => {
              return (
                <Grid item xs={3} key={i}>
                  <Card className={classes.root}>
                    <CardHeader
                      title={image.key}
                      subheader={Sub(image)}
                      avatar={
                        <a href={image.url} download>
                          <IconButton>
                            <CloudDownloadIcon />
                          </IconButton>
                        </a>
                      }
                    />
                    <CardMedia
                      className={classes.media}
                      image={image.url}
                      title={image.Key}
                    />
                    <CardContent>
                      <p>{image.description}</p>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="share"
                        onClick={() => handleDelete(image.key)}
                      >
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
export default List;
