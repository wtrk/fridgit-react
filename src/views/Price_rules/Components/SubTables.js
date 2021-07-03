import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,
  Switch,
  CircularProgress
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import moment from "react-moment";
import {Alert,Autocomplete} from '@material-ui/lab';
import MUIDataTable from "mui-datatables";
import GroupAllNested from "./GroupAllNested.js";

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
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [serviceTypeValue, setServiceTypeValue] = useState({});

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const [citiesIn, setCitiesIn] = useState([]);
    const [neighbourhoodsIn, setNeighbourhoodsIn] = useState([]);
    const [tiersIn, setTiersIn] = useState([]);
    const [citiesOut, setCitiesOut] = useState([]);
    const [neighbourhoodsOut, setNeighbourhoodsOut] = useState([]);
    const [tiersOut, setTiersOut] = useState([]);
    const [operations, setOperations] = useState([]);

    const classes = useStyles(); //custom css
    const priorityRef = useRef()
    const nameRef = useRef()
    const promise_dayRef = useRef()
    const serviceRef = useRef()
    const activeRef = useRef()
    const handling_inRef = useRef()
    const storageRef = useRef()
    const in_house_preventive_maintenanceRef = useRef()
    const corrective_service_in_houseRef = useRef()
    const cabinet_testing_feesRef = useRef()
    const branding_feesRef = useRef()
    const dropRef = useRef()
    const transp_cbmRef = useRef()
    const transp_for_1_unitRef = useRef()
    const min_chargeRef = useRef()
    const preventive_maintenanceRef = useRef()
    const exchange_corrective_reactionRef = useRef()
    const corrective_reactionRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      priority: "",
      name: "",
      promise_day: "",
      service: "",
      active: "",
      handling_in: "",
      storage: "",
      in_house_preventive_maintenance: "",
      corrective_service_in_house: "",
      cabinet_testing_fees: "",
      branding_fees: "",
      drop: "",
      transp_cbm: "",
      transp_for_1_unit: "",
      min_charge: "",
      preventive_maintenance: "",
      exchange_corrective_reaction: "",
      corrective_reaction: ""
    });
    const [formErrors, setFormErrors] = useState({
      priority: {error:false,msg:""},
      name: {error:false,msg:""},
      promise_day: {error:false,msg:""},
      service: {error:false,msg:""},
    });
    
  useEffect(()=>{
      const fetchData = async () => {
        if (props.priceRuleId) {
          const priceRule = await axios(
            `${process.env.REACT_APP_BASE_URL}/priceRules/${props.priceRuleId}`,
            {responseType: "json"}
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setClients(response.clients);
            setCountries(response.countries);
            setCitiesIn(response.citiesIn);
            setNeighbourhoodsIn(response.neighbourhoodsIn);
            setTiersIn(response.tiersIn);
            setCitiesOut(response.citiesOut);
            setNeighbourhoodsOut(response.neighbourhoodsOut);
            setTiersOut(response.tiersOut);
            setOperations(response.operations);
            setServiceTypeValue(props.serviceTypesList.filter(e=> e._id==response.service)[0])

          });
        }
        setIsLoading(false);
      };
      fetchData();
  },[])

  
  useEffect(()=>{
    setFormValues({ ...formValues,clients })
  },[clients])
  
  useEffect(()=>{
    setFormValues({ ...formValues,countries })
  },[countries])

  useEffect(()=>{
    setFormValues({ ...formValues, citiesIn })
  },[citiesIn])
  
  useEffect(()=>{
    setFormValues({ ...formValues,neighbourhoodsIn })
  },[neighbourhoodsIn])
  
  useEffect(()=>{
    setFormValues({ ...formValues,tiersIn })
  },[tiersIn])

  useEffect(()=>{
    setFormValues({ ...formValues, citiesOut })
  },[citiesOut])
  
  useEffect(()=>{
    setFormValues({ ...formValues,neighbourhoodsOut })
  },[neighbourhoodsOut])
  
  useEffect(()=>{
    setFormValues({ ...formValues,tiersOut })
  },[tiersOut])
  
  useEffect(()=>{
    setFormValues({ ...formValues,operations })
  },[operations])

  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "priority": nameRef.current.focus();break;
        case "name": promise_dayRef.current.focus();break;
        case "promise_day": serviceRef.current.focus();break;
        case "service": activeRef.current.focus();break;
        case "active": handling_inRef.current.focus();break;
        case "handling_in": storageRef.current.focus();break;
        case "storage": in_house_preventive_maintenanceRef.current.focus();break;
        case "in_house_preventive_maintenance": corrective_service_in_houseRef.current.focus();break;
        case "corrective_service_in_house": cabinet_testing_feesRef.current.focus();break;
        case "cabinet_testing_fees": branding_feesRef.current.focus();break;
        case "branding_fees": dropRef.current.focus();break;
        case "drop": transp_cbmRef.current.focus();break;
        case "transp_cbm": transp_for_1_unitRef.current.focus();break;
        case "transp_for_1_unit": min_chargeRef.current.focus();break;
        case "min_charge": preventive_maintenanceRef.current.focus();break;
        case "preventive_maintenance": exchange_corrective_reactionRef.current.focus();break;
        case "exchange_corrective_reaction": corrective_reactionRef.current.focus();break;
        case "corrective_reaction": submitRef.current.focus();break;
        default: priorityRef.current.focus();
      }
    }
}

