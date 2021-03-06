import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    formControl: {
      minWidth: "100%",
    },
  }));
const SubTables = (props) => {
  const token = getCookie('token');
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""}
    });
    
  useEffect(()=>{
    nameRef.current.focus()
    if (props.userProfileId) {
      const fetchData = async () => {
        const userProfile = await axios(
          `${process.env.REACT_APP_BASE_URL}/userProfile/${props.userProfileId}`,
          {
            responseType: "json", headers: {Authorization: `Bearer ${token}`},
          }
        ).then((response) => {
          setFormValues(response.data);
        });
      };
      fetchData();
    }
  },[])
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "name": submitRef.current.focus();break;
        default: nameRef.current.focus();
      }
    }
  }
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  
  if (props.userProfileId) {
    delete formValues.cities
    delete formValues.userProfileCity
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_URL}/userProfile/${props.userProfileId}`,
        headers: {Authorization: `Bearer ${token}`},
        data: [formValues],
      })
      .then(function (response) {
        toast.success("Successfully Updated", {onClose: () => props.handleClose()});
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/userProfile/`,
        headers: {Authorization: `Bearer ${token}`},
        data: [formValues],
      })
      .then(async function (response) {
        setOpenAlertSuccess(true);
        setFormValues({
          name: ""
        });
        toast.success("Successfully Added", {onClose: () => props.handleClose()});
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    <ToastContainer />
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
          The userProfile is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>


      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              id="nameInput"
              label="Name"
              name="name"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.name || ""}
              inputRef={nameRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
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

export default SubTables;
