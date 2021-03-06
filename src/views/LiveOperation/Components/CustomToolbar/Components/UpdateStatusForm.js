import React, {useState,useRef,useEffect} from "react";
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
import { getCookie } from '../../../../../components/auth/Helpers';
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
  const token = getCookie('token');
    const classes = useStyles(); //custom css
    const [formValues,setFormValues] = useState({status: "",fridgeStatus: ""});
    const [operationNumberValue, setOperationNumberValue] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [cabinetsList, setCabinetsList] = useState([]);
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
      console.log("props.dataToUpdate",props.selectedRows.data)
        setOperationNumberValue(props.dataToUpdate);
    },[])
    
    useEffect(()=>{
        const fetchData = async () => {
          await axios.all([
            axios.get(`${process.env.REACT_APP_BASE_URL}/cabinets`,{headers: {Authorization: `Bearer ${token}`}}),
            axios.get(`${process.env.REACT_APP_BASE_URL}/suppliers`,{headers: {Authorization: `Bearer ${token}`}})
          ])
          .then(response => {
            setCabinetsList(response[0].data.data)
            setSuppliersList(response[1].data)
          })
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
                let snValue = cabinetsList.filter((eSub) => eSub._id == e.sn)
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
                    "operation_type": e.operation_type,
                    "sn": e.sn,
                    "previous_status": e.status,
                    "new_status": formValues.status,
                    "response": response,
                    "reason": reason
                }
            }))
            setSaveClicked(2)
        }else{
          let idsToUpdate=reportArray.filter(e=>{
              return e.previous_status!="Completed" && e.previous_status!="Canceled"
          })
            idsToUpdate.forEach(async e=>{
              await axios({
                  method: "PUT",
                  url: `${process.env.REACT_APP_BASE_URL}/liveOperations/${e._id}`,
                  headers: {Authorization: `Bearer ${token}`},
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
                  method: "POST",
                  url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
                  headers: {Authorization: `Bearer ${token}`},
                  data: {
                    status: formValues.status,
                    fridge_status: formValues.fridgeStatus,
                    user: "User 1",
                    notes: "",
                    supplier_id: formValues.status==="Unassigned" ? "" : formValues.supplier_id,
                    operation_number: e.operation_number,
                  },
              })
              if(formValues.status==="Completed" || formValues.status==="Canceled"){
                let submitToCabinets=[]
                if(e.operation_type==="Preventive Maintenance"){
                  submitToCabinets=[{
                    status: formValues.fridgeStatus,
                    last_prev_date:new Date(),
                    booked:false
                  }]
                }else{
                  submitToCabinets=[{
                    status: formValues.fridgeStatus,
                    booked:false
                  }]
                }
                axios({
                  method: "PUT",
                  url: `${process.env.REACT_APP_BASE_URL}/cabinets/${e.sn}`,
                  headers: {Authorization: `Bearer ${token}`},
                  data: submitToCabinets
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
              <InputLabel id="statusLabel">Operation Status</InputLabel>
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
          {formValues.status==="Completed"?
          <Grid item xs={11}>
            <FormControl className={classes.formControl}>
              <InputLabel id="fridgeStatusLabel">Fridge Status</InputLabel>
              <Select
                labelId="fridgeStatusLabel"
                id="fridgeStatus"
                name="fridgeStatus"
                value={formValues.fridgeStatus || ""}
                onChange={handleChangeTextfield}
              >
                <MenuItem value="Damaged">Damaged</MenuItem>
                <MenuItem value="Operational">Operational</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          :null}

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
                    {(formValues.status==="Completed" || formValues.status==="Canceled")&&<th scope="col">Reason</th>}
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
                    {(formValues.status==="Completed" || formValues.status==="Canceled")&&<td>{e.reason}</td>}
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
              {saveClicked===1?"Validate":"Save"}
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