const handleChangeServiceType = (e, newValue) =>{
  setServiceTypeValue(newValue)
  if(newValue) setFormValues({ ...formValues, service: newValue._id });
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeSwitch = (e) => {
  const { name, checked } = e.target;
  const value=checked===true ? 1 : 0;
  setFormValues({ ...formValues, [name]: value });
};
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
  if (props.priceRuleId&&props.actionDialog==="Edit") {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules/${props.priceRuleId}`,
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
    delete formValues._id
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        promise_day: "",
        priority: "",
        service: "",
        active: "",
        handling_in: "",
        storage: "",
        in_house_preventive_maintenance: "",
        corrective_service_in_house: "",
        cabinet_testing_fees: "",
        branding_fees: "",
        drop: "",
        transp_cbm: "",
        transp_for_1_unit: "",
        min_charge: "",
        preventive_maintenance: "",
        exchange_corrective_reaction: "",
        corrective_reaction: ""
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
            {props.actionDialog==="edit"?"Edit Price Rule":"Add Price Rule"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Collapse in={openAlertSuccess}>
        <Alert severity="success" onClick={() => setOpenAlertSuccess(false)}>
          The Price Rule is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>
      {!isLoading ? (
        <div style={{ padding: "10px 30px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="priorityInput"
                label="Priority"
                name="priority"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.priority || ""}
                inputRef={priorityRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={formErrors.priority.error ? formErrors.priority.msg : null}
                error={formErrors.priority.error}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <TextField
                id="promise_dayInput"
                label="Promise Day"
                name="promise_day"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.promise_day || ""}
                inputRef={promise_dayRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={formErrors.promise_day.error ? formErrors.promise_day.msg : null}
                error={formErrors.promise_day.error}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                id="serviceTypeInput"
                options={props.serviceTypesList || {}}
                value={serviceTypeValue || {}}
                getOptionLabel={(option) => {
                  return Object.keys(option).length !== 0 ? option.name : "";
                }}
                fullWidth
                onChange={handleChangeServiceType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service Type"
                    inputRef={serviceRef}
                    onKeyDown={keyPressHandler}
                    onBlur={validateInputHandler}
                    helperText={
                      formErrors.service.error ? formErrors.service.msg : null
                    }
                    error={formErrors.service.error}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              Active: <Switch
                checked={formValues.active == 1 ? true : false}
                color="primary"
                name="active"
                inputRef={corrective_service_in_houseRef}
                inputProps={{ "aria-label": "primary checkbox" }}
                onChange={handleChangeSwitch}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Job Fees</h3>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="handling_inInput"
                label="Handling IN / OUT ($)"
                name="handling_in"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.handling_in || ""}
                inputRef={handling_inRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="storageInput"
                label="Storage/CBM/DAY ($)"
                name="storage"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.storage || ""}
                inputRef={storageRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="in_house_preventive_maintenanceInput"
                label="In House Preventive Maintenance ($)"
                name="in_house_preventive_maintenance"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.in_house_preventive_maintenance || ""}
                inputRef={in_house_preventive_maintenanceRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="corrective_service_in_houseInput"
                label="Corrective Service In House ($)"
                name="corrective_service_in_house"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.corrective_service_in_house || ""}
                inputRef={corrective_service_in_houseRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="cabinet_testing_feesInput"
                label="Cabinet Testing Fees"
                name="cabinet_testing_fees"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.cabinet_testing_fees || ""}
                inputRef={cabinet_testing_feesRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="branding_feesInput"
                label="Branding Fees/m2"
                name="branding_fees"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.branding_fees || ""}
                inputRef={branding_feesRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                id="dropInput"
                label="Drop"
                name="drop"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.drop || ""}
                inputRef={dropRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Transportation Fees</h3>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="transp_cbmInput"
                label="Transp./CBM"
                name="transp_cbm"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.transp_cbm || ""}
                inputRef={transp_cbmRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="transp_for_1_unitInput"
                label="Transp. for 1 Unit"
                name="transp_for_1_unit"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.transp_for_1_unit || ""}
                inputRef={transp_for_1_unitRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="min_chargeInput"
                label="Min Charge"
                name="min_charge"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.min_charge || ""}
                inputRef={min_chargeRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="preventive_maintenanceInput"
                label="Preventive Maintenance"
                name="preventive_maintenance"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.preventive_maintenance || ""}
                inputRef={preventive_maintenanceRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="exchange_corrective_reactionInput"
                label="Exchange Corrective Reaction"
                name="exchange_corrective_reaction"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.exchange_corrective_reaction || ""}
                inputRef={exchange_corrective_reactionRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                id="corrective_reactionInput"
                label="Corrective Reaction"
                name="corrective_reaction"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.corrective_reaction || ""}
                inputRef={corrective_reactionRef}
                onKeyDown={keyPressHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Conditions</h3>
            </Grid>

            <GroupAllNested
              arrayNames={{
                clients,
                countries,
                citiesIn,
                citiesOut,
                neighbourhoodsIn,
                neighbourhoodsOut,
                tiersIn,
                tiersOut,
                operations,
              }}
              setArrayNames={{
                setClients,
                setCountries,
                setCitiesIn,
                setCitiesOut,
                setNeighbourhoodsIn,
                setNeighbourhoodsOut,
                setTiersIn,
                setTiersOut,
                setOperations,
              }}
            />
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
      ) : (
        <CircularProgress size={30} className="pageLoader" />
      )}
    </Fragment>
  );
};

export default SubTables;
