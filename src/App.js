import React, { useState, useEffect } from "react";
import { Auth } from "@aws-amplify/auth";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { AmplifyAuthenticator, AmplifySignUp } from "@aws-amplify/ui-react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import { CssBaseline, Container, Grid } from "@material-ui/core";
import awsconfig from "./awsconfig";
import Header from "./Header";
import Upload from "./Upload";
import ListFiles from "./List";

Auth.configure(awsconfig);
const signUpFields = [
  {
    type: "username",
    label: "Email Address",
    placeholder: "Email Address",
    hint: "username",
    required: true,
  },
  {
    type: "password",
    label: "Password",
    placeholder: "Password",
    hint: null,
    required: true,
  },
  {
    type: "name",
    label: "First Name",
    placeholder: "First Name",
    hint: null,
    required: true,
  },
  {
    type: "family_name",
    label: "Last Name",
    placeholder: "Last Name",
    hint: null,
    required: true,
  },
];

let App = () => {
  let [files, setFiles] = useState();
  const [authState, setAuthState] = useState();
  const [user, setUser] = React.useState();
  let token = user && user.token;

  useEffect(() => {
    getFiles();
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      if (authData && authData.attributes) {
        let user = {};
        let { name, family_name, email } = authData.attributes;
        user = {
          name,
          family_name,
          email,
        };
        if (
          authData &&
          authData.signInUserSession.accessToken.payload["cognito:groups"] &&
          authData.signInUserSession.accessToken.payload["cognito:groups"][0]
        )
          user.isAdmin = true;
        user.token = authData.signInUserSession.idToken.jwtToken;
        setUser(user);
      }
    });
  }, [token]);

  const getFiles = () => {
    if(user && user.token) {
    fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
      headers: {
        Authorization: user.token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setFiles(result);
      })
      .catch((error) => console.log("error", error));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {authState === AuthState.SignedIn ? (
          <Grid container justify="center" alignContent="center">
            <Grid item xs>
              <Header user={user} />
              <Upload user={user} updateFiles={getFiles} title="Upload File" method="POST" />
              <ListFiles user={user} updateFiles={getFiles} files={files} />
            </Grid>
          </Grid>
        ) : (
          <Grid container justify="center" alignContent="center">
            <Grid item>
              <AmplifyAuthenticator usernameAlias="email">
                <AmplifySignUp
                  formFields={signUpFields}
                  slot="sign-up"
                />
              </AmplifyAuthenticator>
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
