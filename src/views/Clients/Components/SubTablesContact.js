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
  const nameRef = useRef()
  const phoneRef = useRef()
  const addressRef = useRef()
  const emailRef = useRef()
  const positionRef = useRef()
  const submitRef = useRef()
  const [updated, setUpdated] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    position: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: {error:false,msg:""},
    phone: {error:false,msg:""},
    address: {error:false,msg:""},
    email: {error:false,msg:""},
    position: {error:false,msg:""}
  });
  useEffect(()=>{
    nameRef.current.focus()
  },[])
  const keyPressHandler = (e) => {
      const { keyCode, target } = e
      if(keyCode===13){
        switch (target.name){
          case "name": phoneRef.current.focus();break;
          case "phone": addressRef.current.focus();break;
          case "address": emailRef.current.focus();break;
          case "email": positionRef.current.focus();break;
          case "position": submitRef.current.focus();break;
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
    for (const [key, value] of Object.entries(formErrors)) {
        if(value.error===true) return toast.error("Please validate the Form and submit it again");
    }
    props.dataContacts.map(e=>{
      delete e._id
    })
    props.setDataContacts([...props.dataContacts,formValues])
    setUpdated(true)

  }
  
  useEffect(()=>{
    if(updated===true){
      const fetchData = async () => {
        await axios({
          method: "PUT",
          url: `${process.env.REACT_APP_BASE_URL}/clients/${props.clientId}`,
          headers: {Authorization: `Bearer ${token}`},
          data: {"contacts": props.dataContacts}
        })
        .then(function (response) {
          setFormValues({
            name: "",
            phone: "",
            address: "",
            email: "",
            position: ""
          });
          toast.success("Successfully Updated", {onClose: () => props.handleClose()});
          return setOpenAlertSuccess(true);
        })
          .catch((error) => {
            console.log(error);
          });
      };
      fetchData();
    }
    },[props.dataContacts])



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
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="phoneInput"
            label="Phone"
            name="phone"
            value={formValues.phone || ""}
            onChange={handleChangeForm}
            fullWidth
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
            id="addressInput"
            label="Address"
            name="address"
            value={formValues.address || ""}
            onChange={handleChangeForm}
            fullWidth
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
            id="emailInput"
            label="Email"
            name="email"
            value={formValues.email || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={emailRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.email.error ? formErrors.email.msg : null
            }
            error={formErrors.email.error}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="positionInput"
            label="Position"
            name="position"
            value={formValues.position || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={positionRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.position.error ? formErrors.position.msg : null
            }
            error={formErrors.position.error}
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
