import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {CircularProgress, TextField, DialogTitle, DialogContent, DialogActions} from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import axios from 'axios';
import { Close, Save } from "@material-ui/icons";
import { CSVReader } from 'react-papaparse';
import "react-dropzone-uploader/dist/styles.css";
import readXlsxFile  from 'read-excel-file'

const ImportXlsx = (props) => {
  const [showSaveLoader, setShowSaveLoader] = useState(false)
  const [notValidData, setNotValidData] = useState([])
  const [validData, setValidData] = useState([])
  const [clientValue, setClientValue] = useState({});
  const [dataInJson, setDataInJson] = useState(false)
  const [fridgesTypes, setFridgesTypes] = useState([])

  const handleOnSubmit = async () => {
    setShowSaveLoader(true)
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/`,
      data: dataInJson,
    })
    .then(function (response) {
      setNotValidData(response.data.notValidData)
      setValidData(response.data.validData)
      setShowSaveLoader(false)
    })
    .catch((error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`)
        ])
        .then(response => {
          setFridgesTypes(response[0].data)
        })
    };
    fetchData();
  }, []);
  const handleChangeClient = (e, newValue) =>{
    setClientValue(newValue)
  }
  const handleChangeClient1 = (e) =>{
    let schema = {
      'SN': {prop: 'sn'},
      'SN 2': {prop: 'sn2'},
      'Type': {prop: 'type'},
      'Brand': {prop: 'brand'},
      'Is New': {prop: 'is_new'}
    }
    readXlsxFile(e.target.files[0], { schema }).then((rows) => {
      let data=rows.rows
      setDataInJson(data.map(eSub=>{
        const type=fridgesTypes.filter(sss=>(sss.name===eSub.type))[0]._id

        const status="Needs test";
        const prev_status="Recommended";
        if(eSub.is_new=="true"){
          status="Operational"
          prev_status="Not Due"
        }
        return {
          ...eSub,client:clientValue._id,status,prev_status,type
          }
      }))
    })
  }
return (
  <>
    <DialogTitle>
      Import Excel
      <a
        href="/files/cabinetTable.csv"
        className="d-block float-right download-template-link"
        target="_blank"
      >
        <i className="fa fa-file-excel-o"></i> Download Template
      </a>
    </DialogTitle>
    <DialogContent dividers>
      <div className="mb-4">
        <Autocomplete
          id="ClientInput"
          options={props.clientsList || {}}
          value={clientValue || {}}
          getOptionLabel={(option) => {
            return Object.keys(option).length !== 0 ? option.name : "";
          }}
          fullWidth
          onChange={handleChangeClient}
          renderInput={(params) => <TextField {...params} label="Client" />}
        />
      </div>
      {Object.keys(clientValue).length ? (
        <div className="mb-4">
          <input type="file" id="input" onChange={handleChangeClient1} />
        </div>
      ) : null}
      <div className="mb-4">
      {(validData.length||notValidData.length)?<table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">SN1 #</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Reason</th>
          </tr>
        </thead>
        <tbody>
          {validData.length?validData.map(e=><tr>
            <th scope="row">{e.sn}</th>
            <td>{e.type}</td>
            <td className="text-success">Success</td>
            <td></td>
          </tr>):null}
          {notValidData.length?notValidData.map(e=><tr className="table-danger">
            <th scope="row">{e.sn}</th>
            <td>{e.type}</td>
            <td className="text-danger">Failed</td>
            <td>SN already Exists</td>
          </tr>):null}
        </tbody>
      </table>:null}
        
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
        <CircularProgress size={30} style={{ margin: "0 31pt" }} />
      )}
    </DialogActions>
  </>
);
};

export default ImportXlsx;
