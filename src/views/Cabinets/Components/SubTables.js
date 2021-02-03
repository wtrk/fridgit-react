import React, { Fragment, useState, useRef, useEffect} from "react";
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
    const snRef = useRef()
    const typeRef = useRef()
    const manufactureRef = useRef()
    const clientRef = useRef()
    const days_to_prevRef = useRef()
    const prev_statusRef = useRef()
    const financeRef = useRef()
    const cityRef = useRef()
    const areaRef = useRef()
    const mobileRef = useRef()
    const statusRef = useRef()
    const submitRef = useRef()
    const [formLocationValues, setFormLocationValues] = useState({
        city_id: "",
        area: "",
        mobile: ""
    });
    const [formValues, setFormValues] = useState({
      sn: "",
      type: "",
      manufacture: "",
      client: "",
      days_to_prev: "",
      prev_status: "",
      finance: "",
      location: {...formLocationValues},
      status: "",
      is_new: false,
      booked: true,
    });
    const [formErrors, setFormErrors] = useState({
      sn: {error:false,msg:""},
      type: {error:false,msg:""},
      manufacture: {error:false,msg:""},
      client: {error:false,msg:""},
      days_to_prev: {error:false,msg:""},
      prev_status: {error:false,msg:""},
      finance: {error:false,msg:""},
      location: {
        city_id: {error:false,msg:""},
        area:{error:false,msg:""},
        mobile: {error:false,msg:""},
      },
      status: {error:false,msg:""},
    });
    
  useEffect(()=>{
    snRef.current.focus()
      const fetchData = async () => {
        if (props.cabinetId) {
          const cabinet = await axios(
            `${process.env.REACT_APP_BASE_URL}/cabinets/${props.cabinetId}`,
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
        case "sn": typeRef.current.focus();break;
        case "type": manufactureRef.current.focus();break;
        case "manufacture": clientRef.current.focus();break;
        case "client": days_to_prevRef.current.focus();break;
        case "days_to_prev": prev_statusRef.current.focus();break;
        case "prev_status": financeRef.current.focus();break;
        case "finance": cityRef.current.focus();break;
        case "city_id": areaRef.current.focus();break;
        case "area": mobileRef.current.focus();break;
        case "mobile": statusRef.current.focus();break;
        case "status": submitRef.current.focus();break;
        default: snRef.current.focus();
      }
    }
}
const handleChangeCheckbox = (e) => {
  const { name, checked } = e.target;
  setFormValues({ ...formValues, [name]: checked ? 1 : 0 });
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
  
  if (props.cabinetId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/${props.cabinetId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        sn: "",
        type: "",
        manufacture: "",
        client: "",
        days_to_prev: "",
        prev_status: "",
        finance: "",
        location: {
          city_id: "",
          area:"",
          mobile: "",
        },
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
          The cabinet is successfully created
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
              id="snInput"
              label="SN"
              name="sn"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.sn || ""}
              inputRef={snRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.sn.error ? formErrors.sn.msg : null}
              error={formErrors.sn.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="typeInput"
              label="Type"
              name="type"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.type || ""}
              inputRef={typeRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.type.error ? formErrors.type.msg : null}
              error={formErrors.type.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              id="manufactureInput"
              label="Manufacture"
              name="manufacture"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.manufacture || ""}
              inputRef={manufactureRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.manufacture.error ? formErrors.manufacture.msg : null}
              error={formErrors.manufacture.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="clientInput"
              label="Client"
              name="client"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.client || ""}
              inputRef={clientRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.client.error ? formErrors.client.msg : null}
              error={formErrors.client.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              id="days_to_prevInput"
              label="Days to Prev"
              name="days_to_prev"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.days_to_prev || ""}
              inputRef={days_to_prevRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.days_to_prev.error ? formErrors.days_to_prev.msg : null}
              error={formErrors.days_to_prev.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="prev_statusInput"
              label="Prev Status"
              name="prev_status"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.prev_status || ""}
              inputRef={prev_statusRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.prev_status.error ? formErrors.prev_status.msg : null}
              error={formErrors.prev_status.error}
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
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.is_new ? true : false}
                  onChange={handleChangeCheckbox}
                  name="is_new"
                  color="primary"
                />
              }
              label="Is New"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.booked ? true : false}
                  onChange={handleChangeCheckbox}
                  name="booked"
                  color="primary"
                />
              }
              label="Booked"
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
