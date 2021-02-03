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
import CustomToolbar from "CustomToolbar";
import {Autocomplete, Alert} from '@material-ui/lab';
import MUIDataTable from "mui-datatables";
import NestedTable from "./NestedTable.js";

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

    const [customers, setCustomers] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [citiesIn, setCitiesIn] = useState([]);
    const [isLoadingCitiesIn, setIsLoadingCitiesIn] = useState(true);
    const [neighbourhoodsIn, setNeighbourhoodsIn] = useState([]);
    const [isLoadingNeighbourhoodsIn, setIsLoadingNeighbourhoodsIn] = useState(true);
    const [tiersIn, setTiersIn] = useState([]);
    const [isLoadingTiersIn, setIsLoadingTiersIn] = useState(true);
    const [citiesOut, setCitiesOut] = useState([]);
    const [isLoadingCitiesOut, setIsLoadingCitiesOut] = useState(true);
    const [neighbourhoodsOut, setNeighbourhoodsOut] = useState([]);
    const [isLoadingNeighbourhoodsOut, setIsLoadingNeighbourhoodsOut] = useState(true);
    const [tiersOut, setTiersOut] = useState([]);
    const [isLoadingTiersOut, setIsLoadingTiersOut] = useState(true);

    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const serviceRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      service: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      service: {error:false,msg:""}
    });
    
  useEffect(()=>{
    nameRef.current.focus()
      const fetchData = async () => {
        if (props.priceRuleId) {
          const priceRule = await axios(
            `${process.env.REACT_APP_BASE_URL}/priceRules/${props.priceRuleId}`,
            {
              responseType: "json",
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setCustomers(response.customers);
            setCountries(response.countries);
            setCitiesIn(response.citiesIn);
            setNeighbourhoodsIn(response.neighbourhoodsIn);
            setTiersIn(response.tiersIn);
            setCitiesOut(response.citiesOut);
            setNeighbourhoodsOut(response.neighbourhoodsOut);
            setTiersOut(response.tiersOut);

            setIsLoadingCustomers(false);
            setIsLoadingCountries(false);
            setIsLoadingCitiesIn(false);
            setIsLoadingNeighbourhoodsIn(false);
            setIsLoadingTiersIn(false);
            setIsLoadingCitiesOut(false);
            setIsLoadingNeighbourhoodsOut(false);
            setIsLoadingTiersOut(false);
          });
        }
      };
      fetchData();
  },[])

  
  useEffect(()=>{
    setFormValues({ ...formValues,customers })
  },[customers])
  
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

  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "name": serviceRef.current.focus();break;
        case "service": submitRef.current.focus();break;
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
      if(value.error===true) return setOpenAlertError(true);
  }
  
  if (props.priceRuleId) {
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
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        service: ""
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
          The priceRule is successfully created
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
              id="serviceInput"
              label="Service"
              name="service"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.service || ""}
              inputRef={serviceRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.service.error ? formErrors.service.msg : null}
              error={formErrors.service.error}
            />
          </Grid>
          
          <Grid item xs={12}>
            <NestedTable arrayName={customers} setArrayName={setCustomers} tblTitle="Customers" isLoading={isLoadingCustomers} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={countries} setArrayName={setCountries} tblTitle="Countries" isLoading={isLoadingCountries} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={citiesIn} setArrayName={setCitiesIn} tblTitle="CitiesIn" isLoading={isLoadingCitiesIn} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={citiesOut} setArrayName={setCitiesOut} tblTitle="CitiesOut" isLoading={isLoadingCitiesOut} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={neighbourhoodsIn} setArrayName={setNeighbourhoodsIn} tblTitle="NeighbourhoodsIn" isLoading={isLoadingNeighbourhoodsIn} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={neighbourhoodsOut} setArrayName={setNeighbourhoodsOut} tblTitle="NeighbourhoodsOut" isLoading={isLoadingNeighbourhoodsOut} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={tiersIn} setArrayName={setTiersIn} tblTitle="Tiers In" isLoading={isLoadingTiersIn} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={tiersOut} setArrayName={setTiersOut} tblTitle="Tiers Out" isLoading={isLoadingTiersOut} />
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
