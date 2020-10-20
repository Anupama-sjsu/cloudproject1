import React, { useState, useEffect } from "react";
import { CssBaseline, Container, Paper, Box, Grid } from "@material-ui/core";

function App() {
  let [images, setImages] = useState();

  const getImages = () => {
    fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files")
      .then((response) => response.json())
      .then((result) => {
        setImages(result);
      })
      .catch((error) => console.log("error", error));
  };

  let [values, setValues] = useState({
    name: "",
    size: "",
    type: "",
  });

  let [file, setFile] = useState();
  useEffect(() => {
    getImages();
  }, []);

  const handleChange = (event) => {
    let { name, size, type } = event.target.files[0];
    setValues({
      name: name,
      size: size,
      type: type,
    });
    setFile(event.target.files[0]);
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        let binaryString = event.target.result;
        resolve(btoa(binaryString));
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const handleClick = () => {
    getBase64(file).then((data) => {
      let postData = {
        file: data,
        name: values.name,
      };
      console.log(postData);
      fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
        method: "POST",
        body: JSON.stringify(postData),
      })
        .then(() => getImages())
        //.then((data) => console.log(data))
        .catch((err) => console.log(err));
    });
  };
  // const handleClick = () => {
  //   let data = new FormData();
  //   data.append("text", "hello");
  //   data.append("file", file);
  //   var requestOptions = {
  //     method: 'POST',
  //     body: data
  //   };
  //   fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", requestOptions)
  // .then(response => response.text())
  // .then(result => console.log(result))
  // .catch(error => console.log('error', error));
  // }
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Paper>
          <Box p={5}>
            <Grid container>
              <Grid item>
                {images &&
                  images.map((image) => (
                    <Grid container>
                      <Grid item><img src={`https://s3-us-west-1.amazonaws.com/anukurudi.com/${image.Key}`} width="100px" /></Grid>
                      <Grid item>{image.Key}</Grid>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Paper>
          <Box p={5}>
            <div className="App">
              <input
                type="file"
                id="myFile"
                name="filename"
                onChange={handleChange}
              />
              <button type="button" onClick={handleClick}>
                Upload
              </button>
            </div>
          </Box>
        </Paper>
      </Container>
    </React.Fragment>
  );
}

export default App;
