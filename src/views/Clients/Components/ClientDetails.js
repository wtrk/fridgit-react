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
  Slide
} from "@material-ui/core";
import {Autocomplete, Alert} from '@material-ui/lab';
import MUIDataTable from "mui-datatables";
import { Close, Save, ArrowBackIosOutlined,Publish } from "@material-ui/icons";
import axios from 'axios';
import SubTablesLegal from "./SubTablesLegal.js";
import SubTablesContact from "./SubTablesContact.js";
import "../Clients.css";
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Clients = (props) => {
  const token = getCookie('token');
  const clientId=props.data._id
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const [openAddLegal, setOpenAddLegal] = useState(false);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [dataLegal, setDataLegal] = useState(props.data.legals);
  const [dataContacts, setDataContacts] = useState(props.data.contacts);
  const [image, setImage] = useState({ preview: "", file: "" });
  const [companiesList, setCompaniesList] = useState([]);
  const [companyValue, setCompanyValue] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/companies`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`}
      }).then((response) => {
        setCompaniesList(response.data)
        setCompanyValue(response.data.find(e=> e._id==formValues.company_id))
      });
    };
    fetchData();
  }, [formValues]);

  const handleChangeCompany = (e, newValue) =>{
    setCompanyValue(newValue)
    if(newValue) setFormValues({ ...formValues, company_id: newValue._id });
  }

  const handleChangeImg = e => {
    if (e.target.files.length) {
      const imageArray={
        preview: URL.createObjectURL(e.target.files[0]),
        file: e.target.files[0]
      }
      setImage(imageArray);
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
      url: `${process.env.REACT_APP_BASE_URL}/clients/img/${clientId}`,
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
      const idsToDelete = rowsDeleted.data.map(d => dataContacts[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/clientContacts/${clientId}/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`}
        }).then((response) => {
          console.log("deleted")
        });
    },
    rowsPerPage: 100,
    customFooter: () => ""
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
      const idsToDelete = rowsDeleted.data.map(d => dataLegal[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/clientLegals/${clientId}/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`}
        }).then((response) => {
          console.log("deleted")
        });
    },
    rowsPerPage: 100,
    customFooter: () => ""
  };
  

  const handleAddLegal = () => setOpenAddLegal(true);
  const handleCloseAddLegal = () => setOpenAddLegal(false);

  const handleAddContact = () => setOpenAddContact(true);
  const handleCloseAddContact = () => setOpenAddContact(false);

/*********************************FORM */

const [formValues, setFormValues] = useState({
  name: props.data.name || "",
  company_id: props.data.company_id || "",
  address: props.data.address || "",
  phone: props.data.phone || "",
  email: props.data.email || ""
});
const [formErrors, setFormErrors] = useState({
  name: {error:false,msg:""},
  company_id: {error:false,msg:""},
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
      if(value.error===true) return toast.error("Please validate the Form and submit it again");
  }
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/clients/${clientId}`,
      headers: {Authorization: `Bearer ${token}`},
      data: formValues
    })
      .then(function (response) {
        toast.success("Successfully Updated", {onClose: () => props.handleClose()});
      })
      .catch((error) => {
        console.log(error);
      });
}

  return (
    <>
    <ToastContainer />
      <AppBar>
        <Toolbar>
          <Close onClick={props.handleClose} className="btnIcon mr-3" />
          <Typography variant="h6">Client Details</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "80px 30px 0" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div className="clientProfile">
              <div>
                {openAlertSuccess?
                  <div className="alert alert-success" role="alert">
                    The Image was successfully updated
                  </div>
                :null}
                {!image.preview ? (
                  <label htmlFor="upload-button" style={{width:"100%"}}>
                  {props.data.photo ? (
                    <img src={`/img/clients/${props.data.photo}`} alt="" style={{width:"100%"}} className="mb-4" /> 
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
              </div>
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
              {/* <TextField
                label="Company"
                name="company"
                className="mb-4"
                fullWidth
                value={formValues.company}
                onChange={handleChangeForm}
                onBlur={validateInputHandler}
                helperText={
                  formErrors.company.error ? formErrors.company.msg : null
                }
                error={formErrors.company.error}
              /> */}
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
              <Autocomplete
                id="CompanyInput"
                options={companiesList || {}}
                value={companyValue || {}}
                getOptionLabel={(option) => {
                  return Object.keys(option).length!==0 ? option.name : "";
                }}
                fullWidth
                onChange={handleChangeCompany}
                className="mb-4"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="billed from company"
                    onBlur={validateInputHandler}
                    helperText={
                      formErrors.company_id.error ? formErrors.company_id.msg : null
                    }
                    error={formErrors.company_id.error}
                  />
                )}
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
              data={dataLegal}
              columns={columnsLegalInfo}
              options={optionsLegalInfo}
              fullWidth
            />
            <MUIDataTable
              title={"CONTACT"}
              data={dataContacts}
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
            dataLegal={dataLegal}
            setDataLegal={setDataLegal}
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
            dataContacts={dataContacts}
            setDataContacts={setDataContacts}
          />
        </Dialog>
     
      </div>  
    </>
  );
};

export default Clients;
