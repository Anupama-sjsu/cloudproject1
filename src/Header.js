import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Auth } from "@aws-amplify/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  admin: {
    flexGrow: 3,
    textAlign: "center"
  },
}));

const Header = ({ user }) => {
  const classes = useStyles();
  const handleClick = () => {
    Auth.signOut();
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            File Uploader
          </Typography>
          <Typography variant="h6" className={classes.title}>
            {user && `Welcome ${user.email}`}
          </Typography>
          <Button color="inherit" onClick={handleClick}>
            Logout
          </Button>
        </Toolbar>
        <Typography variant="h6" className={classes.admin}>
            {user && user.isAdmin && `ADMIN ACCOUNT`}
          </Typography>
      </AppBar>
    </div>
  );
};

export default Header;
