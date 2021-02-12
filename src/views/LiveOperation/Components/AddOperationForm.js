import React, { useState, Fragment,useEffect } from "react";
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
  TextField,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close, Save,Search} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

import "react-dropzone-uploader/dist/styles.css";
import "../LiveOperation.css";
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

const AddOperationForm = (props) => {
  const classes = useStyles(); //custom css
  const [formValues, setFormValues] = useState({
    operationType: "",
    warehouse: "",
    store: "",
    fridgeType:"",
    serviceType:""
  });
  const [warehouseValue, setWarehouseValue] = useState({});
  const [warehousesList, setWarehousesList] = useState({});
  const [storeValue, setStoreValue] = useState({});
  const [storesList, setStoresList] = useState({});
  const [fridgeTypeValue, setFridgeTypeValue] = useState({});
  const [fridgeTypesList, setFridgeTypesList] = useState({});
  const [cabinetsList, setCabinetsList] = useState({});
  const [serviceTypeValue, setServiceTypeValue] = useState({});
  const [serviceTypeList, setServiceTypeList] = useState({});
  const [prices, setPrices] = useState({});
  const [loadingResult, setLoadingResult] = useState(true);

  const [currentDate,setCurrentDate] = useState(new Date()); //table items
  const [operationType, setOperationType] = useState("");
  const [initiationAddress,setInitiationAddress] = useState("");
  const [executionAddress,setExecutionAddress] = useState("");
  const [fridgeType,setFridgeType] = useState("");
  const [serviceType,setServiceType] = useState("");
  const [sn, setSn] = useState("");
  const [snFilled, setSnFilled] = useState([]);
  const [openSearch, setOpenSearch] = useState("");
  const [columns,setColumns]=useState([]);
  const optionsOfSnTable = {
    filter:false,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      return <IconButton
          onClick={() => {
            const selectedRowsTotal=selectedRows.data.map(e=>e.index)
            selectedRowsTotal.forEach(e=>{
              setSnFilled(prevSN =>[...prevSN,cabinetsList[e].sn])
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
  // const handleChangeOperation = (e) =>  {
  //   setOperationType(e.target.value)
  //   if(e.target.value === "Deployment" ||  e.target.value === "Exchange"){
  //     setInput1("Warehouse")
  //     setInput2("Store")
  //     setInitiationAddress("")
  //     setExecutionAddress("")
  //     setFridgeType("")
  //     setSnFilled([])
  //   }
  // }
    const handleOpenSearch = () => {
      setOpenSearch(true)
      setCabinetsList(
        cabinetsList.filter((e) => {
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

    
  useEffect(()=>{
    const fetchData = async () => {
      await axios(
        `${process.env.REACT_APP_BASE_URL}/warehouses`,
        {responseType: "json"}
      ).then((response) => {
        setWarehousesList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/stores`,
        {responseType: "json"}
      ).then((response) => {
        setStoresList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/fridgesTypes`,
        {responseType: "json"}
      ).then((response) => {
        setFridgeTypesList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/cabinets`,
        {responseType: "json"}
      ).then((response) => {
        setCabinetsList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/serviceTypes`,
        {responseType: "json"}
      ).then((response) => {
        setServiceTypeList(response.data)
      })
    };
    fetchData();
},[])

const handleChangeTextfield = (e,n) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};

const handleChangeAutoComplete = (e, newValue,name) =>{
  switch (name) {
    case "warehouse": setWarehouseValue(newValue);break;
    case "store": setStoreValue(newValue);break;
    case "fridgeType": setFridgeTypeValue(newValue);break;
    case "serviceType": setServiceTypeValue(newValue);break;
  }
  if(newValue) setFormValues({ ...formValues, [name]: newValue._id });
}
useEffect(()=>{
  const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/priceRules`, {
        responseType: "json",
      }).then((response) => {
        setPrices(response.data.filter(e => e.service===serviceTypeValue._id)[0])
      }).then((response) => {
        setLoadingResult(false)
      });
    }
  fetchData();
},[serviceTypeValue])

const handleSaveForm = () => {
  let selectedSn= cabinetsList.filter((e) => {
    let showRow = false;
    snFilled.forEach((sn) => {
      if (sn == e.sn) {
        showRow = true;
      }
    });
    return showRow;
  })
  let selectedWarehouse= warehousesList.filter(e=> e._id===formValues.warehouse)[0]
  let selectedStore= storesList.filter(e=> e._id===formValues.store)[0]
props.setFormValuesToSave(
  selectedSn.map(e=>{
    return {
      job_number: Math.floor(Math.random() * 100000000) + 1,
      operation_number: Math.floor(Math.random() * 100000) + 1,
      operation_type: formValues.operationType,
      sn:e.sn,
      brand: "",
      client_id: e.client,
      client_name: "User 1",
      initiation_address: {...e.location, shop_name:selectedWarehouse.name},
      execution_address: {
        city_id: selectedStore.location.city_id,
        area: selectedStore.location.area,
        shop_name: selectedStore.name,
        mobile: selectedStore.location.mobile
      },
      status:"Unassigned"
    }
  })
)
  props.setOpenDialog(false)
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
          <div><strong>Date: </strong> <Moment format="DD/MM/YYYY">{currentDate}</Moment></div>
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
          <FormControl className={classes.formControl} fullwidth>
            <InputLabel id="initiationAddressLabel">Operation Type</InputLabel>
            <Select
              labelId="initiationAddressLabel"
              id="initiationAddressInput"
              name="operationType"
              value={formValues.operationType || ""}
              onChange={handleChangeTextfield}
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
        </Grid>

        {formValues.operationType &&
        formValues.operationType != "Corrective" &&
        formValues.operationType != "Preventive" ? (
          <Grid item xs={12} sm={7}>
            <Autocomplete
              id="WarehouseInput"
              options={warehousesList || {}}
              value={warehouseValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length !== 0 ? option.name : "";
              }}
              fullWidth
              onChange={(e, newValue) =>
                handleChangeAutoComplete(e, newValue, "warehouse")
              }
              renderInput={(params) => (
                <TextField {...params} label="Warehouse" />
              )}
            />
          </Grid>
        ) : null}

        {formValues.warehouse ||
        formValues.operationType === "Corrective" ||
        formValues.operationType === "Preventive" ? (
          <Grid item xs={12} sm={7}>
            <Autocomplete
              id="storeInput"
              options={storesList || {}}
              value={storeValue || {}}
              getOptionLabel={(option) => {
                return Object.keys(option).length !== 0 ? option.name : "";
              }}
              fullWidth
              onChange={(e, newValue) =>
                handleChangeAutoComplete(e, newValue, "store")
              }
              renderInput={(params) => (
                <TextField {...params} label="Execution Store" />
              )}
            />
          </Grid>
        ) : null}

        {formValues.store ? (
          <Grid item xs={12} sm={7}>
            <Autocomplete
              id="fridgeTypeInput"
              options={fridgeTypesList || {}}
              value={fridgeTypeValue || {}}
              getOptionLabel={(option) =>
                Object.keys(option).length !== 0 ? option.name : ""
              }
              fullWidth
              onChange={(e, newValue) =>
                handleChangeAutoComplete(e, newValue, "fridgeType")
              }
              renderInput={(params) => (
                <TextField {...params} label="Fridge Type" />
              )}
            />
          </Grid>
        ) : null}
        {formValues.fridgeType ? (
          <Grid item xs={12} sm={7} container>
            <Fragment>
              <Grid item xs={10}>
                <Autocomplete
                  multiple
                  fullWidth
                  freeSolo
                  id="snSelect"
                  value={snFilled}
                  options={[]}
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setSnFilled([...newValue]);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Add Sn"
                      label="Serial number"
                    />
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
                ></Button>
              </Grid>
            </Fragment>
          </Grid>
        ) : null}
        {/* operationType: "",
          warehouse: "",
          store: "",
          formValues.fridgeType:"" */}

        {/* <Grid item xs={12} sm={7}>
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
        </Grid> */}

        {/* {operationType &&
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
        ) : null} */}

        {/* {initiationAddress ||
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
        ) : null} */}

        {/* {executionAddress ? (
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
        ) : null} */}

        {formValues.fridgeType ? (
          <Grid item xs={12} sm={7}>
            <Autocomplete
              id="serviceTypeInput"
              options={serviceTypeList || {}}
              value={serviceTypeValue || {}}
              getOptionLabel={(option) =>
                Object.keys(option).length !== 0 ? option.name : ""
              }
              fullWidth
              onChange={(e, newValue) =>
                handleChangeAutoComplete(e, newValue, "serviceType")
              }
              renderInput={(params) => (
                <TextField {...params} label="Service Type" />
              )}
            />
          </Grid>
        ) : null}

        {/* 
        {formValues.fridgeType ? (
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
        ) : null} */}
        {prices ? (
          <Grid item xs={12} sm={7} container spacing={3}>
            {!loadingResult ? (
              <>
                <Grid item xs={10} className="BillContainer">
                  <strong>Handler:</strong>
                </Grid>
                <Grid item xs={2} className="BillContainer">{prices.handling_in*snFilled.length || ""}$</Grid> {/* multiply by the sn numbers */}

                <Grid item xs={10} className="BillContainer">
                  <strong>Drop:</strong>
                </Grid>
                <Grid item xs={2} className="BillContainer">{prices.drop*snFilled.length || ""}$</Grid>

                <Grid item xs={10} className="BillContainer">
                  <strong>Transportation:</strong>
                </Grid>
                <Grid item xs={2} className="BillContainer">{prices.transp_cbm*snFilled.length || ""}$</Grid>
                {operationType === "Corrective" ? (
                  <>
                  <Grid item xs={10} className="BillContainer">
                    <strong>Corrective:</strong>
                  </Grid>
                <Grid item xs={2} className="BillContainer">{prices.corrective_service_in_house*snFilled.length || ""}$</Grid>
                  </>
                ) : null}
                {operationType === "Preventive" ? (
                  <>
                  <Grid item xs={10} className="BillContainer">
                    <strong>Preventive:</strong>
                  </Grid>
                  <Grid item xs={2} className="BillContainer">{prices.preventive_maintenance*snFilled.length || ""}$</Grid>
                  </>
                ) : null}
                <Grid item xs={10} className="BillContainer" style={{ backgroundColor: "#aaa" }}>
                  <strong>Total:</strong>
                </Grid>
                <Grid item xs={2} className="BillContainer" style={{ backgroundColor: "#aaa" }}>
                  <strong>
                    {prices.handling_in*snFilled.length + prices.drop*snFilled.length+prices.transp_cbm*snFilled.length}
                    $</strong>
                </Grid>
              </>
            ) : (
              <CircularProgress size={30} className="m-auto" />
            )}
          </Grid>
        ) : null}

        {formValues.serviceType ? (
          <Grid item xs={12} sm={7} className="clientTables">
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
              onClick={() => props.setOpenDialog(false)}
              startIcon={<Close />}
            >
              Close
            </Button>
          </Grid>
        ) : null}
      </Grid>

      <div>
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth={true}
          open={openSearch}
          onClose={() => setOpenSearch(false)}
          cabinetsList={cabinetsList}
        >
          <MUIDataTable
            title="Operation"
            data={cabinetsList}
            columns={[
              { name: "sn" },
              { name: "type" },
              { name: "client" },
              { name: "prev_status" },
              { name: "finance" },
              { name: "In Store" },
            ]}
            options={optionsOfSnTable}
          />
        </Dialog>
      </div>
    </Fragment>
  );
}

export default AddOperationForm;