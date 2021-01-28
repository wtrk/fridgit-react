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
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Select,
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import CustomToolbar from "CustomToolbar";
import Alert from '@material-ui/lab/Alert';

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
    const [alias, setAlias] = useState([]);
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
    if (props.cityId) {
      const fetchData = async () => {
        const city = await axios(
          `${process.env.REACT_APP_BASE_URL}/cities/${props.cityId}`,
          {
            responseType: "json",
          }
        ).then((response) => {
          setFormValues(response.data);
          setAlias(response.data.alias);
        });
      };
      fetchData();
    }
  },[])
  const add1RowInCity = () => {
    setCity([...city, { name: "" }]);
  };
  const [city, setCity] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [citySelect, setCitySelect] = React.useState("");
  const handleChangeCitySelect = (event) => {
    setCitySelect(event.target.value);
  };

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
  
  if (props.cityId) {
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/cities/${props.cityId}`,
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
             url: `${process.env.REACT_APP_BASE_URL}/cities/`,
             data: [formValues],
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
          The city is successfully created
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
            <MUIDataTable
              title="Alias"
              data={alias || []}
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
                              label="Add new city alias"
                              onChange={handleChangeAliasInput}
                              onKeyDown={keyPressAliasHandler}
                              fullWidth
                              value={aliasSelect}
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

                selectToolbarPlacement: "replace",
                customToolbar: () => {
                  return <CustomToolbar listener={add1RowInAlias} />;
                },
                customFooter: () => null,
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
