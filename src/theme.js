import { createMuiTheme } from "@material-ui/core/styles";
import {cyan} from "@material-ui/core/colors";

const cyanMain = cyan['700']

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: cyanMain,
      //contrastText: 'white'
    }
  }
});