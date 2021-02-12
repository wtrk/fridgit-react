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
    const [clientValue, setClientValue] = useState({});
    const [fridgesTypeValue, setfridgesTypeValue] = useState({});
    const [cityValue, setCityValue] = useState({});
    const [neighbourhoodValue, setNeighbourhoodValue] = useState({});
    const classes = useStyles(); //custom css
    const snRef = useRef()
    const typeRef = useRef()
    const clientRef = useRef()
    const cityRef = useRef()
    const neighbourhoodRef = useRef()
    const areaRef = useRef()
    const mobileRef = useRef()
    const submitRef = useRef()
    const [formLocationValues, setFormLocationValues] = useState({
      city_id: "",
      neighbourhood_id: "",
        area: "",
        mobile: ""
    });
    const [formValues, setFormValues] = useState({
      sn: "",
      type: "",
      client: "",
      location: {...formLocationValues},
      is_new: false
    });
    const [formErrors, setFormErrors] = useState({
      sn: {error:false,msg:""},
      type: {error:false,msg:""},
      client: {error:false,msg:""},
      location: {
        city_id: {error:false,msg:""},
        neighbourhood_id: {error:false,msg:""},
        area:{error:false,msg:""},
        mobile: {error:false,msg:""},
      },
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
            setNeighbourhoodValue(props.neighbourhoodsList.filter(e=> e._id==response.location.neighbourhood_id)[0])
            setClientValue(props.clientsList.filter(e=> e._id==response.client)[0])
            setfridgesTypeValue(props.fridgesTypesList.filter(e=> e._id==response.type)[0])
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
        case "type": clientRef.current.focus();break;
        case "client": cityRef.current.focus();break;
        case "city_id": areaRef.current.focus();break;
        case "neighbourhood_id": areaRef.current.focus();break;
        case "area": mobileRef.current.focus();break;
        case "mobile": submitRef.current.focus();break;
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
const handleChangeNeighbourhood = (e, newValue) =>{
  setNeighbourhoodValue(newValue)
  if(newValue) setFormLocationValues({ ...formLocationValues, neighbourhood_id: newValue._id });
}
const handleChangeClient = (e, newValue) =>{
  setClientValue(newValue)
  if(newValue) setFormValues({ ...formValues, client: newValue._id });
}
const handleChangeFridgesType = (e, newValue) =>{
  setfridgesTypeValue(newValue)
  if(newValue) setFormValues({ ...formValues, type: newValue._id });
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
        client: "",
        location: {
          city_id: "",
          neighbourhood_id: "",
          area:"",
          mobile: "",
        },
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
            <Autocomplete
              id="fridgesTypeInput"
              options={props.fridgesTypesList || {}}
              value={fridgesTypeValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.refrigerant_type : "";
              }}
              fullWidth
              onChange={handleChangeFridgesType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fridges Type"
                  inputRef={typeRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.type.error ? formErrors.type.msg : null
                  }
                  error={formErrors.type.error}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="ClientInput"
              options={props.clientsList || {}}
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
                    formErrors.client.error ? formErrors.client.msg : null
                  }
                  error={formErrors.client.error}
                />
              )}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.is_new ? true : false}
                  onChange={handleChangeCheckbox}
                  name="is_new"
                  color="primary"
                />
              }
              label="Is Received New"
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
