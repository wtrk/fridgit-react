import React, { useRef,useEffect,useState } from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@material-ui/core";
import axios from 'axios';
import { Close, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {Autocomplete, Alert} from '@material-ui/lab';
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
  const [userType, setUserType] = useState([]);
  const [clientsList, setClientsList] = useState([]); //Clients list from db
  const [clientValue, setClientValue] = useState({}); //Chosen Client
  const [clientDisabled, setClientDisabled] = useState(true);

  const classes = useStyles(); //custom css
  const nameRef = useRef()
  const profileRef = useRef()
  const addressRef = useRef()
  const mobileRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const usernameRef = useRef()
  const clientRef = useRef()
  const submitRef = useRef()
  const [formValues, setFormValues] = useState({
    name: "",
    profile_id: "",
    address: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    receive_email: "",
    usertype_id:"",
    can_change:"",
    can_approve:"",
    can_approve_maintenance:"",
    can_approve_damaged:"",
    client_id:""
  });
  const [formErrors, setFormErrors] = useState({
    name: {error:false,msg:""},
    profile_id: {error:false,msg:""},
    address: {error:false,msg:""},
    mobile: {error:false,msg:""},
    email: {error:false,msg:""},
    username: {error:false,msg:""},
    password: {error:false,msg:""},
    client_id: {error:false,msg:""}
  });
  useEffect(()=>{
    nameRef.current.focus()

    const fetchData = async () => {
      nameRef.current.focus();
      const clients = await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setClientsList(response.data);
        return response.data;
      });
      const userType = await axios(
        `${process.env.REACT_APP_BASE_URL}/userType`,
        {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }
      ).then((response) => {
        setUserType(response.data);
      });
      
      
    if (props.userId) {
        const users = await axios(
          `${process.env.REACT_APP_BASE_URL}/users/${props.userId}`,
          {
            responseType: "json", headers: {Authorization: `Bearer ${token}`},
          }
        ).then((response) => {
          setFormValues(response.data);
          return response.data
        }).then((response) => {
          if (props.userId) {
          setClientValue(
            clients.filter((e) => e._id == response.client_id)[0]
          );
          }
        })
      }
    };
    fetchData();
  },[])
  //When userType is client enable client field... else disble it
  useEffect(()=>{
    if(formValues.usertype_id==="6010209ab93b480ee05bff81"){
      setClientDisabled(false)
    }else{
      setClientDisabled(true)
      setClientValue({});
      setFormValues({ ...formValues, client_id: "" });
    }
  },[formValues.usertype_id])

  const keyPressHandler = (e) => {
      const { keyCode, target } = e
      if(keyCode===13){
        switch (target.name){
          case "name": profileRef.current.focus();break;
          case "profile_id": addressRef.current.focus();break;
          case "address": mobileRef.current.focus();break;
          case "mobile": emailRef.current.focus();break;
          case "email": usernameRef.current.focus();break;
          case "username": passwordRef.current.focus();break;
          case "password": submitRef.current.focus();break;
          default: nameRef.current.focus();
        }
      }
  }
  const handleChangeClient = (e, newValue) =>{
    setClientValue(newValue)
    if(newValue) setFormValues({ ...formValues, client_id: newValue._id });
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
        url: `${process.env.REACT_APP_BASE_URL}/users/${props.userId}`,
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
          url: `${process.env.REACT_APP_BASE_URL}/users/`,
          headers: {Authorization: `Bearer ${token}`},
          data: [formValues],
        })
          .then(function (response) {
            setOpenAlertSuccess(true);
            setFormValues({
              name: "",
              profile_id: "",
              address: "",
              mobile: "",
              email: "",
              username: "",
              password: "",
              client_id: "",
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
    <>
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
          The user is successfully created
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
              helperText={formErrors.name.error ? formErrors.name.msg : null}
              error={formErrors.name.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              className={classes.formControl}
              error={formErrors.profile_id.error}
            >
              <InputLabel id="ProfileLabel">Profile</InputLabel>
              <Select
                labelId="ProfileLabel"
                id="ProfileInput"
                value={formValues.profile_id}
                name="profile_id"
                onChange={handleChangeForm}
                inputRef={profileRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
              >
                {props.userProfileList.map((e) => (
                  <MenuItem value={e._id} key={e._id}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.profile_id.error ? (
                <FormHelperText>{formErrors.profile_id.msg}</FormHelperText>
              ) : null}
            </FormControl>
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
              id="mobileInput"
              label="Mobile"
              name="mobile"
              value={formValues.mobile || ""}
              onChange={handleChangeForm}
              fullWidth
              inputRef={mobileRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.mobile.error ? formErrors.mobile.msg : null
              }
              error={formErrors.mobile.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="usernameInput"
              label="Username"
              name="username"
              value={formValues.username || ""}
              onChange={handleChangeForm}
              fullWidth
              inputRef={usernameRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.username.error ? formErrors.username.msg : null
              }
              error={formErrors.username.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="password"
              id="passwordInput"
              label="Password"
              name="password"
              value={formValues.password || ""}
              onChange={handleChangeForm}
              fullWidth
              inputRef={passwordRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.password.error ? formErrors.password.msg : null
              }
              error={formErrors.password.error}
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
              helperText={formErrors.email.error ? formErrors.email.msg : null}
              error={formErrors.email.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.receive_email ? true : false}
                  onChange={handleChangeCheckbox}
                  name="receive_email"
                  color="primary"
                />
              }
              label="Receive Email"
            />
          </Grid>
          <Grid item xs={12}>
            <div>User type: </div>
            <RadioGroup
              row
              aria-label="usertype"
              name="usertype_id"
              value={formValues.usertype_id || ""}
              onChange={handleChangeForm}
            >
              {userType.map((e) => 
                <FormControlLabel
                  key={e._id}
                  value={e._id}
                  control={<Radio color="primary" />}
                  label={e.name}
                  checked= {e._id===formValues.usertype_id ? true : false}
                />
              )}
            </RadioGroup>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.can_change ? true : false}
                  onChange={handleChangeCheckbox}
                  name="can_change"
                  color="primary"
                />
              }
              label="Can change to test"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.can_approve ? true : false}
                  onChange={handleChangeCheckbox}
                  name="can_approve"
                  color="primary"
                />
              }
              label="Can Approve"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.can_approve_maintenance ? true : false}
                  onChange={handleChangeCheckbox}
                  name="can_approve_maintenance"
                  color="primary"
                />
              }
              label="Recieve Can Approve Recommended Preventive Maintenance"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.can_approve_damaged ? true : false}
                  onChange={handleChangeCheckbox}
                  name="can_approve_damaged"
                  color="primary"
                />
              }
              label="Can Approve Damaged Fridges"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              disabled={clientDisabled}
              id="ClientInput"
              options={clientsList || {}}
              value={clientValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeClient}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  inputRef={clientRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.client_id.error ? formErrors.client_id.msg : null
                  }
                  error={formErrors.client_id.error}
                />
              )}
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
    </>
  );
};

export default AddFormDialog;
