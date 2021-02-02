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
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [cityValue, setCityValue] = useState({}); //table items
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const branchRef = useRef()
    const branchNumberRef = useRef()
    const cityRef = useRef()
    const areaRef = useRef()
    const mobileRef = useRef()
    const financeRef = useRef()
    const statusRef = useRef()
    const submitRef = useRef()
    const [formLocationValues, setFormLocationValues] = useState({
        city_id: "",
        area: "",
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
        area:{error:false,msg:""},
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
              responseType: "json",
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setCityValue(props.citiesList.filter(e=> e._id==response.location.city_id)[0])
            setFormLocationValues(response.location)
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
        case "city_id": areaRef.current.focus();break;
        case "area": mobileRef.current.focus();break;
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
const handleChangeLocation = (e) => {
  const { name, value } = e.target;
  setFormLocationValues({ ...formLocationValues, [name]: value});
};
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
  
  if (props.storeId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/stores/${props.storeId}`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      props.handleClose()
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/stores/`,
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
          area:"",
          mobile: "",
        },
        finance: "",
        status: "",
      });
      props.handleClose()
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
                  label="Cities"
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
            <TextField
              id="areaInput"
              label="Area"
              name="area"
              onChange={handleChangeLocation}
              fullWidth
              value={formLocationValues.area || ""}
              inputRef={areaRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.location.area.error ? formErrors.location.area.msg : null}
              error={formErrors.location.area.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="mobileInput"
              label="Mobile Number"
              name="mobile"
              onChange={handleChangeLocation}
              fullWidth
              value={formLocationValues.mobile || ""}
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
