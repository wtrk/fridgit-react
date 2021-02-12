import React, { useEffect, useState } from "react";
import CustomToolbar from "CustomToolbar";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar,
  Dialog,
  Slide,
  Collapse
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import MUIDataTable from "mui-datatables";
import { Close, Save, ArrowBackIosOutlined } from "@material-ui/icons";
import axios from 'axios';
import SubTablesLegal from "./SubTablesLegal.js";
import SubTablesContact from "./SubTablesContact.js";
import "../Clients.css";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Clients = (props) => {
  const clientId=props.data._id
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const [openAddLegal, setOpenAddLegal] = useState(false);
  const [openAddContact, setOpenAddContact] = useState(false);
  const optionsContact = {
    filterType: "checkbox",
    rowsPerPage: 6,
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => handleAddContact()}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => props.data.contacts[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/clientContacts/${clientId}/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    }
  };
  const columnsContact = [
    {
      name: "_id",
      options: {
        display: false,
      },
    },
    { name: "name", label: "Entity Name" },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "email", label: "Email" },
    { name: "position", label: "Position" },
  ];

  const columnsLegalInfo = [
    {
      name: "_id",
      options: {
        display: false,
      },
    },
    { name: "name", label: "Entity Name" },
    { name: "nickname", label: "Nickname" },
    { name: "cr_number", label: "CR #" },
    { name: "vat_number", label: "VAT #" },
    { name: "vat_percentage", label: "VAT %" },
  ];

  const optionsLegalInfo = {
    rowsPerPage: 6,
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => handleAddLegal()}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => props.data.legals[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/clientLegals/${clientId}/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    }
  };
  

  const handleAddLegal = () => setOpenAddLegal(true);
  const handleCloseAddLegal = () => setOpenAddLegal(false);

  const handleAddContact = () => setOpenAddContact(true);
  const handleCloseAddContact = () => setOpenAddContact(false);

/*********************************FORM */

const [formValues, setFormValues] = useState({
  name: props.data.name || "",
  address: props.data.address || "",
  phone: props.data.phone || "",
  email: props.data.email || ""
});
const [formErrors, setFormErrors] = useState({
  name: {error:false,msg:""},
  address: {error:false,msg:""},
  phone: {error:false,msg:""},
  email: {error:false,msg:""}
});
const handleChangeForm = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const validateInputHandler = (e) => {
  const { name, value } = e.target;
  const requiredInput = value.toString().trim().length ? false : true;
  setFormErrors({ ...formErrors, [name]: {error: requiredInput, msg: "This field is required"} });
  if(name==="email"){
      const invalidEmail = !/\S+@\S+\.\S+/.test(value);
      setFormErrors({ ...formErrors, [name]: {error: invalidEmail, msg: "Enter a valid email address"} });
  }
}
const handleOnSubmit = async () => {
  for (const [key, value] of Object.entries(formErrors)) {
      if(value.error===true) return setOpenAlertError(true);
  }
    await axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/clients/${clientId}`,
      data: formValues
    })
      .then(function (response) {
        setOpenAlertSuccess(true);
        props.handleClose()
      })
      .catch((error) => {
        console.log(error);
      });
}

  return (
    <>
      <AppBar>
        <Toolbar>
          <Close onClick={props.handleClose} className="btnIcon mr-3" />
          <Typography variant="h6">Client Details</Typography>
        </Toolbar>
      </AppBar>
      <Collapse in={openAlertSuccess}>
        <Alert severity="success" onClick={() => setOpenAlertSuccess(false)}>
          The country is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>
      <div style={{ padding: "80px 30px 0" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div className="clientProfile">
              <img src={require("../../../assets/img/sidebar-2.jpg")} alt="" className="mb-4" />
              <TextField
                label="Company"
                name="name"
                className="mb-4"
                fullWidth
                value={formValues.name}
                onChange={handleChangeForm}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.name.error ? formErrors.name.msg : null
                }
                error={formErrors.name.error}
              />
              <TextField
                label="Address"
                name="address"
                className="mb-4"
                fullWidth
                value={formValues.address}
                onChange={handleChangeForm}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.address.error ? formErrors.address.msg : null
                }
                error={formErrors.address.error}
              />
              <TextField
                label="Phone"
                name="phone"
                className="mb-4"
                fullWidth
                value={formValues.phone}
                onChange={handleChangeForm}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.phone.error ? formErrors.phone.msg : null
                }
                error={formErrors.phone.error}
              />
              <TextField
                label="Email"
                name="email"
                className="mb-4"
                fullWidth
                value={formValues.email}
                onChange={handleChangeForm}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.email.error ? formErrors.email.msg : null
                }
                error={formErrors.email.error}
              />
              <div className="d-flex justify-content-end">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="btn btn--save"
                onClick={props.handleClose}
                startIcon={<ArrowBackIosOutlined />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className="btn btn--save"
                startIcon={<Save />}
                className="ml-3"
                onClick={handleOnSubmit}
              >
                Save
              </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={8} className="clientTables">
            <MUIDataTable
              title={"LEGAL INFO"}
              data={props.data.legals}
              columns={columnsLegalInfo}
              options={optionsLegalInfo}
              fullWidth
            />
            <MUIDataTable
              title={"CONTACT"}
              data={props.data.contacts}
              columns={columnsContact}
              options={optionsContact}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
      <div>
        <Dialog
          fullScreen
          open={openAddLegal}
          onClose={handleCloseAddLegal}
          TransitionComponent={Transition}
        >
          <SubTablesLegal
            handleClose={handleCloseAddLegal}
            clientId={clientId}
          />
        </Dialog>
        
        <Dialog
          fullScreen
          open={openAddContact}
          onClose={handleCloseAddContact}
          TransitionComponent={Transition}
        >
          <SubTablesContact
            handleClose={handleCloseAddContact}
            clientId={clientId}
          />
        </Dialog>
     
      </div>  
    </>
  );
};

export default Clients;
