import React, { Fragment,useRef,useEffect,useState } from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,
} from "@material-ui/core";
import axios from 'axios';
import { Close, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minWidth: "100%",
  },
}));
const AddFormDialog = (props) => {
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const classes = useStyles(); //custom css
  const nameRef = useRef()
  const addressRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const submitRef = useRef()
  const [formValues, setFormValues] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: {error:false,msg:""},
    address: {error:false,msg:""},
    phone: {error:false,msg:""},
    email: {error:false,msg:""}
  });
  useEffect(()=>{
    nameRef.current.focus()
  },[])
  const keyPressHandler = (e) => {
      const { keyCode, target } = e
      if(keyCode===13){
        switch (target.name){
          case "name": submitRef.current.focus();break;
          case "address": nameRef.current.focus();break;
          case "phone": nameRef.current.focus();break;
          case "email": nameRef.current.focus();break;
          default: nameRef.current.focus();
        }
      }
  }
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    // e.persist();
    setFormValues({ ...formValues, [name]: value });
  };
  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked ? 1 : 0 });
  }
  const handleOnSubmit = async () => {
    for (const [
      key,
      value,
    ] of Object.entries(formErrors)) {
      if (value.error === true)
        return setOpenAlertError(true);
    }

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/clients`,
      data: [formValues],
    })
      .then(function (response) {
        setFormValues({
          name: "",
          address: "",
          phone: "",
          email: ""
        });
        props.handleClose();
        return setOpenAlertSuccess(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const validateInputHandler = (e) => {
    const { name, value } = e.target;
    const requiredInput = value.toString().trim().length ? false : true;
    setFormErrors({ ...formErrors, [name]: {error: requiredInput, msg: "This field is required"} });
    if(name==="email"){
        const invalidEmail = !/\S+@\S+\.\S+/.test(value);
        setFormErrors({ ...formErrors, [name]: {error: invalidEmail, msg: "Enter a valid email address"} });
    }
  }
  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close onClick={props.handleClose} className="btnIcon" />
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Collapse in={openAlertSuccess}>
        <Alert severity="success" onClick={() => setOpenAlertSuccess(false)}>
          The serviceType is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>

      <div style={{ padding: "50px" }}>
        <Grid container spacing={3}>        
          <Grid item xs={12} sm={6}>
            <TextField
              id="nameInput"
              label="Company name"
              name="name"
              value={formValues.name || ""}
              onChange={handleChangeForm}
              fullWidth
              inputRef={nameRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="addressInput"
              label="Address"
              name="address"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.address || ""}
              inputRef={addressRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.address.error ? formErrors.address.msg : null
              }
              error={formErrors.address.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="phoneInput"
              label="Phone"
              name="phone"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.phone || ""}
              inputRef={phoneRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.phone.error ? formErrors.phone.msg : null
              }
              error={formErrors.phone.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="emailInput"
              label="Email"
              name="email"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.email || ""}
              inputRef={emailRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.email.error ? formErrors.email.msg : null
              }
              error={formErrors.email.error}
            />
          </Grid>

          <Grid item xs={12} className="clientTables">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              type="submit"
              startIcon={<Save />}
              ref={submitRef}
              onClick={handleOnSubmit}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={props.handleClose}
              startIcon={<Close />}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default AddFormDialog;
