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
    const [spareParts, setSpareParts] = useState([]);
    const [fridgesTypes, setFridgesTypes] = useState([]);
    const [correctiveActions, setCorrectiveActions] = useState([]);
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const nameArRef = useRef()
    const categoryRef = useRef()
    const categoryArRef = useRef()
    const submitRef = useRef()

    const [formValues, setFormValues] = useState({
      name: "",
      nameAr: "",
      category: "",
      categoryAr: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      nameAr: {error:false,msg:""},
      category: {error:false,msg:""},
      categoryAr: {error:false,msg:""},
    });
    
  useEffect(()=>{
    nameRef.current.focus()
      const fetchData = async () => {

        if (props.correctiveInspectionsId) {
          const correctiveInspection = await axios(
            `${process.env.REACT_APP_BASE_URL}/correctiveInspections/${props.correctiveInspectionsId}`,
            {
              responseType: "json",
            }
          ).then((response) => {
            setSpareParts(response.data[0].spareParts);
            setFridgesTypes(response.data[0].fridgesTypes);
            setCorrectiveActions(response.data[0].correctiveActions);
            setFormValues(response.data[0]);
            return response.data[0]
          })
        }
      };
      fetchData();
  },[])
  
  useEffect(()=>{
    setFormValues({ ...formValues,correctiveActions })
  },[correctiveActions])
  
  useEffect(()=>{
    setFormValues({ ...formValues,spareParts })
  },[spareParts])

  useEffect(()=>{
    setFormValues({ ...formValues,fridgesTypes })
  },[fridgesTypes])
  
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.nameRef){
        case "name": nameArRef.current.focus();break;
        case "nameAr": categoryRef.current.focus();break;
        case "category": categoryArRef.current.focus();break;
        case "categoryAr": submitRef.current.focus();break;
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
  
  if (props.correctiveInspectionsId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/correctiveInspections/${props.correctiveInspectionsId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/correctiveInspections/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        nameAr: "",
        category: "",
        categoryAr: ""
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
          The correctiveInspection is successfully created
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
              id="nameArInput"
              label="Name Arabic"
              name="nameAr"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.nameAr || ""}
              inputRef={nameArRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.nameAr.error ? formErrors.nameAr.msg : null}
              error={formErrors.nameAr.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="categoryInput"
              label="Category"
              name="category"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.category || ""}
              inputRef={categoryRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.category.error ? formErrors.category.msg : null}
              error={formErrors.category.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="categoryArInput"
              label="Category Arabic"
              name="categoryAr"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.categoryAr || ""}
              inputRef={categoryArRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.categoryAr.error ? formErrors.categoryAr.msg : null}
              error={formErrors.categoryAr.error}
            />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={fridgesTypes} setArrayName={setFridgesTypes} title="Fridges Types" dbTable="fridgesTypes" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={spareParts} setArrayName={setSpareParts} title="Spare Parts" dbTable="spareParts" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={correctiveActions} setArrayName={setCorrectiveActions} title="Corrective Actions" dbTable="correctiveActions" />
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
