import React, { Fragment, useState, useRef, useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Collapse, Slide, Dialog 
} from "@material-ui/core";
import axios from 'axios';
import { Close,Save,MonetizationOn } from "@material-ui/icons";
import Moment from "react-moment";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete, Alert} from '@material-ui/lab';
import {noToolbarTheme} from "assets/css/datatable-theme.js";
import InvoicesPdf from "./InvoicesPdf.js";
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const options = {
  filter: false,
  download: false,
  print: false,
  search: false
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
    const [finance, setFinance] = useState([]);
    const [companyId, setCompanyId] = useState();
    const [companyValue, setCompanyValue] = useState();
    const [clientValue, setClientValue] = useState({}); //Chosen Client
    const [openPdf,setOpenPdf] = useState(false);
    const [handleOpenPdf,setHandleOpenPdf] = useState(false);
    const classes = useStyles(); //custom css
    const nameRef = useRef()
    const fromRef = useRef()
    const toRef = useRef()
    const clientRef = useRef()
    const submitRef = useRef()
    const [formValues, setFormValues] = useState({
      name: "",
      from: "",
      to: "",
      user_id: JSON.parse(localStorage.getItem("user"))._id,
      client_id: ""
    });
    const [formErrors, setFormErrors] = useState({
      name: {error:false,msg:""},
      from: {error:false,msg:""},
      to: {error:false,msg:""},
      client_id: {error:false,msg:""}
    });
    const [financeTotal, setFinanceTotal] = useState({});
    
  useEffect(()=>{
    nameRef.current.focus()
      const fetchData = async () => {
        if (props.invoiceId) {
          const invoice = await axios(
            `${process.env.REACT_APP_BASE_URL}/invoices/${props.invoiceId}`,
            {
              responseType: "json", headers: {Authorization: `Bearer ${token}`},
            }
          ).then((response) => {
            response.data.data.from=moment(response.data.data.from).format("YYYY-MM-DD")
            response.data.data.to=moment(response.data.data.to).format("YYYY-MM-DD")
            setFormValues(response.data.data);
            setFinance(response.data.finance)
            setCompanyId(response.data.companyId)
            return response.data.data
          }).then((response)=>{
            setClientValue(props.clientsList.find(e=> e._id==response.client_id))
          });
        }
      };
      fetchData();
  },[])
  useEffect(()=>{
    let branding_fees=finance.map(e=>e.branding_fees||0);
    let cabinet_testing_fees=finance.map(e=>e.cabinet_testing_fees||0);
    let corrective_reaction=finance.map(e=>e.corrective_reaction||0);
    let corrective_service_in_house=finance.map(e=>e.corrective_service_in_house||0);
    let drop=finance.map(e=>e.drop||0);
    let exchange_corrective_reaction=finance.map(e=>e.exchange_corrective_reaction||0);
    let handling_in=finance.map(e=>e.handling_in||0);
    let in_house_preventive_maintenance=finance.map(e=>e.in_house_preventive_maintenance||0);
    let preventive_maintenance=finance.map(e=>e.preventive_maintenance||0);
    let storage=finance.map(e=>e.storage||0);
    let transportation_fees=finance.map(e=>e.transportation_fees||0);

    branding_fees=branding_fees.length?branding_fees.reduce((a,b)=>a+b):0
    cabinet_testing_fees=cabinet_testing_fees.length?cabinet_testing_fees.reduce((a,b)=>a+b):0
    corrective_reaction=corrective_reaction.length?corrective_reaction.reduce((a,b)=>a+b):0
    corrective_service_in_house=corrective_service_in_house.length?corrective_service_in_house.reduce((a,b)=>a+b):0
    drop=drop.length?drop.reduce((a,b)=>a+b):0
    exchange_corrective_reaction=exchange_corrective_reaction.length?exchange_corrective_reaction.reduce((a,b)=>a+b):0
    handling_in=handling_in.length?handling_in.reduce((a,b)=>a+b):0
    in_house_preventive_maintenance=in_house_preventive_maintenance.length?in_house_preventive_maintenance.reduce((a,b)=>a+b):0
    preventive_maintenance=preventive_maintenance.length?preventive_maintenance.reduce((a,b)=>a+b):0
    storage=storage.length?storage.reduce((a,b)=>a+b):0
    transportation_fees=transportation_fees.length?transportation_fees.reduce((a,b)=>a+b):0
    
    setFinanceTotal({
      branding_fees,
      cabinet_testing_fees,
      corrective_reaction,
      corrective_service_in_house,
      drop,
      exchange_corrective_reaction,
      handling_in,
      in_house_preventive_maintenance,
      preventive_maintenance,
      storage,
      transportation_fees
    });
  },[finance])
  
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.name){
        case "name": fromRef.current.focus();break;
        case "from": toRef.current.focus();break;
        case "to": clientRef.current.focus();break;
        case "client_id":  submitRef.current.focus();break;
        default: nameRef.current.focus();
      }
    }
}
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleChangeClient = (e, newValue) =>{
  setClientValue(newValue)
  if(newValue) setFormValues({ ...formValues, client_id: newValue._id });
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
  
  if (props.invoiceId) {
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/invoices/${props.invoiceId}`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{...formValues,finance_ids:finance.map(e=>e._id)}],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      toast.success("Successfully Updated", {onClose: () => props.handleClose()});
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/invoices/`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{...formValues,finance_ids:finance.map(e=>e._id),reference_number:props.newRefNum}],
    })
    .then(function (response) {
      setOpenAlertSuccess(true);
      setFormValues({
        name: "",
        from: "",
        to: "",
        client_id:""
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
}

const handleGetFinance = async () => {
  if(formValues.client_id && formValues.from && formValues.to){
    let submittedQuery=""
    submittedQuery+="fromDate="+formValues.from
    submittedQuery+="&toDate="+formValues.to
    submittedQuery+="&clientId="+formValues.client_id
    submittedQuery+="&userId="+formValues.user_id
    await axios(`${process.env.REACT_APP_BASE_URL}/financialForInvoice?${submittedQuery}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      setFinance(response.data.data)
    })
  }
}

const handlePDF = async () => {
  
  if (props.invoiceId) {
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/invoices/${props.invoiceId}`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{...formValues,finance_ids:finance.map(e=>e._id)}],
    })
    .then(function (response) {
      
      toast.success("Successfully Updated", {onClose: () => setHandleOpenPdf(true)});
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/invoices/`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{...formValues,finance_ids:finance.map(e=>e._id),reference_number:props.newRefNum}],
    })
    .then(function (response) {
      setCompanyId(response.data.companyId)
      setHandleOpenPdf(true)
    })
    .catch((error) => {
      console.log(error);
    });
  }

}

useEffect(()=>{
  if(handleOpenPdf===true){
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/companies/${companyId}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setCompanyValue(response.data)
        return response.data
      }).then((response)=>{
        setOpenPdf(true)
      });
    };
    fetchData();
  }
},[handleOpenPdf])

const columns = [
  {
    name: "_id",
    options: {display: false}
  },
  {name: "createdAt",
  label: "Day",
  options: {
    customBodyRender: (value, tableMeta, updateValue) => (
      <Moment format="DD MMM YYYY">{value}</Moment>
    ),
  },
},
{ label: "Handling IN / OUT", name: "handling_in" },
{ label: "Storage", name: "storage" },
{ label: "In House Prev", name: "in_house_preventive_maintenance" },
{ label: "In House Corrective", name: "corrective_service_in_house" },
{ label: "Testing", name: "cabinet_testing_fees" },
{ label: "Branding", name: "branding_fees" },
{ label: "Drop", name: "drop" },
{ label: "Transportation", name: "transportation_fees" },
{ label: "Preventive", name: "preventive_maintenance" },
{ label: "Corrective", name: "exchange_corrective_reaction" },
{ label: "Total", name: "total" },
];

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
          The invoice is successfully created
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
            <Autocomplete
              id="ClientInput"
              options={props.clientsList || {}}
              value={clientValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length !== 0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeClient}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  inputRef={clientRef}
                  onKeyDown={keyPressHandler}
                  onBlur={validateInputHandler}
                  helperText={
                    formErrors.client_id.error ? formErrors.client_id.msg : null
                  }
                  error={formErrors.client_id.error}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="nameInput"
              label="Notes"
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
              id="fromInput"
              label="From"
              name="from"
              type="date"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.from || ""}
              inputRef={fromRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.from.error ? formErrors.from.msg : null}
              error={formErrors.from.error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="toInput"
              label="To"
              name="to"
              type="date"
              onChange={handleChangeForm}
              fullWidth
              value={formValues.to || ""}
              inputRef={toRef}
              onKeyDown={keyPressHandler}
              onBlur={validateInputHandler}
              helperText={formErrors.to.error ? formErrors.to.msg : null}
              error={formErrors.to.error}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {handleOpenPdf===false?<Grid item xs={12} className="clientTables">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              type="submit"
              startIcon={<MonetizationOn />}
              ref={submitRef}
              onClick={handleGetFinance}
            >
              Get Finance
            </Button>
          </Grid>:null}

          <Grid item xs={12} className="clientTables">
            <MuiThemeProvider theme={noToolbarTheme}>
              <MUIDataTable
                title=""
                data={finance}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </Grid>

          <Grid item xs={12} className="clientTables">
          {handleOpenPdf===false?<Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              type="submit"
              startIcon={<Save />}
              ref={submitRef}
              onClick={handlePDF}
            >
              Save and View PDF
            </Button>:null}
            {handleOpenPdf===false?<Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              type="submit"
              startIcon={<Save />}
              ref={submitRef}
              onClick={handleOnSubmit}
            >
              Save and Exit
            </Button>:null}
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
      <Dialog
        maxWidth={"lg"}
        fullWidth
        TransitionComponent={Transition}
        open={openPdf}
        onClose={() => setOpenPdf(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <InvoicesPdf setOpenDialog={setOpenPdf} financeTotal={financeTotal} companyValue={companyValue} referenceNum={formValues.reference_number||props.newRefNum} />
        </div>
      </Dialog>
    </Fragment>
  );
};

export default SubTables;
