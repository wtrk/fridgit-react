import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,CircularProgress
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {Autocomplete, Alert} from '@material-ui/lab';
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
    const [suppliersList, setSuppliersList] = useState([]); //table items
    const [supplierValue, setSupplierValue] = useState({}); //table items
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [neighbourhoods, setNeighbourhoods] = useState([]);
    const [clients, setClients] = useState([]);
    const [operations, setOperations] = useState([]);
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const supplierRef = useRef()
    const priorityRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      code: "",
      name: "",
      supplier_id: "",
      priority:""
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      supplier_id: {error:false,msg:""},
      priority: {error:false,msg:""},
    });
    
  useEffect(()=>{
      const fetchData = async () => {
        const suppliers = await axios(`${process.env.REACT_APP_BASE_URL}/suppliers`, {
          responseType: "json",
        }).then((response) => {
          setSuppliersList(response.data)
          return response.data
        });

        if (props.allocationRuleId) {
          const allocationRule = await axios(
            `${process.env.REACT_APP_BASE_URL}/allocationRules/${props.allocationRuleId}`,
            {
              responseType: "json",
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setCities(response.cities);
            setNeighbourhoods(response.neighbourhoods);
            setClients(response.clients);
            setOperations(response.operations);
            setSupplierValue(suppliers.filter(e=> e._id==response.supplier_id)[0])
            setIsLoading(false);
            codeRef.current.focus()
          });
        }
      };
      fetchData();
  },[])

  useEffect(()=>{
    setFormValues({ ...formValues, cities })
  },[cities])
  useEffect(()=>{
    setFormValues({ ...formValues,neighbourhoods })
  },[neighbourhoods])
  useEffect(()=>{
    setFormValues({ ...formValues,clients })
  },[clients])
  useEffect(()=>{
    setFormValues({ ...formValues,operations })
  },[operations])

  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "code": nameRef.current.focus();break;
        case "name": supplierRef.current.focus();break;
        case "supplier_id": priorityRef.current.focus();break;
        case "priority": submitRef.current.focus();break;
        default: codeRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeSupplier = (e, newValue) =>{
  setSupplierValue(newValue)
  if(newValue) setFormValues({ ...formValues, supplier_id: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
  if (props.allocationRuleId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/allocationRules/${props.allocationRuleId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/allocationRules/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        code: "",
        name: "",
        supplier_id:"",
        priority:""
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
          The allocationRule is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>

      {!isLoading ?
      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
            <Autocomplete
              id="SupplierInput"
              options={suppliersList || {}}
              value={supplierValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeSupplier}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  inputRef={supplierRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.supplier_id.error ? formErrors.supplier_id.msg : null
                  }
                  error={formErrors.supplier_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
            <Grid item xs={12}>
            <NestedTable arrayName={cities} setArrayName={setCities} title="Cities" dbTable="cities" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={neighbourhoods} setArrayName={setNeighbourhoods} title="Neighbourhoods" dbTable="neighbourhoods" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={clients} setArrayName={setClients} title="Clients" dbTable="clients" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={operations} setArrayName={setOperations} title="Operations" dbTable="operations" />
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
      :<CircularProgress  size={30} className="pageLoader" />
    }
    </Fragment>
  );
};

export default SubTables;
