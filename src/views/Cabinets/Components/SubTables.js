import React, { useState, useRef, useEffect} from "react";
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
    const [clientValue, setClientValue] = useState({});
    const [fridgesTypeValue, setfridgesTypeValue] = useState({});
    const [oldIsNew, setOldIsNew] = useState();
    const classes = useStyles(); //custom css
    const snRef = useRef()
    const sn2Ref = useRef()
    const typeRef = useRef()
    const brandRef = useRef()
    const clientRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      sn: "",
      sn2: "",
      type: "",
      brand: "",
      client: "",
      is_new: false
    });
    const [formErrors, setFormErrors] = useState({
      sn: {error:false,msg:""},
      sn2: {error:false,msg:""},
      type: {error:false,msg:""},
      brand: {error:false,msg:""},
      client: {error:false,msg:""}
    });
    
    useEffect(()=>{
      snRef.current.focus()
        const fetchData = async () => {
          if (props.cabinetId) {
            const cabinet = await axios(
              `${process.env.REACT_APP_BASE_URL}/cabinets/${props.cabinetId}`,
              {
                responseType: "json", headers: {Authorization: `Bearer ${token}`}
              }
            ).then((response) => {
              setFormValues(response.data);
              return response.data
            }).then((response)=>{
              setClientValue(props.clientsList.filter(e=> e._id==response.client)[0])
              setfridgesTypeValue(props.fridgesTypesList.filter(e=> e._id==response.type)[0])
              setOldIsNew(response.is_new)
            });
            
          }
        };
        fetchData();
    },[])
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "sn": sn2Ref.current.focus();break;
        case "sn2": typeRef.current.focus();break;
        case "type": brandRef.current.focus();break;
        case "brand": clientRef.current.focus();break;
        case "client": submitRef.current.focus();break;
        default: snRef.current.focus();
      }
    }
}
const handleChangeCheckbox = (e) => {
  const { name, checked } = e.target;
  setFormValues({ ...formValues, [name]: checked ? true : false });
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeClient = (e, newValue) =>{
  setClientValue(newValue)
  if(newValue) setFormValues({ ...formValues, client: newValue._id });
}
const handleChangeFridgesType = (e, newValue) =>{
  setfridgesTypeValue(newValue)
  if(newValue) setFormValues({ ...formValues, type: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  if (props.cabinetId) {
    const liveOperationBySn = await axios(
      `${process.env.REACT_APP_BASE_URL}/liveOperations/bySn/${props.cabinetId}`,{responseType: "json", headers: {Authorization: `Bearer ${token}`}}
    ).then((response) => response.data)
    if(liveOperationBySn.length || oldIsNew===formValues.is_new){
      formValues.is_new=formValues.oldIsNew;
    }else{
      formValues.status=formValues.is_new ? "Operational" : "Needs test";
    }
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/${props.cabinetId}`,
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
    const status=formValues.is_new ? "Operational" : "Needs test";
    const prev_status=formValues.is_new ? "Not Due" : "Recommended";
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{...formValues,status,prev_status}],
    })
    .then(function (response) {
      setFormValues({
        sn: "",
        sn2: "",
        type: "",
        brand: "",
        client: ""
      });
      toast.success("Successfully Added", {onClose: () => props.handleClose()});
    })
    .catch((error) => {
      toast.error(error.response.data.message);
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
    <>
    <ToastContainer />
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close onClick={props.handleClose} className="btnIcon" />
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>

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
              id="sn2Input"
              label="SN2"
              name="sn2"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.sn2 || ""}
              inputRef={sn2Ref}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.sn2.error ? formErrors.sn2.msg : null}
              error={formErrors.sn2.error}
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
            <TextField
              id="brandInput"
              label="Brand"
              name="brand"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.brand || ""}
              inputRef={brandRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.brand.error ? formErrors.brand.msg : null}
              error={formErrors.brand.error}
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
    </>
  );
};

export default SubTables;
