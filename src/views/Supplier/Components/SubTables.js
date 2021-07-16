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
import CustomToolbar from "CustomToolbar";
import {Autocomplete, Alert} from '@material-ui/lab';
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const token = getCookie('token');
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [modal_Title, setmodal_Title] = useState("Add"); //modal title
    const [usersList, setUsersList] = useState([]); //Drivers list from db
    const [userValue, setUserValue] = useState({}); //Chosen Driver
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const addressRef = useRef()
    const phoneRef = useRef()
    const userRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      address: "",
      phone: "",
      user_id: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      address: {error:false,msg:""},
      phone: {error:false,msg:""},
      user_id: {error:false,msg:""}
    });
    
  useEffect(()=>{
    nameRef.current.focus()
      const fetchData = async () => {
        const users = await axios(`${process.env.REACT_APP_BASE_URL}/users/type/6010209ab93b480ee05bff82`, { //id of type driver
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          setUsersList(response.data)
          return response.data
        });

        if (props.supplierId) {
          const supplier = await axios(
            `${process.env.REACT_APP_BASE_URL}/suppliers/${props.supplierId}`,
            {
              responseType: "json", headers: {Authorization: `Bearer ${token}`},
            }
          ).then((response) => {
            setFormValues(response.data);
            return response.data
          }).then((response)=>{
            setUserValue(users.filter(e=> e._id==response.user_id)[0])
          });
        }
      };
      fetchData();
  },[])
  const add1RowInWarehouse = () => {
    setWarehouse([...supplier, { name: "" }]);
  };
  const [supplier, setWarehouse] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [supplierSelect, setWarehouseSelect] = React.useState("");
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
        case "name": addressRef.current.focus();break;
        case "address": phoneRef.current.focus();break;
        case "phone": userRef.current.focus();break;
        case "user_id": submitRef.current.focus();break;
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
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  
  if (props.supplierId) {
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/suppliers/${props.supplierId}`,
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
      url: `${process.env.REACT_APP_BASE_URL}/suppliers/`,
      headers: {Authorization: `Bearer ${token}`},
      data: [formValues],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        address: "",
        phone: "",
        user_id:""
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
          The supplier is successfully created
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
              id="addressInput"
              label="Address"
              name="address"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.address || ""}
              inputRef={addressRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.address.error ? formErrors.address.msg : null}
              error={formErrors.address.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="phoneInput"
              label="Phone"
              name="phone"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.phone || ""}
              inputRef={phoneRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.phone.error ? formErrors.phone.msg : null}
              error={formErrors.phone.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="UserInput"
              options={usersList || {}}
              value={userValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeUser}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Driver"
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
