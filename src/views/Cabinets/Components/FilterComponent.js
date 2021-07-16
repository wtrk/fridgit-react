import React, { useState, useEffect } from "react";
import {
  TextField,DialogContent, DialogActions} from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import axios from 'axios';
import { Close, Save } from "@material-ui/icons";
import { getCookie } from '../../../components/auth/Helpers';

import "react-dropzone-uploader/dist/styles.css";



const FilterComponent = (props) => {
  const token = getCookie('token');
  const [clientsList, setClientsList] = useState([]);
  const [fridgesTypesList, setFridgesTypesList] = useState([]);
  const [statusList, setStatusList] = useState(["In Store","Operational","Damaged","Needs test"]);
  const [prevStatusList, setPrevStatusList] = useState(["Due","Recomended"]);

  const [formValues, setFormValues] = useState({
    client: "",
    fridgesType: "",
    status:"",
    prevStatus:"",
    fromDate:"",
    toDate:""
  });



  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`,{headers: {Authorization: `Bearer ${token}`}})
        ]).then(response => {
          setClientsList(response[0].data)
          setFridgesTypesList(response[1].data)
        })
    };
    fetchData();
  }, []);


  
  const handleChangeAutoComplete= (e, newValue, name) =>{
    if(newValue) setFormValues({ ...formValues, [name]: newValue });
  }
  
  const handleSearchDate = (e) => {
    const {name,value} = e.target
    if(value) setFormValues({ ...formValues, [name]: value });
  }

  
  const handleOnSubmit = async () => {
    let filterArray= []
    if(formValues.client._id) filterArray.push(`clientId=${formValues.client._id}`)
    if(formValues.fridgesType._id) filterArray.push(`fridgeTypeId=${formValues.fridgesType._id}`)
    if(formValues.prevStatus) filterArray.push(`prevStatus=${formValues.prevStatus}`)
    if(formValues.status) filterArray.push(`status=${formValues.status}`)
    if(formValues.fromDate) filterArray.push(`fromDate=${formValues.fromDate}`)
    if(formValues.toDate) filterArray.push(`toDate=${formValues.toDate}`)
    await axios(
      `${process.env.REACT_APP_BASE_URL}/cabinets?${filterArray.join('&')}`,{responseType: "json", headers: {Authorization: `Bearer ${token}`}}
      ).then(function (response) {
        props.setPagingInfo({...props.pagingInfo,count:response.data.count});
      props.setItems(response.data.data)
      props.setOpenDialog(false)
    })
    .catch((error) => {
      console.log(error);
    }); 
  }
return <>
    
    <DialogContent dividers><h3>Cabinets Report Filter</h3></DialogContent>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="ClientInput"
                  options={clientsList || {}}
                  value={formValues.client || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"client")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Client"
                      name="client"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="fridgesTypeInput"
                  options={fridgesTypesList || {}}
                  value={formValues.fridgesType || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"fridgesType")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fridges Type"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="statusInput"
                  options={statusList}
                  value={formValues.status || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"status")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="prevStatusInput"
                  options={prevStatusList}
                  value={formValues.prevStatus || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"prevStatus")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Preventive Status"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
              <TextField
                id="fromDate"
                name="fromDate"
                label="From Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(handleSearchDate)}
              />
              </Grid>
              <Grid item xs={12} sm={4}>
              <TextField
                id="toDate"
                name="toDate"
                label="To Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(handleSearchDate)}
              />
              </Grid>
            </Grid>
            </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={() => props.setOpenDialog(false)}
              startIcon={<Close />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={handleOnSubmit}
              startIcon={<Save />}
            >
              Save
            </Button>
          </DialogActions>
        
</>
};

export default FilterComponent;
