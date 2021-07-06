import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  NativeSelect,
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,
  FormControlLabel,MenuItem,
  Checkbox,
  InputLabel,
  FormControl,
  Select,FormHelperText
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import CustomToolbar from "CustomToolbar";
import {Autocomplete, Alert} from '@material-ui/lab';

import MUIDataTable from "mui-datatables";


const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar />;
    },
  };

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
    const [modal_Title, setmodal_Title] = useState("Add"); //modal title
    const [usersList, setUsersList] = useState([]); //Users list from db
    const [userValue, setUserValue] = useState({}); //Chosen User
    const [clientsList, setClientsList] = useState([]); //Clients list from db
    const [clientValue, setClientValue] = useState({}); //Chosen Client
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const fromRef = useRef()
    const toRef = useRef()
    const userRef = useRef()
    const clientRef = useRef()
    const totalRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      from: "",
      to: "",
      user_id: "",
      client_id: "",
      total: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      from: {error:false,msg:""},
      to: {error:false,msg:""},
      user_id: {error:false,msg:""},
      client_id: {error:false,msg:""},
      total: {error:false,msg:""},
    });
    
  useEffect(()=>{
    nameRef.current.focus()
      const fetchData = async () => {
        // const users = await axios(`${process.env.REACT_APP_BASE_URL}/users/type/6010209ab93b480ee05bff82`, { //id of type User
        //   responseType: "json",
        // }).then((response) => {
        //   setUsersList(response.data)
        //   return response.data
        // });

        if (props.invoiceId) {
          const invoice = await axios(
            `${process.env.REACT_APP_BASE_URL}/invoices/${props.invoiceId}`,
            {
              responseType: "json",
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setUserValue(props.usersList.find(e=> e._id==response.user_id))
            setClientValue(props.clientsList.find(e=> e._id==response.client_id))
          });
        }
      };
      fetchData();
  },[])
  const add1RowInWarehouse = () => {
    setWarehouse([...invoice, { name: "" }]);
  };
  const [invoice, setWarehouse] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [invoiceSelect, setWarehouseSelect] = React.useState("");
  const handleChangeWarehouseSelect = (event) => {
    setWarehouseSelect(event.target.value);
  };

  const add1RowInAlias = () => {
    setAlias([...alias, { name: "" }]);
  };
  const [alias, setAlias] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [aliasSelect, setAliasSelect] = React.useState("");
  const handleChangeAliasSelect = (event) => {
    setAliasSelect(event.target.value);
  };
  
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "name": fromRef.current.focus();break;
        case "from": toRef.current.focus();break;
        case "to": userRef.current.focus();break;
        case "user_id": totalRef.current.focus();break;
        case "total": submitRef.current.focus();break;
        default: nameRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeUser = (e, newValue) =>{
  setUserValue(newValue)
  if(newValue) setFormValues({ ...formValues, user_id: newValue._id });
}
const handleChangeClient = (e, newValue) =>{
  setClientValue(newValue)
  if(newValue) setFormValues({ ...formValues, client_id: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
  
  if (props.invoiceId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/invoices/${props.invoiceId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/invoices/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        from: "",
        to: "",
        user_id:"",
        total:""
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
          The invoice is successfully created
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
              id="fromInput"
              label="From"
              name="from"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.from || ""}
              inputRef={fromRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.from.error ? formErrors.from.msg : null}
              error={formErrors.from.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="toInput"
              label="To"
              name="to"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.to || ""}
              inputRef={toRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.to.error ? formErrors.to.msg : null}
              error={formErrors.to.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="UserInput"
              options={props.usersList || {}}
              value={userValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeUser}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User"
                  inputRef={userRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.user_id.error ? formErrors.user_id.msg : null
                  }
                  error={formErrors.user_id.error}
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
                    formErrors.client_id.error ? formErrors.client_id.msg : null
                  }
                  error={formErrors.client_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="totalInput"
              label="Total"
              name="total"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.total || ""}
              inputRef={totalRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.total.error ? formErrors.total.msg : null}
              error={formErrors.total.error}
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
    Get Finance
  </Button>
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
