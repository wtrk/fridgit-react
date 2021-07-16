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
  const [operationsList, setOperationsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
  const [tiersList, setTiersList] = useState([]);

  const [formValues, setFormValues] = useState({
    client: "",
    operation: "",
    citiesIn: "",
    citiesOut: "",
    neighbourhoodsIn: "",
    neighbourhoodsOut: "",
    tiersIn: "",
    tiersOut: "",
  });



  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/operations`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/tiers`,{headers: {Authorization: `Bearer ${token}`}}),
        ]).then(response => {
          setClientsList(response[0].data)
          setOperationsList(response[1].data)
          setCitiesList(response[2].data)
          setNeighbourhoodsList(response[3].data)
          setTiersList(response[4].data)
        })
    };
    fetchData();
  }, []);


  
  const handleChangeAutoComplete= (e, newValue, name) =>{
    if(newValue) setFormValues({ ...formValues, [name]: newValue });
  }

  
  const handleOnSubmit = async () => {
    let filterArray= []
    if(formValues.client._id) filterArray.push(`clientId=${formValues.client._id}`)
    if(formValues.operation._id) filterArray.push(`operationId=${formValues.operation._id}`)
    if(formValues.citiesIn._id) filterArray.push(`citiesInId=${formValues.citiesIn._id}`)
    if(formValues.citiesOut._id) filterArray.push(`citiesOutId=${formValues.citiesOut._id}`)
    if(formValues.neighbourhoodsIn._id) filterArray.push(`neighbourhoodsInId=${formValues.neighbourhoodsIn._id}`)
    if(formValues.neighbourhoodsOut._id) filterArray.push(`neighbourhoodsOutId=${formValues.neighbourhoodsOut._id}`)
    if(formValues.tiersIn._id) filterArray.push(`tiersInId=${formValues.tiersIn._id}`)
    if(formValues.tiersOut._id) filterArray.push(`tiersOutId=${formValues.tiersOut._id}`)
    await axios(
      `${process.env.REACT_APP_BASE_URL}/priceRules?${filterArray.join('&')}`,{responseType: "json", headers: {Authorization: `Bearer ${token}`}}
      ).then(function (response) {
      props.setItems(response.data)
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
                  id="OperationInput"
                  options={operationsList || {}}
                  value={formValues.operation || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"operation")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Operation"
                      name="operation"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="citiesInInput"
                  options={citiesList || {}}
                  value={formValues.citiesIn || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"citiesIn")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cities In"
                      name="citiesIn"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="citiesOutInput"
                  options={citiesList || {}}
                  value={formValues.citiesOut || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"citiesOut")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cities Out"
                      name="citiesOut"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="NeighbourhoodsInInput"
                  options={neighbourhoodsList || {}}
                  value={formValues.neighbourhoodsIn || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"neighbourhoodsIn")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Neighbourhoods In"
                      name="neighbourhoodsIn"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="NeighbourhoodsOutInput"
                  options={neighbourhoodsList || {}}
                  value={formValues.neighbourhoodsOut || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"neighbourhoodsOut")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Neighbourhoods Out"
                      name="neighbourhoodsOut"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="TiersInInput"
                  options={tiersList || {}}
                  value={formValues.tiersIn || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"tiersIn")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tiers In"
                      name="tiersIn"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="TiersOutInput"
                  options={tiersList || {}}
                  value={formValues.tiersOut || {}}
                  getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
                  fullWidth
                  onChange={(e,newValue)=>handleChangeAutoComplete(e,newValue,"tiersOut")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tiers Out"
                      name="tiersOut"
                    />
                  )}
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
