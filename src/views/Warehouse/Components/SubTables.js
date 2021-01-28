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
    const [tiersList, setTiersList] = useState([]); //table items
    const [tierValue, setTierValue] = useState({}); //table items
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const tierRef = useRef()
    const neighbourhoodRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      code: "",
      name: "",
      tier_id: "",
      neighbourhood_id: ""
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      tier_id: {error:false,msg:""},
      neighbourhood_id: {error:false,msg:""}
    });
    
  useEffect(()=>{
    codeRef.current.focus()
      const fetchData = async () => {
      
        const tiers = await axios(`${process.env.REACT_APP_BASE_URL}/tiers`, {
          responseType: "json",
        }).then((response) => {
          setTiersList(response.data)
          return response.data
        });

        if (props.warehouseId) {
          const warehouse = await axios(
            `${process.env.REACT_APP_BASE_URL}/warehouses/${props.warehouseId}`,
            {
              responseType: "json",
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setTierValue(tiers.filter(e=> e._id==response.tier_id)[0])
            
          });
        }
      };
      fetchData();
  },[])
  const add1RowInWarehouse = () => {
    setWarehouse([...warehouse, { name: "" }]);
  };
  const [warehouse, setWarehouse] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [warehouseSelect, setWarehouseSelect] = React.useState("");
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
        case "code": nameRef.current.focus();break;
        case "name": tierRef.current.focus();break;
        case "tier_id": neighbourhoodRef.current.focus();break;
        case "neighbourhood_id": submitRef.current.focus();break;
        default: codeRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeTier = (e, newValue) =>{
  setTierValue(newValue)
  if(newValue) setFormValues({ ...formValues, tier_id: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
  
  if (props.warehouseId) {
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/warehouses/${props.warehouseId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/warehouses/`,
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        code: "",
        name: "",
        tier_id:"",
        neighbourhood_id:""
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
          The warehouse is successfully created
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
            <Autocomplete
              id="TierInput"
              options={tiersList || {}}
              value={tierValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeTier}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tiers"
                  inputRef={tierRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.tier_id.error ? formErrors.tier_id.msg : null
                  }
                  error={formErrors.tier_id.error}
                />
              )}
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
