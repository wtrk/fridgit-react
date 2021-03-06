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
    const refrigerant_typeRef = useRef()
    const codeRef = useRef()
    const nameRef = useRef()
    const lengthRef = useRef()
    const widthRef = useRef()
    const heightRef = useRef()
    const preventiveCountYearRef = useRef()
    const cbmRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      refrigerant_type: "",
      code: "",
      name: "",
      length: "",
      width: "",
      height: "",
      preventive_count_year: 1,
      cbm: "",
    });
    const [formErrors, setFormErrors] = useState({
      refrigerant_type: {error:false,msg:""},
      code: {error:false,msg:""},
      name: {error:false,msg:""},
      length: {error:false,msg:""},
      width: {error:false,msg:""},
      height: {error:false,msg:""},
      preventive_count_year: {error:false,msg:""},
      cbm: {error:false,msg:""}
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
        url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/img/${props.fridgesTypeId}`,
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
    refrigerant_typeRef.current.focus()
    if (props.fridgesTypeId) {
      const fetchData = async () => {
        const fridgesType = await axios(
          `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${props.fridgesTypeId}`,
          {
            responseType: "json", headers: {Authorization: `Bearer ${token}`},
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
        case "name": lengthRef.current.focus();break;
        case "length": widthRef.current.focus();break;
        case "width": heightRef.current.focus();break;
        case "height": preventiveCountYearRef.current.focus();break;
        case "preventiveCountYear": cbmRef.current.focus();break;
        case "cbm": submitRef.current.focus();break;
        default: refrigerant_typeRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  if(name==="width"){
    setFormValues({ ...formValues, [name]: value, cbm:(value * formValues.height * formValues.length).toFixed(2) });
  }else if(name==="height"){
    setFormValues({ ...formValues, [name]: value, cbm:(value * formValues.width * formValues.length).toFixed(2) });
  }else if(name==="length"){
    setFormValues({ ...formValues, [name]: value, cbm:(value * formValues.height * formValues.width).toFixed(2) });
  }else{
    setFormValues({ ...formValues, [name]: value });
  }
};

// useEffect(()=>{
//   formValues.cbm=(formValues.width * formValues.height * formValues.length).toFixed(2)
// },[formValues])

const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  delete formValues._id
  delete formValues.photo
  delete formValues.preventive
  // return console.log("formValues",formValues)
  if (props.fridgesTypeId) {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${props.fridgesTypeId}`,
        headers: {Authorization: `Bearer ${token}`},
        data: [formValues],
      })
        .then(function (response) {
          setOpenAlertSuccess(true);
          props.setIsLoading(true)
          props.setRefreshData(response.data)
          toast.success("Successfully Updated", {onClose: () => props.handleClose()});
        })
        .catch((error) => {
          console.log(error);
        });
  } else {
           await axios({
             method: "POST",
             url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/`,
             headers: {Authorization: `Bearer ${token}`},
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
                preventive_count_year: "",
                cbm: ""
               });
               props.setIsLoading(true)
               props.setRefreshData(response.data)
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
                {openAlertSuccess?
                  <div className="alert alert-success" role="alert">
                    The Image was successfully updated
                  </div>
                :null}
                {!image.preview ? (
                  <label htmlFor="upload-button" style={{width:"100%"}}>
                  {formValues.photo ? (
                    <img src={`/img/types/${formValues.photo}`} alt="" style={{width:"100%"}} className="mb-4" /> 
                  ):(
                    <h5 className="text-center">Click here to upload a photo</h5>
                  )}
                </label>
                ) : (
                  <>
                <label htmlFor="upload-button" style={{width:"100%"}}><img src={image.preview} alt="" style={{width:"100%"}} /></label>
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
              helperText={
                formErrors.code.error ? formErrors.code.msg : null
              }
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
              helperText={
                formErrors.name.error ? formErrors.name.msg : null
              }
              error={formErrors.name.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          
          <Grid item xs={12} sm={6}>
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
              disabled={true}
              helperText={
                formErrors.cbm.error ? formErrors.cbm.msg : null
              }
              error={formErrors.cbm.error}
            />
          </Grid> 
          <Grid item xs={12} sm={6}>
            <TextField
              id="preventiveCountYearInput"
              label="Preventive count/year"
              name="preventive_count_year"
              onChange={handleChangeForm}
              fullWidth
              type="number"
              value={formValues.preventive_count_year || 1}
              inputRef={preventiveCountYearRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.preventive_count_year.error ? formErrors.preventive_count_year.msg : null
              }
              error={formErrors.preventive_count_year.error}
            />
          </Grid>
          
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
