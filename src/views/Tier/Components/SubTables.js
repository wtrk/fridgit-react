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
import Alert from '@material-ui/lab/Alert';
import NestedTable from "./NestedTable.js";

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
    const [tierCity, setTierCity] = useState([]);
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      code: "",
      name: ""
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""}
    });
    
  useEffect(()=>{
    codeRef.current.focus()
    if (props.tierId) {
      const fetchData = async () => {
        const tier = await axios(
          `${process.env.REACT_APP_BASE_URL}/tiers/${props.tierId}`,
          {
            responseType: "json",
          }
        ).then((response) => {
          setFormValues(response.data);
          setTierCity(response.data.cities);
        });
      };
      fetchData();
    }
  },[])

  const add1RowInTierCity = () => {
    setTierCitySelect("")
    setTierCity([...tierCity, { name: "" }]);
  };
  const [tierCitySelect, setTierCitySelect] = React.useState("");

  const handleChangeTierCityInput = (e) => {
    setTierCitySelect(e.target.value);
  };
  const keyPressTierCityHandler = async (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      if (props.tierId) {
        await axios({
          method: "put",
          url: `${process.env.REACT_APP_BASE_URL}/tierCity/${props.tierId}`,
          data: { name: target.value },
        })
          .then(function (response) {
            setTierCity([
              ...tierCity.filter((e) => e.name !== ""),
              { name: target.value },
            ]);
          })
          .catch((error) => {
            console.log(error);
          });
      }else{
        setTierCitySelect("")
        setTierCity([
          ...tierCity.filter((e) => e.name !== ""),
          { name: target.value },
        ]);
      }
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues, cities:tierCity })
  },[tierCity])
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "code": nameRef.current.focus();break;
        case "name": submitRef.current.focus();break;
        default: codeRef.current.focus();
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
  if (props.tierId) {
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/tiers/${props.tierId}`,
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
        url: `${process.env.REACT_APP_BASE_URL}/tiers/`,
        data: [formValues],
      })
      .then(async function (response) {
        await axios({
          method: "put",
          url: `${process.env.REACT_APP_BASE_URL}/tierCity/${response.data.id}`,
          data: formValues.tierCity[0],
        })
        .then(function (response) {
          setOpenAlertSuccess(true);
          setFormValues({
            code: "",
            name: ""
          });
          props.handleClose()
        })
        .catch((error) => {
          console.log(error);
        });
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
          The tier is successfully created
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
          <Grid item xs={12} sm={2}></Grid>
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
          
          <Grid item xs={12}>
            <NestedTable arrayName={tierCity} setArrayName={setTierCity} title="TierCities" dbTable="cities" />
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
