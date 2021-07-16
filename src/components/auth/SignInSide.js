import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { ToastContainer, toast } from 'react-toastify';
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import {authenticate,isAuth} from "./Helpers.js";
import axios from 'axios';

//import User_cookies from '../../classes/User_cookies.js';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Fridgit
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
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin:"auto auto"
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
      email: "",
      password: "",
      error: "",
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
    console.log("data",this.state)
    
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/signin`,
      data: this.state
  })
      .then(response => {
        authenticate(response, ()=>{
          console.log('SIGNIN SUCCESS', response);
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
        })
          // save the response (user, token) localstorage/cookie
          // setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' });
      })
      .catch(error => {
          console.log('SIGNIN ERROR', error.response.data);
          // toast.error(error.response.data.error);
      });
  }

  render() {
    const { classes } = this.props;
    
      
    // return (!isAuth()?
    return <>
        <ToastContainer />
        <Grid container component="main" className={classes.root} >
        <CssBaseline />
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
        id="email"
        label="email"
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
        label="password"
        type="password"
        id="password"
        autoComplete="current-password"
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
        <Box mt={5}>
        <Copyright />
        </Box>
        </form>
        </div>
        </Grid>
        </>
    // :<></>)
  }
}
export default withStyles(styles)(SignInSide);
