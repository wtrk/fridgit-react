import React, { Fragment,useRef,useEffect,useState } from "react";
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
import { Close, Save } from "@material-ui/icons";
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
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minWidth: "100%",
  },
}));
const AddFormDialog = (props) => {
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const classes = useStyles(); //custom css
  const nameRef = useRef()
  const nicknameRef = useRef()
  const cr_numberRef = useRef()
  const vat_numberRef = useRef()
  const vat_percentageRef = useRef()
  const submitRef = useRef()
  const [updated, setUpdated] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    nickname: "",
    cr_number: "",
    vat_number: "",
    vat_percentage: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: {error:false,msg:""},
    nickname: {error:false,msg:""},
    cr_number: {error:false,msg:""},
    vat_number: {error:false,msg:""},
    vat_percentage: {error:false,msg:""}
  });
  useEffect(()=>{
    nameRef.current.focus()
  },[])
  const keyPressHandler = (e) => {
      const { keyCode, target } = e
      if(keyCode===13){
        switch (target.name){
          case "name": nicknameRef.current.focus();break;
          case "nickname": cr_numberRef.current.focus();break;
          case "cr_number": vat_numberRef.current.focus();break;
          case "vat_number": vat_percentageRef.current.focus();break;
          case "vat_percentage": submitRef.current.focus();break;
          default: nameRef.current.focus();
        }
      }
  }
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    // e.persist();
    setFormValues({ ...formValues, [name]: value });
  };
  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked ? 1 : 0 });
  }
  const handleOnSubmit = async () => {
    for (const [key, value] of Object.entries(formErrors)) {
        if(value.error===true) return setOpenAlertError(true);
    }
    props.dataLegal.map(e=>{
      delete e._id
    })
    props.setDataLegal([...props.dataLegal,formValues])
    setUpdated(true)

  }
  
  useEffect(()=>{
    if(updated===true){
      const fetchData = async () => {
        await axios({
          method: "put",
          url: `${process.env.REACT_APP_BASE_URL}/clients/${props.clientId}`,
          data: {"legals": props.dataLegal}
        })
          .then(function (response) {
            setFormValues({
              name: "",
              nickname: "",
              cr_number: "",
              vat_number: "",
              vat_percentage: ""
            });
            props.handleClose()
            return setOpenAlertSuccess(true);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      fetchData();
    }
    },[props.dataLegal])

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
          The serviceType is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>

      <div style={{ padding: "50px" }}>
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
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
            />
          </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="nicknameInput"
            label="Nickname"
            name="nickname"
            value={formValues.nickname || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={nicknameRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.nickname.error ? formErrors.nickname.msg : null
            }
            error={formErrors.nickname.error}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="cr_numberInput"
            label="CR #"
            name="cr_number"
            value={formValues.cr_number || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={cr_numberRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.cr_number.error ? formErrors.cr_number.msg : null
            }
            error={formErrors.cr_number.error}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="vat_numberInput"
            label="VAT #"
            name="vat_number"
            value={formValues.vat_number || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={vat_numberRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.vat_number.error ? formErrors.vat_number.msg : null
            }
            error={formErrors.vat_number.error}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            id="vat_percentageInput"
            label="VAT %"
            name="vat_percentage"
            value={formValues.vat_percentage || ""}
            onChange={handleChangeForm}
            fullWidth
            inputRef={vat_percentageRef}
            onKeyDown={keyPressHandler}
            onBlur={validateInputHandler}
            helperText={
              formErrors.vat_percentage.error ? formErrors.vat_percentage.msg : null
            }
            error={formErrors.vat_percentage.error}
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

export default AddFormDialog;
