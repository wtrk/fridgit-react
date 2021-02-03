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
    const [suppliersList, setSuppliersList] = useState([]); //table items
    const [supplierValue, setSupplierValue] = useState({}); //table items
    const [cities, setCities] = useState([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const [neighbourhoods, setNeighbourhoods] = useState([]);
    const [isLoadingNeighbourhoods, setIsLoadingNeighbourhoods] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
    const [operations, setOperations] = useState([]);
    const [isLoadingOperations, setIsLoadingOperations] = useState(true);
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const supplierRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      code: "",
      name: "",
      supplier_id: ""
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      supplier_id: {error:false,msg:""}
    });
    
  useEffect(()=>{
    codeRef.current.focus()
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
            setCustomers(response.customers);
            setOperations(response.operations);
            setSupplierValue(suppliers.filter(e=> e._id==response.supplier_id)[0])
            setIsLoadingCities(false);
            setIsLoadingNeighbourhoods(false);
            setIsLoadingCustomers(false);
            setIsLoadingOperations(false);
          });
        }
      };
      fetchData();
  },[])

  const add1RowInCities = () => {
    setCities([...cities, { name: "" }]);
  };
  const [citiesSelect, setCitiesSelect] = React.useState("");
  const handleChangeCitiesInput = (e) => {
    setCitiesSelect(e.target.value);
  };
  const keyPressCitiesHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setCitiesSelect("")
      setCities([...cities.filter(e=>e.name!==""), { name: target.value }]);
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues, cities })
  },[cities])
  

  const add1RowInNeighbourhoods = () => {
    setNeighbourhoods([...neighbourhoods, { name: "" }]);
  };
  const [neighbourhoodsSelect, setNeighbourhoodsSelect] = React.useState("");
  const handleChangeNeighbourhoodsInput = (e) => {
    setNeighbourhoodsSelect(e.target.value);
  };
  const keyPressNeighbourhoodsHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setNeighbourhoodsSelect("")
      setNeighbourhoods([...neighbourhoods.filter(e=>e.name!==""), { name: target.value }]);
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues,neighbourhoods })
  },[neighbourhoods])
  

  const add1RowInCustomers = () => {
    setCustomers([...customers, { name: "" }]);
  };
  const [customersSelect, setCustomersSelect] = React.useState("");
  const handleChangeCustomersInput = (e) => {
    setCustomersSelect(e.target.value);
  };
  const keyPressCustomersHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setCustomersSelect("")
      setCustomers([...customers.filter(e=>e.name!==""), { name: target.value }]);
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues,customers })
  },[customers])
  

  const add1RowInOperations = () => {
    setOperations([...operations, { name: "" }]);
  };
  const [operationsSelect, setOperationsSelect] = React.useState("");
  const handleChangeOperationsInput = (e) => {
    setOperationsSelect(e.target.value);
  };
  const keyPressOperationsHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setOperationsSelect("")
      setOperations([...operations.filter(e=>e.name!==""), { name: target.value }]);
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues,operations })
  },[operations])

  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "code": nameRef.current.focus();break;
        case "name": supplierRef.current.focus();break;
        case "supplier_id": submitRef.current.focus();break;
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
        supplier_id:""
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

      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
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
          
          <Grid item xs={12}>
            <NestedTable arrayName={cities} setArrayName={setCities} title="Cities" isLoading={isLoadingNeighbourhoods} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={neighbourhoods} setArrayName={setNeighbourhoods} title="Neighbourhoods" isLoading={isLoadingNeighbourhoods} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={customers} setArrayName={setCustomers} title="Customers" isLoading={isLoadingCustomers} />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={operations} setArrayName={setOperations} title="Operations" isLoading={isLoadingOperations} />
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
