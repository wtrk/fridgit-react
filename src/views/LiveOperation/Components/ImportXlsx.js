import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {CircularProgress, TextField, DialogTitle, DialogContent, DialogActions} from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import axios from 'axios';
import { Close, Save } from "@material-ui/icons";
import { CSVReader } from 'react-papaparse';
import "react-dropzone-uploader/dist/styles.css";
import { getCookie } from '../../../components/auth/Helpers';


const ImportXlsx = (props) => {
  const token = getCookie('token');
  const [showSaveLoader, setShowSaveLoader] = useState(false)
  const [clientValue, setClientValue] = useState({});
  const [dataInJson, setDataInJson] = useState(false)
  const [citiesList, setCitiesList] = useState([])
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([])
  const [cabinetsList, setCabinetsList] = useState([])
   
  useEffect(() => {
    const fetchData = async () => {
      await axios.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/cabinets`,{headers: {Authorization: `Bearer ${token}`}})
      ]).then(response => {
        setCitiesList(response[0].data)
        setNeighbourhoodsList(response[1].data)
        setCabinetsList(response[2].data)
      })
    };
    fetchData();
  }, []);


  const handleOnSubmit = async () => {
    setShowSaveLoader(true)
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/liveOperations/`,
      headers: {Authorization: `Bearer ${token}`},
      data: dataInJson,
    })
    .then(function (response) {
      setShowSaveLoader(false)
      toast.success("Successfully Added", {onClose: () => props.setOpenDialog(false)})

    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleOnDrop = (data) => {
    const jobNumber="JN"+Math.floor(Math.random() * 100000000) + 1
    setDataInJson(data.map(e=>{
      e.data.job_number= jobNumber
      e.data.operation_number= "ON" + Math.floor(Math.random() * 100000000) + 1
      e.data.client_id= clientValue._id
      console.log("e",e)
      return e.data
    }))
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {
    console.log(data)
  }
  const handleChangeClient = (e, newValue) =>{
    setClientValue(newValue)
  }
return <>
    <DialogTitle>
      Import Excel
      <a href="files/cabinetTable.xlsx" className="d-block float-right download-template-link" target="_blank"><i className="fa fa-file-excel-o"></i> Download Template</a>
    </DialogTitle>
    <DialogContent dividers>
<input type="file" id="input" />
          <div className="mb-4">
            <Autocomplete
              id="ClientInput"
              options={props.clientsList || {}}
              value={clientValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeClient}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                />
              )}
            />
          </div>
          <div>
          <CSVReader
            onDrop={handleOnDrop}
            onError={handleOnError}
            addRemoveButton 
            config={{header: true, skipEmptyLines:true}}
            onRemoveFile={handleOnRemoveFile}
          >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
          </div>
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
        Close
      </Button>
      {!showSaveLoader ? (
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="btn btn--save"
          type="submit"
          onClick={handleOnSubmit}
          startIcon={<Save />}
        >
          Save
        </Button>
      ) : (
        <CircularProgress size={30} style={{margin:"0 31pt"}} />
      )}
    </DialogActions>
</>;
};

export default ImportXlsx;
