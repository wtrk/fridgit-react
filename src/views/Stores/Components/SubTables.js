import React, { Fragment, useState, useRef, useEffect} from "react";
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
import { Close,Save } from "@material-ui/icons";
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
    }
  }));
const SubTables = (props) => {
  const token = getCookie('token');
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [cityValue, setCityValue] = useState({});
    const [neighbourhoodValue, setNeighbourhoodValue] = useState({});
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const branchRef = useRef()
    const branchNumberRef = useRef()
    const cityRef = useRef()
    const neighbourhoodRef = useRef()
    const mobileRef = useRef()
    const financeRef = useRef()
    const statusRef = useRef()
    const submitRef = useRef()
    const [formLocationValues, setFormLocationValues] = useState({
      city_id: "",
      neighbourhood_id: "",
      mobile: ""
    });
    const [formValues, setFormValues] = useState({
      code: "",
      name: "",
      branch: "",
      branch_number: "",
      location: {...formLocationValues},
      finance: "",
      status: "",
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      branch: {error:false,msg:""},
      branch_number: {error:false,msg:""},
      location: {
        city_id: {error:false,msg:""},
        neighbourhood_id: {error:false,msg:""},
        mobile: {error:false,msg:""},
      },
      finance: {error:false,msg:""},
      status: {error:false,msg:""},
    });
    
  useEffect(()=>{
    codeRef.current.focus()
      const fetchData = async () => {
        if (props.storeId) {
          const store = await axios(
            `${process.env.REACT_APP_BASE_URL}/stores/${props.storeId}`,
            {
              responseType: "json", headers: {Authorization: `Bearer ${token}`},
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setCityValue(response.location&&props.citiesList.filter(e=> e._id==response.location.city_id)[0])
            setNeighbourhoodValue(response.location&&props.neighbourhoodsList.filter(e=> e._id==response.location.neighbourhood_id)[0])
            setFormLocationValues(response.location&&response.location)
          });
        }
      };
      fetchData();
  },[])
  useEffect(()=>{
    setFormValues({
      ...formValues,
      location: formLocationValues,
    });
  },[formLocationValues])
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "code": nameRef.current.focus();break;
        case "name": branchRef.current.focus();break;
        case "branch": branchNumberRef.current.focus();break;
        case "branch_number": cityRef.current.focus();break;
        case "city_id": neighbourhoodRef.current.focus();break;
        case "neighbourhood_id": mobileRef.current.focus();break;
        case "mobile": financeRef.current.focus();break;
        case "finance": statusRef.current.focus();break;
        case "status": submitRef.current.focus();break;
        default: codeRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeCity = (e, newValue) =>{
  setCityValue(newValue)
  if(newValue) setFormLocationValues({ ...formLocationValues, city_id: newValue._id });
}
const handleChangeNeighbourhood = (e, newValue) =>{
  setNeighbourhoodValue(newValue)
  if(newValue) setFormLocationValues({ ...formLocationValues, neighbourhood_id: newValue._id });
}
const handleChangeLocation = (e) => {
  const { name, value } = e.target;
  setFormLocationValues({ ...formLocationValues, [name]: value});
};
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  if (props.storeId) {
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/stores/${props.storeId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/stores/`,
      headers: {Authorization: `Bearer ${token}`},
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        code: "",
        name: "",
        branch: "",
        branch_number: "",
        location: {
          city_id: "",
          neighbourhood_id: "",
          mobile: "",
        },
        finance: "",
        status: "",
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
          The store is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>

      <div style={{ padding: "10px 30px" }}>
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
              helperText={formErrors.code.error ? formErrors.code.msg : null}
              error={formErrors.code.error}
            />
          </Grid>
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
            <TextField
              id="branchInput"
              label="Branch"
              name="branch"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.branch || ""}
              inputRef={branchRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.branch.error ? formErrors.branch.msg : null}
              error={formErrors.branch.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="branchNumberInput"
              label="Branch Number"
              name="branch_number"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.branch_number || ""}
              inputRef={branchNumberRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.branch_number.error ? formErrors.branch_number.msg : null}
              error={formErrors.branch_number.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="CityInput"
              options={props.citiesList || {}}
              value={cityValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeCity}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  inputRef={cityRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.location.city_id.error ? formErrors.location.city_id.msg : null
                  }
                  error={formErrors.location.city_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="neighbourhoodInput"
              options={props.neighbourhoodsList || {}}
              value={neighbourhoodValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeNeighbourhood}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Neighbourhood"
                  inputRef={neighbourhoodRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.location.neighbourhood_id.error ? formErrors.location.neighbourhood_id.msg : null
                  }
                  error={formErrors.location.neighbourhood_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="mobileInput"
              label="Mobile Number"
              name="mobile"
              onChange={handleChangeLocation}
              fullWidth
              value={formLocationValues?formLocationValues.mobile:""}
              inputRef={mobileRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.location.mobile.error ? formErrors.location.mobile.msg : null}
              error={formErrors.location.mobile.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              id="financeInput"
              label="Finance"
              name="finance"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.finance || ""}
              inputRef={financeRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.finance.error ? formErrors.finance.msg : null}
              error={formErrors.finance.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="statusInput"
              label="Status"
              name="status"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.status || ""}
              inputRef={statusRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.status.error ? formErrors.status.msg : null}
              error={formErrors.status.error}
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
