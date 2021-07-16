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
import { Close,Save,Publish } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
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
    },
    formControl: {
      minWidth: "100%",
    },
  }));
const SubTables = (props) => {
  const token = getCookie('token');
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const descriptionRef = useRef()
    const addressRef = useRef()
    const phoneRef = useRef()
    const emailRef = useRef()
    const websiteRef = useRef()
    const cr_numberRef = useRef()
    const vat_numberRef = useRef()
    const vat_percentageRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      cr_number: "",
      vat_number: "",
      vat_percentage: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      description: {error:false,msg:""},
      address: {error:false,msg:""},
      phone: {error:false,msg:""},
      email: {error:false,msg:""},
      website: {error:false,msg:""},
      cr_number: {error:false,msg:""},
      vat_number: {error:false,msg:""},
      vat_percentage: {error:false,msg:""}
    });
    const [image, setImage] = useState({ preview: "", file: "" });
  
    const handleChangeImg = e => {
      if (e.target.files.length) {
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          file: e.target.files[0]
        });
      }
    };
  
    const handleUploadImg = async e => {
    const formData = new FormData();
    formData.append("file",image.file);
  
    for (const [key, value] of Object.entries(formErrors)) {
        if(value.error===true) return toast.error("Please validate the Form and submit it again");
    }
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_URL}/companies/img/${props.companyId}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`},
      })
        .then(function (response) {
          toast.success("Successfully Uploaded");
        })
        .catch((error) => {
          console.log(error);
        });
  }
    
  useEffect(()=>{
    if (props.companyId) {
      const fetchData = async () => {
        const company = await axios(
          `${process.env.REACT_APP_BASE_URL}/companies/${props.companyId}`,
          {
            responseType: "json", headers: {Authorization: `Bearer ${token}`}
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
        case "name": descriptionRef.current.focus();break;
        case "description": addressRef.current.focus();break;
        case "address": phoneRef.current.focus();break;
        case "phone": emailRef.current.focus();break;
        case "email": websiteRef.current.focus();break;
        case "website": cr_numberRef.current.focus();break;
        case "cr_number": vat_numberRef.current.focus();break;
        case "vat_number": vat_percentageRef.current.focus();break;
        case "vat_percentage": submitRef.current.focus();break;
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
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  delete formValues._id
  delete formValues.logo
  // return console.log("formValues",formValues)
  if (props.companyId) {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_URL}/companies/${props.companyId}`,
        headers: {Authorization: `Bearer ${token}`},
        data: [formValues],
      })
        .then(function (response) {
          setOpenAlertSuccess(true);
          props.setIsLoading(true)
          toast.success("Successfully Updated", {onClose: () => props.handleClose()});
        })
        .catch((error) => {
          console.log(error);
        });
  } else {
           await axios({
             method: "POST",
             url: `${process.env.REACT_APP_BASE_URL}/companies/`,
             headers: {Authorization: `Bearer ${token}`},
             data: [formValues],
           })
             .then(function (response) {
               setOpenAlertSuccess(true);
               setFormValues({
                name: "",
                description: "",
                address: "",
                phone: "",
                email: "",
                website: "",
                cr_number: "",
                vat_number: "",
                vat_percentage: ""
               });
               props.setIsLoading(true)
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
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>

      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            {openAlertSuccess ? (
              <div className="alert alert-success" role="alert">
                The Image was successfully updated
              </div>
            ) : null}
            {!image.preview ? (
              <label htmlFor="upload-button" style={{ width: "100%" }}>
                {formValues.logo ? (
                  <img
                    src={`/img/companies/${formValues.logo}`}
                    alt=""
                    style={{ width: "100%" }}
                    className="mb-4"
                  />
                ) : (
                  <h5 className="text-center">Click here to upload a logo</h5>
                )}
              </label>
            ) : (
              <>
                <label htmlFor="upload-button" style={{ width: "100%" }}>
                  <img src={image.preview} alt="" style={{ width: "100%" }} />
                </label>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  className="btn btn--save float-right"
                  onClick={handleUploadImg}
                  startIcon={<Publish />}
                >
                  Upload
                </Button>
              </>
            )}
            <input
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={handleChangeImg}
            />
          </Grid>
          <Grid item container xs={12} sm={9} spacing={3}>
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
                id="descriptionInput"
                label="description"
                name="description"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.description || ""}
                inputRef={descriptionRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.description.error
                    ? formErrors.description.msg
                    : null
                }
                error={formErrors.description.error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="addressInput"
                label="address"
                name="address"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.address || ""}
                inputRef={addressRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.address.error
                    ? formErrors.address.msg
                    : null
                }
                error={formErrors.address.error}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="phoneInput"
                label="phone"
                name="phone"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.phone || ""}
                inputRef={phoneRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.phone.error ? formErrors.phone.msg : null
                }
                error={formErrors.phone.error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="emailInput"
                label="email"
                name="email"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.email || ""}
                inputRef={emailRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.email.error ? formErrors.email.msg : null
                }
                error={formErrors.email.error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="websiteInput"
                label="website"
                name="website"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.website || ""}
                inputRef={cr_numberRef}
                onKeyDown={keyPressHandler}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.website.error ? formErrors.website.msg : null
                }
                error={formErrors.website.error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="cr_numberInput"
                label="cr_number"
                name="cr_number"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.cr_number || ""}
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
                label="vat_number"
                name="vat_number"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.vat_number || ""}
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
                label="vat_percentage"
                name="vat_percentage"
                onChange={handleChangeForm}
                fullWidth
                value={formValues.vat_percentage || ""}
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
        </Grid>
      </div>
    </Fragment>
  );
};

export default SubTables;
