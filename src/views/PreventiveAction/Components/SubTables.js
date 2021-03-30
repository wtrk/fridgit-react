import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save,Check } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import CustomToolbar from "CustomToolbar";
import {Alert} from '@material-ui/lab';

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
    const [submit, setSubmit] = useState(0); //modal title
    const [answers, setAnswers] = useState([]);
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const nameArRef = useRef()
    const categoryRef = useRef()
    const categoryArRef = useRef()
    const subCategoryRef = useRef()
    const subCategoryArRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      nameAr: "",
      category: "",
      categoryAr: "",
      subCategory: "",
      subCategoryAr: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      nameAr: {error:false,msg:""},
      category: {error:false,msg:""},
      categoryAr: {error:false,msg:""},
      subCategory: {error:false,msg:""},
      subCategoryAr: {error:false,msg:""},
    });
    
  useEffect(()=>{
    nameRef.current.focus()
    if (props.preventiveActionId) {
      const fetchData = async () => {
        const preventiveAction = await axios(
          `${process.env.REACT_APP_BASE_URL}/preventiveActions/${props.preventiveActionId}`,
          {
            responseType: "json",
          }
        ).then((response) => {
          setFormValues(response.data[0]);
          setAnswers(response.data[0].answers);
        });
      };
      fetchData();
    }
  },[])

  const [answersSelect, setAnswersSelect] = useState({});
  const add1RowInAnswers = () => {
    if(answersSelect.name){
      setAnswers([...answers, answersSelect]);
    }else{
      setAnswers([...answers.filter(e=>e.name), { name: "",nameAr:"", reportable:false, obligatory:false }]);
    }
  };

  const handleChangeAnswersInput = (e) => {
    const { name, value } = e.target;
    setAnswersSelect({...answersSelect, [name] : value});
  };
  const handleChangeAnswersSwitch = (e) => {
    const { name, checked } = e.target;
    setAnswersSelect({...answersSelect, [name] : checked});
  };
  


  const keyPressAnswersHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      if(answersSelect.name) setAnswers([...answers.filter(e=>e.name), answersSelect]);
    }
  }
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.nameAr){
        case "name": nameArRef.current.focus();break;
        case "nameAr": categoryRef.current.focus();break;
        case "category": categoryArRef.current.focus();break;
        case "categoryAr": subCategoryRef.current.focus();break;
        case "subCategory": subCategoryArRef.current.focus();break;
        case "subCategoryAr": submitRef.current.focus();break;
        default: nameRef.current.focus();
      }
    }
  }
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const submitFirstRun = useRef(true);
useEffect(()=>{
  const fetchData = async () => {
    if (submitFirstRun.current) {
      submitFirstRun.current = false;
    }else{
      if(submit!==1){
        for (const [key, value] of Object.entries(formErrors)) {
          if(value.error===true) return setOpenAlertError(true);
        }
        if (props.preventiveActionId) {
            await axios({
              method: "put",
              url: `${process.env.REACT_APP_BASE_URL}/preventiveActions/${props.preventiveActionId}`,
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
            url: `${process.env.REACT_APP_BASE_URL}/preventiveActions/`,
            data: [formValues],
          })
            .then(function (response) {
              setOpenAlertSuccess(true);
              setFormValues({
                name: "",
                nameAr: "",
                category: "",
                categoryAr: "",
                subCategory: "",
                subCategoryAr: ""
              });
              props.handleClose()
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  };
  fetchData();
},[submit])

const handleOnSubmit = async () => {
  console.log("answersSelect",answersSelect)
  if(answersSelect.name){
    setAnswers([...answers.filter(e=>e.name), answersSelect]);
    setSubmit(1)
  }else{
    setSubmit(2)
  }
}

useEffect(()=>{
  setFormValues({ ...formValues, answers:answers.filter(e=>e.name!="") })
  setAnswersSelect({})
  if(submit===1) setSubmit(0)
},[answers])


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
          The preventiveAction is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>


      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              id="nameInput"
              label="Description"
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
          <Grid item xs={12} md={6}>
            <TextField
              id="nameArInput"
              label="Arabic Description"
              name="nameAr"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.nameAr || ""}
              inputRef={nameArRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.nameAr.error ? formErrors.nameAr.msg : null
              }
              error={formErrors.nameAr.error}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
              helperText={
                formErrors.category.error ? formErrors.category.msg : null
              }
              error={formErrors.category.error}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="categoryArInput"
              label="Arabic Category"
              name="categoryAr"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.categoryAr || ""}
              inputRef={categoryArRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.categoryAr.error ? formErrors.categoryAr.msg : null
              }
              error={formErrors.categoryAr.error}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="subCategoryInput"
              label="SubCategory"
              name="subCategory"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.subCategory || ""}
              inputRef={subCategoryRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.subCategory.error ? formErrors.subCategory.msg : null
              }
              error={formErrors.subCategory.error}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="subCategoryArInput"
              label="Arabic Category"
              name="subCategoryAr"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.subCategoryAr || ""}
              inputRef={subCategoryArRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={
                formErrors.subCategoryAr.error ? formErrors.subCategoryAr.msg : null
              }
              error={formErrors.subCategoryAr.error}
            />
          </Grid>
          
          <Grid item xs={12}>
            <MUIDataTable
              title="Answers"
              data={answers}
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
                              id="answersInput"
                              label="Add Name"
                              onChange={handleChangeAnswersInput}
                              onKeyDown={keyPressAnswersHandler}
                              fullWidth
                              value={answersSelect.name || ""}
                              name="name"
                            />
                          </div>
                        );
                      } else {
                        return <div>{value}</div>;
                      }
                    },
                  },
                },
                {
                  name: "nameAr",
                  label: "Arabic Name",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      if (value == "") {
                        return (
                          <div>
                            <TextField
                              id="answersInput"
                              label="Add Arabic Name"
                              onChange={handleChangeAnswersInput}
                              onKeyDown={keyPressAnswersHandler}
                              fullWidth
                              value={answersSelect.nameAr || ""}
                              name="nameAr"
                            />
                          </div>
                        );
                      } else {
                        return <div>{value}</div>;
                      }
                    },
                  },
                },
                {
                  name: "reportable",
                  label: "Reportable",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      
                      if(tableMeta.rowData[0]===""){
                        return <FormControlLabel
                          control={<Switch checked={answersSelect.reportable} onChange={handleChangeAnswersSwitch} name="reportable" color="primary" />}
                          label="Reportable"
                        />
                      }else{
                        return (value) ? <Check className="text-success" /> : <Close className="text-danger" /> 
                      }
                    },
                  },
                },
                {
                  name: "obligatory",
                  label: "Obligatory",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      if(tableMeta.rowData[0]===""){
                        return <FormControlLabel
                          control={<Switch checked={answersSelect.obligatory} onChange={handleChangeAnswersSwitch} name="obligatory" color="primary" />}
                          label="Obligatory"
                        />
                      }else{
                        return (value) ? <Check className="text-success" /> : <Close className="text-danger" /> 
                      }
                    },
                  },
                },
              ]}
              options={{
                filter: false,
                customToolbar: () => {
                  return <CustomToolbar listener={add1RowInAnswers} />;
                },
                onRowsDelete: (rowsDeleted, dataRows) => {
                  const idsToDelete = rowsDeleted.data.map(d => answers[d.dataIndex]._id);
                  const rowsToKeep=answers.filter(e=> !idsToDelete.includes(e._id))
                  setAnswers(rowsToKeep)
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
