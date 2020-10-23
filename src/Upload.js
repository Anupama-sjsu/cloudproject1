import React, { useState, useEffect } from "react";
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
  Box
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

const Upload = ({ user, updateImages }) => {
  let [values, setValues] = useState({
    description: "",
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
        fileName: null
      })
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
        let postData = {
          file: data,
          ...values,
        };
        console.log(postData);
        fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
          method: "POST",
          headers: {
            Authorization: user.token,
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .then(() => {
            updateImages();
            fileInput.current.value = null;
            setValues({});
            setFeedback({
              show: true,
              message: "Upload successful"
            })
          })
          .catch((err) => console.log(err));
      });
    }
  };
  return (
    <Section>
      <Feedback {...feedback} />
      <Grid container justify="center">
        <Grid item xs={10}>
          <form onSubmit={handleSubmit}>
            <Box p={1}>
              <FormGroup>
                <FormControl>
                  <InputLabel>Upload File</InputLabel>
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
            {values.fileName && (
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
                        Upload
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
