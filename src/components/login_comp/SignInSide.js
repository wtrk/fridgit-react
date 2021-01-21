import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

//import User_cookies from '../../classes/User_cookies.js';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignInSide extends React.Component {
  constructor() {
    super();
    this.state = {
      Username: "",
      Password: "",
      Error: "",
    };
    this.handlerchange = this.handlerchange.bind(this);

    this.submitdata = this.submitdata.bind(this);
  }

  handlerchange(event) {
    const { id, value, checked, type } = event.target;

    this.setState({
      [id]: value,
    });
  }

  submitdata() {
    const requestOptions = {
      method: "POST",

      body: JSON.stringify(this.state),
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/login.php`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          localStorage.setItem("Firstname", data[0].Firstname);
          localStorage.setItem("Lastname", data[0].Lastname);
          localStorage.setItem("Username", data[0].username);
          localStorage.setItem("Serial", data[0].serial);

          localStorage.setItem("City", data[0].city);
          localStorage.setItem("Country", data[0].country);
          localStorage.setItem("Password", data[0].password);
          localStorage.setItem("Description", data[0].description);
          localStorage.setItem("Position", data[0].position);
          localStorage.setItem("Email", data[0].email);

          //console.log(localStorage);
          // getter
          // localStorage.getItem('myData');

          // // remove
          // localStorage.removeItem('myData');

          // // remove all
          // localStorage.clear();

          window.location = "/admin";
        } else {
          this.setState({
            Error: "Wrong Username Or Password!",
          });
        }
        // this.showNotification("Success!","success")
      })
      .catch((error) => {
        alert("error");
        // this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
        // this.showNotification("Error!!","danger")
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                onChange={this.handlerchange}
                id="Username"
                label="Username"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                onChange={this.handlerchange}
                label="Password"
                type="password"
                id="Password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <span style={{ color: "red" }}>{this.state.Error}</span>
              <Button
                type="button"
                fullWidth
                onClick={this.submitdata}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(SignInSide);
