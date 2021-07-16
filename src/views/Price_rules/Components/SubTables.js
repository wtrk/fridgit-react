import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Toolbar,
  Collapse,
  Switch,
  CircularProgress
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {Alert,Autocomplete} from '@material-ui/lab';
import { getCookie } from 'components/auth/Helpers';
import NestedTable from "./NestedTable.js";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit, watch } = useForm();
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
      service: "",
      active: ""
    });
    
  useEffect(()=>{
      const fetchData = async () => {
        if (props.priceRuleId) {
          const priceRule = await axios(
            `${process.env.REACT_APP_BASE_URL}/priceRules/${props.priceRuleId}`,
            {responseType: "json", headers: {Authorization: `Bearer ${token}`}}
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
const handleChangeSwitch = (e) => {
  const { name, checked } = e.target;
  const value=checked===true ? 1 : 0;
  setFormValues({ ...formValues, [name]: value });
};
const handleOnSubmitForm = async (data,e) => {
  const dataToSubmit = {...formValues,...data,clients,countries,citiesIn,neighbourhoodsIn,tiersIn,citiesOut,neighbourhoodsOut,tiersOut,operations}

  if (props.priceRuleId&&props.actionDialog==="Edit") {
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules/${props.priceRuleId}`,
      headers: {Authorization: `Bearer ${token}`},
      data: [dataToSubmit],
    })
    .then(function (response) {
      toast.success("Successfully Updated", {onClose: () => props.handleClose()});
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    delete formValues._id
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules`,
      headers: {Authorization: `Bearer ${token}`},
      data: [dataToSubmit],
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
      toast.success("Successfully Added", {onClose: () => props.handleClose()});
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
}
  return (
    <Fragment>
      <ToastContainer />
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
        <form onSubmit={handleSubmit(handleOnSubmitForm)}>
          <div className="row">
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <input type="number" className="form-control" name="priority" id="priority" placeholder="Priority"  ref={register} defaultValue={formValues.priority} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" name="name" id="name" placeholder="Name"  ref={register} defaultValue={formValues.name} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="promise_day">Promise Day</label>
                <input type="text" className="form-control" name="promise_day" id="promise_day" placeholder="Promise Day"  ref={register} defaultValue={formValues.promise_day} />
              </div>
            </div>
            <div className="col-sm-4">
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
                    />
                  )}
                />
            </div>
            <div className="col-sm-4">
              Active: <Switch
                checked={formValues.active == 1 ? true : false}
                color="primary"
                name="active"
                inputRef={corrective_service_in_houseRef}
                inputProps={{ "aria-label": "primary checkbox" }}
                onChange={handleChangeSwitch}
              />
            </div>
            
            <div className="col-12"><h3>Job Fees</h3></div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="handling_in">Handling IN / OUT ($)</label>
                <input type="text" className="form-control" name="handling_in" id="handling_in" placeholder="Handling IN / OUT ($)"  ref={register} defaultValue={formValues.handling_in} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="storage">Storage/CBM/DAY ($)</label>
                <input type="text" className="form-control" name="storage" id="storage" placeholder="Storage/CBM/DAY ($)"  ref={register} defaultValue={formValues.storage} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="in_house_preventive_maintenance">In House Preventive Maintenance ($)</label>
                <input type="text" className="form-control" name="in_house_preventive_maintenance" id="in_house_preventive_maintenance" placeholder="In House Preventive Maintenance ($)"  ref={register} defaultValue={formValues.in_house_preventive_maintenance} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="corrective_service_in_house">Corrective Service In House ($)</label>
                <input type="text" className="form-control" name="corrective_service_in_house" id="corrective_service_in_house" placeholder="Corrective Service In House ($)"  ref={register} defaultValue={formValues.corrective_service_in_house} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="cabinet_testing_fees">Cabinet Testing Fees</label>
                <input type="text" className="form-control" name="cabinet_testing_fees" id="cabinet_testing_fees" placeholder="Cabinet Testing Fees"  ref={register} defaultValue={formValues.cabinet_testing_fees} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="branding_fees">Branding Fees/m2</label>
                <input type="text" className="form-control" name="branding_fees" id="branding_fees" placeholder="Branding Fees/m2"  ref={register} defaultValue={formValues.branding_fees} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="drop">Drop</label>
                <input type="text" className="form-control" name="drop" id="drop" placeholder="Drop"  ref={register} defaultValue={formValues.drop} />
              </div>
            </div>
            
            <div className="col-12"><h3>Transportation Fees</h3></div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="transp_cbm">Transp./CBM</label>
                <input type="text" className="form-control" name="transp_cbm" id="transp_cbm" placeholder="Transp./CBM"  ref={register} defaultValue={formValues.transp_cbm} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="transp_for_1_unit">Transp. for 1 Unit</label>
                <input type="text" className="form-control" name="transp_for_1_unit" id="transp_for_1_unit" placeholder="Transp. for 1 Unit"  ref={register} defaultValue={formValues.transp_for_1_unit} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="min_charge">Min Charge</label>
                <input type="text" className="form-control" name="min_charge" id="min_charge" placeholder="Min Charge"  ref={register} defaultValue={formValues.min_charge} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="preventive_maintenance">Preventive Maintenance</label>
                <input type="text" className="form-control" name="preventive_maintenance" id="preventive_maintenance" placeholder="Preventive Maintenance"  ref={register} defaultValue={formValues.preventive_maintenance} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="exchange_corrective_reaction">Exchange Corrective Reaction</label>
                <input type="text" className="form-control" name="exchange_corrective_reaction" id="exchange_corrective_reaction" placeholder="Exchange Corrective Reaction"  ref={register} defaultValue={formValues.exchange_corrective_reaction} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="corrective_reaction">Corrective Reaction</label>
                <input type="text" className="form-control" name="corrective_reaction" id="corrective_reaction" placeholder="Corrective Reaction"  ref={register} defaultValue={formValues.corrective_reaction} />
              </div>
            </div>
            <div className="col-12"><h3>Conditions</h3></div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={clients} setArrayName={setClients} title="Clients" dbTable="clients" />
            </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={countries} setArrayName={setCountries} title="Countries" dbTable="countries" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={citiesIn} setArrayName={setCitiesIn} title="Cities In" dbTable="cities" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={citiesOut} setArrayName={setCitiesOut} title="Cities Out" dbTable="cities" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={neighbourhoodsIn} setArrayName={setNeighbourhoodsIn} title="Neighbourhoods In" dbTable="neighbourhoods" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={neighbourhoodsOut} setArrayName={setNeighbourhoodsOut} title="Neighbourhoods Out" dbTable="neighbourhoods" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={tiersIn} setArrayName={setTiersIn} title="Tiers In" dbTable="tiers" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={tiersOut} setArrayName={setTiersOut} title="Tiers Out" dbTable="tiers" />
              </div>
            <div className="col-12 mb-5">
              <NestedTable arrayName={operations} setArrayName={setOperations} title="Operations" dbTable="operations" />
              </div>

            <div className="col-12 d-flex flex-row-reverse">
              <button type="button" className="btn btn-lg btn-primary d-flex" type="submit"><Save /> Save</button>
                 &nbsp;&nbsp; 

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
            </div>

          </div>

        </form>
        </div>
      ) : (
        <CircularProgress size={30} className="pageLoader" />
      )}
    </Fragment>
  );
};

export default SubTables;
