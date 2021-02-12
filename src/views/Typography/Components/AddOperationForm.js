import React, { useState, Fragment } from "react";
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
  Grid,
  Dialog,
  TextField,Chip,IconButton 
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close, Save,Search} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

import "react-dropzone-uploader/dist/styles.css";
import "../LiveOperation.css";
import { ContentSave } from "material-ui/svg-icons";

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

const AddOperationForm = (props) => {
  const classes = useStyles(); //custom css
  const [currentDate,setCurrentDate] = useState(new Date()); //table items
  const [operationType, setOperationType] = useState("");
  const [initiationAddress,setInitiationAddress] = useState("");
  const [executionAddress,setExecutionAddress] = useState("");
  const [fridgeType,setFridgeType] = useState("");
  const [serviceType,setServiceType] = useState("");
  const [sn, setSn] = useState("");
  const [snFilled, setSnFilled] = useState([]);
  const [openSearch, setOpenSearch] = useState("");
  const [columns,setColumns]=useState([{ 
    sn: "1833344222",
    type: "EPTA 48wwIS",
    manufacture: "Walls",
    client: "TT345678",
    prev_status: "Due",
    finance: "1000",
    status: "In Store"
  }, { 
    sn: "18G5555222",
    type: "EPTA 482L EIS",
    manufacture: "Walls",
    client: "TT323478",
    prev_status: "Due",
    finance: "1000",
    status: "In Store"
  }]);
  const optionsOfSnTable = {
    filter:false,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      return <IconButton
          onClick={() => {
            const selectedRowsTotal=selectedRows.data.map(e=>e.index)
            selectedRowsTotal.forEach(e=>{
              setSnFilled(prevSN =>[...prevSN,columns[e].sn])
            })
            setOpenSearch(false)
          }}
          style={{
            marginRight: "24px",
            height: "48px",
            display: "block",
          }}
        >
          <Save />
        </IconButton>
    },
    
  };
  const [input1, setInput1] = useState("Store");
  const [input2, setInput2] = useState("Warehouse");
  const handleChangeOperation = (e) =>  {
    setOperationType(e.target.value)
    if(e.target.value === "Deployment" ||  e.target.value === "Exchange"){
      setInput1("Warehouse")
      setInput2("Store")
      setInitiationAddress("")
      setExecutionAddress("")
      setFridgeType("")
      setSnFilled([])
    }
  }
    const handleOpenSearch = () => {
      setOpenSearch(true)
      setColumns(
        columns.filter((e) => {
          let showRow = true;
          snFilled.forEach((sn) => {
            if (sn == e.sn) {
              showRow = false;
            }
          });
          return showRow;
        })
      );
    }
  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close
            onClick={() => props.setOpenDialog(false)}
            className="btnIcon"
          />
          <Typography variant="h6" className={classes.title}>
            Add
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={3}
        justify="center"
        alignContent="center"
        fullWidth
      >
        <Grid item xs={12} sm={7}>
          <strong>Date: </strong>
          <Moment format="DD/MM/YYYY">{currentDate}</Moment>
        </Grid>
        <Grid item xs={12} sm={7}>
          {operationType ? (
            <div onClick={() => setOperationType(false)}>
              <strong>Operation Type: </strong>
              {operationType}
            </div>
          ) : (
            <FormControl className={classes.formControl} fullwidth>
              <InputLabel id="initiationAddressLabel">
                Operation Type
              </InputLabel>
              <Select
                labelId="initiationAddressLabel"
                id="initiationAddressInput"
                value={operationType}
                onChange={handleChangeOperation}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Deployment">Deployment</MenuItem>
                <MenuItem value="Retrieval">Retrieval</MenuItem>
                <MenuItem value="Transfer">Transfer</MenuItem>
                <MenuItem value="Exchange">Exchange</MenuItem>
                <MenuItem value="Corrective">Corrective Maintenance</MenuItem>
                <MenuItem value="Preventive">Preventive Maintenance</MenuItem>
                <MenuItem value="Exchange">Exchange</MenuItem>
              </Select>
            </FormControl>
          )}
        </Grid>

        {operationType &&
        operationType != "Corrective" &&
        operationType != "Preventive" ? (
          <Grid item xs={12} sm={7}>
            {initiationAddress ? (
              <div onClick={() => setInitiationAddress(false)}>
                <strong>Initiation Address: </strong> {initiationAddress}/ City,
                Area / Contact Person Name / Contact Number / Lat,Long / Store
                Reference Number / Sales Channel Type
              </div>
            ) : (
              <FormControl className={classes.formControl} fullwidth>
                
                <InputLabel id="initiationAddressLabel">
                  Initiation Address {input1}
                </InputLabel>
                <Select
                  labelId="initiationAddressLabel"
                  id="initiationAddressInput"
                  value={initiationAddress}
                  onChange={(e) => setInitiationAddress(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={input1+"1"}>{input1} 1</MenuItem>
                  <MenuItem value={input1+"2"}>{input1} 2</MenuItem>
                  <MenuItem value={input1+"3"}>{input1} 3</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        ) : null}

        {initiationAddress ||
        operationType === "Corrective" ||
        operationType === "Preventive" ? (
          <Grid item xs={12} sm={7}>
            {executionAddress ? (
              <div onClick={() => setExecutionAddress(false)}>
                <strong>Execution Address: </strong> {executionAddress}/ City,
                Area / Contact Person Name / Contact Number / Lat,Long / Store
                Reference Number / Sales Channel Type
              </div>
            ) : (
              <FormControl className={classes.formControl} fullwidth>
                <InputLabel id="executionAddressLabel">
                  Execution Address {input2}
                </InputLabel>
                <Select
                  labelId="executionAddressLabel"
                  id="executionAddressInput"
                  value={executionAddress}
                  onChange={(e) => setExecutionAddress(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={input2+"1"}>{input2} 1</MenuItem>
                  <MenuItem value={input2+"2"}>{input2} 2</MenuItem>
                  <MenuItem value={input2+"3"}>{input2} 3</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        ) : null}

        {executionAddress ? (
          <Grid item xs={12} sm={7}>
            {fridgeType ? (
              <div onClick={() => setFridgeType(false)}>
                <strong>Fridge Type: </strong> {fridgeType}
              </div>
            ) : (
              <FormControl className={classes.formControl} fullwidth>
                <InputLabel id="fridgeTypeLabel">Fridge Type</InputLabel>
                <Select
                  labelId="fridgeTypeLabel"
                  id="fridgeTypeInput"
                  value={fridgeType}
                  onChange={(e) => setFridgeType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="FridgeType1">Fridge Type 1</MenuItem>
                  <MenuItem value="FridgeType2">Fridge Type 2</MenuItem>
                  <MenuItem value="FridgeType3">Fridge Type3</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        ) : null}

        {fridgeType ? (
          <Grid item xs={12} sm={7} container>
            <Fragment>
            <Grid item xs={10}>
                <Autocomplete
                  multiple
                  fullWidth
                  freeSolo
                  id="tags-standard"
                  value={snFilled}
                  onChange={(event, newValue) => {
                    setSnFilled([
                      ...newValue
                    ]);
                  }}
                  options={[]}
                  getOptionLabel={(option) => option}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Serial number" variant="standard" placeholder="Add Sn" />
                  )}
                />
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                className="btn btn--save"
                onClick={handleOpenSearch}
                startIcon={<Search />}
              >
              </Button>
            </Grid>
            </Fragment>
          </Grid>
        ) : null}

        {fridgeType ? (
          <Grid item xs={12} sm={7}>
            {serviceType ? (
              <div onClick={() => setServiceType(false)}>
                <strong>Service Type: </strong> {serviceType}
              </div>
            ) : (
              <FormControl className={classes.formControl} fullwidth>
                <InputLabel id="serviceTypeLabel">Service Type</InputLabel>
                <Select
                  labelId="serviceTypeLabel"
                  id="serviceTypeInput"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Express">Express</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        ) : null}
        {serviceType ? (
        <Grid item xs={12} sm={7} container spacing={3}>
          <Grid item xs={10} className="BillContainer"><strong>Handler:</strong></Grid>
          <Grid item xs={2} className="BillContainer">13,000$</Grid>
          <Grid item xs={10} className="BillContainer"><strong>Drop:</strong></Grid>
          <Grid item xs={2} className="BillContainer">13,000$</Grid>
          <Grid item xs={10} className="BillContainer"><strong>Transportation:</strong></Grid>
          <Grid item xs={2} className="BillContainer">13,000$</Grid>
          {(operationType === "Corrective") ? <Grid item xs={10} className="BillContainer"><strong>Corrective:</strong></Grid>:null}
          {(operationType === "Corrective") ? <Grid item xs={2} className="BillContainer">13,000$</Grid>:null}
          {(operationType === "Preventive") ? (<Grid item xs={10} className="BillContainer"><strong>Preventive:</strong></Grid>):null}
          {(operationType === "Preventive") ? (<Grid item xs={2} className="BillContainer">13,000$</Grid>):null}
          <Grid item xs={10} className="BillContainer" style={{backgroundColor:"#aaa"}}><strong>Total:</strong></Grid>
          <Grid item xs={2} className="BillContainer" style={{backgroundColor:"#aaa"}}><strong>65,000$</strong></Grid>
        </Grid>
        ):null}
        
        {serviceType ? (
        <Grid item xs={12} sm={7} className="clientTables">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="btn btn--save"
            onClick={() => props.setOpenDialog(false)}
            startIcon={<Save />}
          >
            Save
          </Button>
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
        </Grid>
        ):null}
      </Grid>
    
    
      <div>
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth={true}
          open={openSearch}
          onClose={() => setOpenSearch(false)}
        >
        <MUIDataTable
          title="Operation"
          data={columns}
          columns={[
            {name: "sn"},
            {name: "type"},
            {name: "manufacture"},
            {name: "client"},
            {name: "prev_status"},
            {name: "finance"},
            {name: "In Store"},
          ]}
          options={optionsOfSnTable}
        />
        </Dialog>
    </div>
    </Fragment>
  );
}

export default AddOperationForm;