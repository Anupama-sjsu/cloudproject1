import React, { useState } from "react";
import { nanoid } from "nanoid";
import {
  Grid,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  TextField,
  FormGroup,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Section from "./Section";
import Feedback from "./Feedback";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      let binaryString = event.target.result;
      resolve(btoa(binaryString));
    };
    reader.onerror = (error) => reject(error);
  });
};

const Upload = ({
  user,
  updateFiles,
  description,
  title,
  method,
  fileKey,
  handleClose,
}) => {
  let [values, setValues] = useState({
    description: description ? description : "",
  });

  let [feedback, setFeedback] = useState();

  const fileInput = React.createRef();

  const handleFileChange = () => {
    if (fileInput.current.files[0]) {
      let fileExt =
        fileInput.current && fileInput.current.files[0].name.match(/(\.\w+$)/g);
      let uniqueID = nanoid(10);
      let fileName = uniqueID + fileExt;
      setValues({
        ...values,
        fileName,
      });
    } else {
      setValues({
        ...values,
        fileName: null,
      });
    }
  };

  const handleTextChange = (e) => {
    setValues({
      ...values,
      description: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let file = fileInput.current.files[0];
    if (user && user.token) {
      getBase64(file).then((data) => {
        let payload;
        if (method === "POST") {
          payload = {
            file: data,
            ...values,
          };
        } else if (method === "PUT") {
          payload = {
            file: data,
            key: fileKey,
            description: values.description,
          };
        }
        fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
          method,
          headers: {
            Authorization: user.token,
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .then(() => {
            updateFiles();
            fileInput.current.value = null;
            setValues({});
            if (method === "POST") {
              setFeedback({
                show: true,
                message: "Upload Complete",
              });
            } else if (method === "PUT") {
              handleClose();
              setFeedback({
                show: true,
                message: "File Updated",
              });
            }
          })
          .catch((err) => console.log(err));
      });
    }
  };
  const handleFeedbackClose = () => {
    setFeedback({
      show: false,
      message: "",
    });
  }
  return (
    <Section>
      <Feedback {...feedback} handleClose={handleFeedbackClose} />
      <Grid container justify="center">
        <Grid item xs={10}>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            {title}
          </Typography>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Box p={1}>
              <FormGroup>
                <FormControl>
                  <InputLabel>{title}</InputLabel>
                  <Input
                    type="file"
                    required
                    onChange={handleFileChange}
                    inputRef={fileInput}
                  />
                  <FormHelperText id="my-helper-text">
                    Max size 10 MB
                  </FormHelperText>
                </FormControl>
              </FormGroup>
            </Box>
            {(values.fileName || description) && (
              <>
                <Box p={1}>
                  <FormGroup>
                    <FormControl>
                      <TextField
                        label="Description"
                        multiline
                        rows={4}
                        variant="outlined"
                        required
                        onChange={handleTextChange}
                        value={values.description}
                      />
                      <FormHelperText id="my-helper-text">
                        Enter a short description
                      </FormHelperText>
                    </FormControl>
                  </FormGroup>
                </Box>
                <Box p={1}>
                  <FormGroup>
                    <FormControl>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                      >
                        {title}
                      </Button>
                    </FormControl>
                  </FormGroup>
                </Box>
              </>
            )}
          </form>
        </Grid>
      </Grid>
    </Section>
  );
};

export default Upload;
