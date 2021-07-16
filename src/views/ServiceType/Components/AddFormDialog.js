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
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minWidth: "100%",
  },
}));
const AddFormDialog = (props) => {
  const token = getCookie('token');
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const classes = useStyles(); //custom css
  const codeRef = useRef()
  const nameRef = useRef()
  const submitRef = useRef()
  const [formValues, setFormValues] = useState({
    code: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState({
    code: {error:false,msg:""},
    name: {error:false,msg:""}
  });
  useEffect(()=>{
    codeRef.current.focus()
    
    if (props.userId) {
    const fetchData = async () => {
      codeRef.current.focus();
      const users = await axios(
        `${process.env.REACT_APP_BASE_URL}/serviceTypes/${props.userId}`,
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
          case "code": nameRef.current.focus();break;
          case "name": submitRef.current.focus();break;
          default: codeRef.current.focus();
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
    for (const [key, value] of Object.entries(formErrors)) {
        if(value.error===true) return toast.error("Please validate the Form and submit it again");
    }
    if (props.userId) {
        await axios({
          method: "PUT",
          url: `${process.env.REACT_APP_BASE_URL}/serviceTypes/${props.userId}`,
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
          url: `${process.env.REACT_APP_BASE_URL}/serviceTypes/`,
          headers: {Authorization: `Bearer ${token}`},
          data: [formValues],
        })
          .then(function (response) {
            setFormValues({
              code: "",
              name: ""
            });
            toast.success("Successfully Added", {onClose: () => props.handleClose()});
            return setOpenAlertSuccess(true);
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
              id="codeInput"
              label="Code"
              name="code"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.code || ""}
              inputRef={codeRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.code.error ? formErrors.code.msg : null
              }
              error={formErrors.code.error}
            />
          </Grid>
        
          <Grid item xs={12} sm={6}>
            <TextField
              id="nameInput"
              label="Name"
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
