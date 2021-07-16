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
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MUIDataTable from "mui-datatables";



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
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [cityValue, setCityValue] = useState({});
    const [alias, setAlias] = useState([]);
    const classes = useStyles(); //custom css
    const codeRef = useRef()
    const nameRef = useRef()
    const cityRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      code: "",
      name: "",
      city_id: ""
    });
    const [formErrors, setFormErrors] = useState({
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      city_id: {error:false,msg:""}
    });
    
  useEffect(()=>{
    codeRef.current.focus()
    if (props.neighbourhoodId) {
      const fetchData = async () => {
        const neighbourhood = await axios(
          `${process.env.REACT_APP_BASE_URL}/neighbourhoods/${props.neighbourhoodId}`,
          {
            responseType: "json", headers: {Authorization: `Bearer ${token}`},
          }
        ).then((response) => {
          setFormValues(response.data);
          setCityValue(props.citiesList.filter(e=> e._id==response.data.city_id)[0])
          setAlias(response.data.alias);
        });
      };
      fetchData();
    }
  },[])

  const add1RowInAlias = () => {
    setAlias([...alias, { name: "" }]);
  };
  const [aliasSelect, setAliasSelect] = React.useState("");

  const handleChangeAliasInput = (e) => {
    setAliasSelect(e.target.value);
  };
  const keyPressAliasHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setAliasSelect("")
      setAlias([...alias.filter(e=>e.name!==""), { name: target.value }]);
    }
  }
  useEffect(()=>{
    setFormValues({ ...formValues, alias:alias })
  },[alias])
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "code": nameRef.current.focus();break;
        case "name": cityRef.current.focus();break;
        case "city_id": submitRef.current.focus();break;
        default: codeRef.current.focus();
      }
    }
  }
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeCity = (e, newValue) =>{
  setCityValue(newValue)
  if(newValue) setFormValues({ ...formValues, city_id: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  
  if (props.neighbourhoodId) {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_URL}/neighbourhoods/${props.neighbourhoodId}`,
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
           await axios({
             method: "POST",
             url: `${process.env.REACT_APP_BASE_URL}/neighbourhoods/`,
             headers: {Authorization: `Bearer ${token}`},
             data: [formValues],
           })
             .then(function (response) {
               setOpenAlertSuccess(true);
               setFormValues({
                 code: "",
                 name: "",
                 city_id: ""
               });
               toast.success("Successfully Added", {onClose: () => props.handleClose()});

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
    <ToastContainer />
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
          The neighbourhood is successfully created
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
              helperText={
                formErrors.code.error ? formErrors.code.msg : null
              }
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
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              id="CityInput"
              options={props.citiesList || {}}
              value={cityValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeCity}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  inputRef={cityRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.city_id.error ? formErrors.city_id.msg : null
                  }
                  error={formErrors.city_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <MUIDataTable
              title="Alias"
              data={alias}
              columns={[
                {
                  name: "name",
                  label: "Name",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      if (value == "") {
                        return (
                          <div>
                            <TextField
                              id="aliasInput"
                              label="Add new neighbourhood alias"
                              onChange={handleChangeAliasInput}
                              onKeyDown={keyPressAliasHandler}
                              fullWidth
                              value={aliasSelect || ""}
                              name="aliasSelect"
                            />
                          </div>
                        );
                      } else {
                        return <div>{value}</div>;
                      }
                    },
                  },
                },
              ]}
              options={{
                filter: false,
                customToolbar: () => {
                  return <CustomToolbar listener={add1RowInAlias} />;
                },
                onRowsDelete: (rowsDeleted, dataRows) => {
                  const idsToDelete = rowsDeleted.data.map(d => alias[d.dataIndex]._id);
                  const rowsToKeep=alias.filter(e=> !idsToDelete.includes(e._id))
                  setAlias(rowsToKeep)
                },
              }}
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
