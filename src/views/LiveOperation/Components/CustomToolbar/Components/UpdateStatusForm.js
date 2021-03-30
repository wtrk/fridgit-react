import React, {useState,useRef,useEffect} from "react";
import Moment from "react-moment";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  AppBar,
  Typography,
  Toolbar,
  TextField,
  Grid
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { Close, Save, Check} from "@material-ui/icons";
import axios from 'axios';

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
  }
}));
const UpdateStatusForm = (props) => {
    const classes = useStyles(); //custom css
    const [formValues,setFormValues] = useState({status: ""});
    const [operationNumberValue, setOperationNumberValue] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [supplierValue, setSupplierValue] = useState({});
    const [reportArray, setReportArray] = useState([]);
    const [saveClicked, setSaveClicked] = useState(1)
    const statusList = ["In Progress","Completed","Failed","On Hold","Assigned","Unassigned","Accepted","Canceled"];

    const handleChangeTextfield = (e, n) => {
    const { name, value } = e.target;
    setFormValues({
        ...formValues,
        [name]: value
    });
    setSaveClicked(1)
    };
    useEffect(()=>{
        setOperationNumberValue(props.dataToUpdate);
    },[])
    
    useEffect(()=>{
        const fetchData = async () => {
          const suppliers = await axios(`${process.env.REACT_APP_BASE_URL}/suppliers`, {
            responseType: "json",
          }).then((response) => {
            setSuppliersList(response.data)
            return response.data
          });
        };
        fetchData();
    },[])
    const handleChangeSupplier = (e, newValue) =>{
      setSupplierValue(newValue)
      if(newValue) setFormValues({ ...formValues, supplier_id: newValue._id });
    }
    const handleChangeSn = (event,newValue) => {
        setOperationNumberValue(newValue);
        setSaveClicked(1)
    }
    const handleSaveForm = async () => {
        // publish it on frontend
        //if formValue updated erase the report
        if(saveClicked===1){
            let itemsToUpdate=props.items.filter(e=>{
                return operationNumberValue.includes(e.operation_number)
            })
            setReportArray(itemsToUpdate.map(e=>{
                let response="success"
                let reason=""
                if(e.status==="Completed"){
                    response="error";
                    reason="Cannot updated Completed operations"
                }else if(e.status==="Canceled"){
                    response="error";
                    reason="Cannot updated Canceled operations"
                }
                return {
                    "_id": e._id,
                    "operation_number": e.operation_number,
                    "sn": e.sn,
                    "previous_status": e.status,
                    "new_status": formValues.status,
                    "response": response,
                    "reason": reason
                }
            }))
            setSaveClicked(2)
        }else{
          if(formValues.status==="assigned"){

          }
          let idsToUpdate=reportArray.filter(e=>{
              return e.previous_status!="Completed" && e.previous_status!="Canceled"
          })
            idsToUpdate.forEach(async e=>{
                await axios({
                    method: "put",
                    url: `${process.env.REACT_APP_BASE_URL}/liveOperations/${e._id}`,
                    data: [{
                    status: formValues.status,
                    supplier_id: formValues.status==="Unassigned" ? "" : formValues.supplier_id,
                    last_status_update: new Date(),
                    
                    }]
                })
                .then((response) => {
                    props.setStatusUpdated(props.selectedRows)
                    props.setSelectedRows([]);
                });
                await axios({
                    method: "post",
                    url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
                    data: {
                    status: formValues.status,
                    user: "User 1",
                    notes: "",
                    operation_number: e.operation_number,
                    },
                })
                if(formValues.status==="Completed" || formValues.status==="Canceled"){
                  axios({
                    method: "put",
                    url: `${process.env.REACT_APP_BASE_URL}/cabinets/bySn/${e.sn}`,
                    data: [{
                      booked:false
                    }]
                  })
                }
            })
        }
    };
    return (
      <>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Close
              onClick={() => props.setOpenUpdateStatusForm(false)}
              className="btnIcon"
            />
            <Typography variant="h6" className={classes.title}>
              Add
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3} justify="center" alignContent="center">
          <Grid item xs={11}>
            <Autocomplete
              multiple
              freeSolo
              fullWidth
              id="operationNumberInput"
              value={operationNumberValue || {}}
              options={[]}
              getOptionLabel={(option) => option}
              onChange={handleChangeSn}
              renderInput={(params) => (
                <TextField {...params} label="operationNumber" />
              )}
            />
          </Grid>
          <Grid item xs={11}>
            <FormControl className={classes.formControl}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select
                labelId="statusLabel"
                id="statusInput"
                name="status"
                value={formValues.status || ""}
                onChange={handleChangeTextfield}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusList.map((e, i) => (
                  <MenuItem value={e} key={i}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {formValues.status==="Assigned"?
          <Grid item xs={11}>
            <Autocomplete
              id="SupplierInput"
              options={suppliersList || {}}
              value={supplierValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length!==0 ? option.name : "";
              }}
              fullWidth
              onChange={handleChangeSupplier}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                />
              )}
            />
          </Grid>
          :null}

          {reportArray.length && saveClicked!=1?
          <Grid item xs={11}>
          <table className="table table-bordered mt-3">
            <thead>
                <tr>
                    <th scope="col">Operation Number</th>
                    <th scope="col">SN</th>
                    <th scope="col">Previous Status</th>
                    <th scope="col">New Status</th>
                    <th scope="col">Validation</th>
                    <th scope="col">Reason</th>
                </tr>
            </thead>
            <tbody>
                {reportArray.map(e=>
                <tr key={e.operation_number}>
                    <th scope="row">{e.operation_number}</th>
                    <td>{e.sn}</td>
                    <td>{e.previous_status}</td>
                    <td>{e.new_status}</td>
                    <td className="text-center">{(e.response==="success") ? <Check className="text-success" /> : <Close className="text-danger" /> }</td>
                    <td>{e.reason}</td>
                </tr>
                )}
            </tbody>
            </table>
          </Grid>
          :null}
          
          <Grid item xs={11} className="clientTables">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={handleSaveForm}
              startIcon={<Save />}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={() => props.setOpenUpdateStatusForm(false)}
              startIcon={<Close />}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </>
    );
}
export default UpdateStatusForm;
