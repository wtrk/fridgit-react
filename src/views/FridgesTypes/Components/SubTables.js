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
import Alert from '@material-ui/lab/Alert';


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
    const classes = useStyles(); //custom css
    const refrigerant_typeRef = useRef()
    const codeRef = useRef()
    const nameRef = useRef()
    const lengthRef = useRef()
    const widthRef = useRef()
    const heightRef = useRef()
    const cbmRef = useRef()
    const preventiveRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      refrigerant_type: "",
      code: "",
      name: "",
      length: "",
      width: "",
      height: "",
      cbm: "",
      preventive: "",
    });
    const [formErrors, setFormErrors] = useState({
      refrigerant_type: {error:false,msg:""},
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      length: {error:false,msg:""},
      width: {error:false,msg:""},
      height: {error:false,msg:""},
      cbm: {error:false,msg:""},
      preventive: {error:false,msg:""}
    });
    
  useEffect(()=>{
    refrigerant_typeRef.current.focus()
    if (props.fridgesTypeId) {
      const fetchData = async () => {
        const fridgesType = await axios(
          `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${props.fridgesTypeId}`,
          {
            responseType: "json",
          }
        ).then((response) => {
          setFormValues(response.data);
        }).catch((err)=>console.log(err));
      };
      fetchData();
    }
  },[])
  
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "refrigerant_type": codeRef.current.focus();break;
        case "code": nameRef.current.focus();break;
        case "name": submitRef.current.focus();break;
        case "length": submitRef.current.focus();break;
        case "width": submitRef.current.focus();break;
        case "height": submitRef.current.focus();break;
        case "cbm": submitRef.current.focus();break;
        case "preventive": submitRef.current.focus();break;
        default: refrigerant_typeRef.current.focus();
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
  
  if (props.fridgesTypeId) {
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${props.fridgesTypeId}`,
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
             url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/`,
             data: [formValues],
           })
             .then(function (response) {
               setOpenAlertSuccess(true);
               setFormValues({
                refrigerant_type: "",
                code: "",
                name: "",
                length: "",
                width: "",
                height: "",
                cbm: "",
                preventive: ""
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
          The fridgesType is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>


      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              id="refrigerant_typeInput"
              label="Refrigerant type"
              name="refrigerant_type"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.refrigerant_type || ""}
              inputRef={refrigerant_typeRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.refrigerant_type.error ? formErrors.refrigerant_type.msg : null
              }
              error={formErrors.refrigerant_type.error}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
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
              helperText={
                formErrors.code.error ? formErrors.code.msg : null
              }
              error={formErrors.code.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={5}>
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
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              id="lengthInput"
              label="Length"
              name="length"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.length || ""}
              inputRef={lengthRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.length.error ? formErrors.length.msg : null
              }
              error={formErrors.length.error}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <TextField
              id="widthInput"
              label="Width"
              name="width"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.width || ""}
              inputRef={widthRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.width.error ? formErrors.width.msg : null
              }
              error={formErrors.width.error}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              id="heightInput"
              label="Height"
              name="height"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.height || ""}
              inputRef={heightRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.height.error ? formErrors.height.msg : null
              }
              error={formErrors.height.error}
            />
          </Grid>
          
          <Grid item xs={12} sm={5}>
            <TextField
              id="cbmInput"
              label="CBM"
              name="cbm"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.cbm || ""}
              inputRef={cbmRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.cbm.error ? formErrors.cbm.msg : null
              }
              error={formErrors.cbm.error}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              id="preventiveInput"
              label="Preventive"
              name="preventive"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.preventive || ""}
              inputRef={preventiveRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.preventive.error ? formErrors.preventive.msg : null
              }
              error={formErrors.preventive.error}
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
