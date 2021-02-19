import React, { useState, Fragment,useEffect,useRef } from "react";
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
  const [citiesList, setCitiesList] = useState({});
  const [warehouseValue, setWarehouseValue] = useState({});
  const [warehousesList, setWarehousesList] = useState({});
  const [cityOut, setCityOut] = useState({});
  const [neighbourhoodOut, setNeighbourhoodOut] = useState({});
  const [storeValue, setStoreValue] = useState({});
  const [storesList, setStoresList] = useState({});
  const [fridgeTypeValue, setFridgeTypeValue] = useState({});
  const [fridgeTypesList, setFridgeTypesList] = useState({});
  const [cabinetsList, setCabinetsList] = useState({});
  const [clientsList, setClientsList] = useState({});
  const [countriesList, setCountriesList] = useState({});
  const [serviceTypeValue, setServiceTypeValue] = useState({});
  const [serviceTypeList, setServiceTypeList] = useState({});
  const [prices, setPrices] = useState({});
  const [allocationRulesList, setAllocationRulesList] = useState({});
  const [loadingResult, setLoadingResult] = useState(true);

  const [currentDate,setCurrentDate] = useState(new Date()); //table items
  const [operationType, setOperationType] = useState("");
  const [snFilled, setSnFilled] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  //After Save
  const [selectedSn, setSelectedSn] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState([]);

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
          style={{marginRight: "24px",height: "48px",display: "block",}}
        >
          <Save />
        </IconButton>
    },
    
  };
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
        `${process.env.REACT_APP_BASE_URL}/cities`,
        {responseType: "json"}
      ).then((response) => {
        setCitiesList(response.data)
      })
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
        `${process.env.REACT_APP_BASE_URL}/serviceTypes`,
        {responseType: "json"}
      ).then((response) => {
        setServiceTypeList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/clients`,
        {responseType: "json"}
      ).then((response) => {
        setClientsList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/countries`,
        {responseType: "json"}
      ).then((response) => {
        setCountriesList(response.data)
      })
      await axios(
        `${process.env.REACT_APP_BASE_URL}/allocationRules`,
        {responseType: "json"}
      ).then((response) => {
        setAllocationRulesList(response.data)
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

const storeValueFirstRun = useRef(true);
useEffect(()=>{
  if (storeValueFirstRun.current) {
    storeValueFirstRun.current = false;
  }else{
    let cityOutId=storeValue.location.city_id
    let neighbourhoodOutId=storeValue.location.neighbourhood_id
    setFridgeTypeValue({})
    setServiceTypeValue({})
    const fetchData = async () => {

      let cityQuery = await axios(`${process.env.REACT_APP_BASE_URL}/cities/${cityOutId}`, {
        responseType: "json",
      }).then((response) => {
        setCityOut(response.data)
        return response.data
      })
      let neighbourhoodQuery = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${neighbourhoodOutId}`, {
        responseType: "json",
      }).then((response) => {
        setNeighbourhoodOut(response.data)
        return response.data
      })

      let allocationRulesFiltered=allocationRulesList.filter(e=>{
        return e.cities.filter((c) => c.name === cityQuery.name).length || e.neighbourhoods.filter((c) => c.name === neighbourhoodQuery.name).length
      })
      setSelectedSupplierId(allocationRulesFiltered ? allocationRulesFiltered[0].supplier_id:"")
    }
    fetchData();
  }
},[storeValue])

const handleChangeSn = (event, newValue) => {
  setSnFilled([...newValue]);
}
const snValueFirstRun = useRef(true);
useEffect(()=>{
  if (snValueFirstRun.current) {
    snValueFirstRun.current = false;
  }else{
    setSelectedSn(
      cabinetsList.filter((e) => {
        let showRow = false;
        snFilled.forEach((sn) => {
          showRow = sn == e.sn ? true : false;
        });
        return showRow;
      })
    );
  }
},[snFilled])


const cabinetsFirstRun = useRef(true);
useEffect(()=>{
  const fetchData = async () => {
    if (cabinetsFirstRun.current) {
      cabinetsFirstRun.current = false;
    }else{
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets`, {responseType: "json"}).then((response) => {
        setCabinetsList(
          response.data.filter((e) => e.type===fridgeTypeValue._id).map(e => {
            return {...e, type:fridgeTypeValue.refrigerant_type}
          })
        );
      });
    }
  };
  fetchData();
},[fridgeTypeValue])


useEffect(()=>{
  const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/priceRules/cityOut/${cityOut.name}`, {
        responseType: "json",
      }).then((response) => {
        setPrices(response.data.filter(e => e.service===serviceTypeValue._id)[0])
      }).then((response) => {
        setLoadingResult(false)
      });
    }
  fetchData();
},[serviceTypeValue])



const handleSaveForm = async () => {
  let formValuesToSave = selectedSn.map((e) => ({
    job_number: props.jobNumber,
    operation_number: "ON" + Math.floor(Math.random() * 100000000) + 1,
    operation_type: formValues.operationType,
    sn: e.sn,
    brand: e.brand,
    client_id: e.client,
    client_name: "User 1",
    initiation_address: {
      city_id: storeValue.location.city_id,
      neighbourhood_id: storeValue.location.neighbourhood_id,
      shop_name: storeValue.name,
      mobile: storeValue.location.mobile,
    },
    execution_address: {
      city_id: storeValue.location.city_id,
      neighbourhood_id: storeValue.location.neighbourhood_id,
      shop_name: storeValue.name,
      mobile: storeValue.location.mobile,
    },
    supplier_id: selectedSupplierId,
    status: selectedSupplierId ? "Assigned" : "Unassigned",
    last_status_user: "-",
    last_status_update: currentDate,
  }));
console.log("selectedSupplierId",selectedSupplierId)
  const statusHistoryUnassigned = formValuesToSave.map((e) => ({
    "status":"Unassigned",
    "user":"User 1",
    "notes":"",
    "operation_number":e.operation_number
  }));
  const statusHistoryAssigned = formValuesToSave.map((e) => {
    if(e.status==="Assigned"){
      return {
        status: "Assigned",
        user: "User 1",
        notes: "",
        operation_number: e.operation_number,
      };
    }
  });
  let statusHistory=[...statusHistoryUnassigned, ...statusHistoryAssigned]
  
  const fetchData = async () => {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/liveOperations`,
      data: formValuesToSave,
    })
    .then(function (response) {
      props.setItemsUpdated(formValuesToSave);
      props.setOpenDialog(false);
    })
    .catch((error) => {
      console.log(error);
    });
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
      data: statusHistory,
    })
    
  console.log("selectedSn",selectedSn)
  
  selectedSn.forEach((e) => {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL}/cabinets/${e._id}`,
      data: [{
        location: operationType==="deployment" ? "warehouse" : "store",
        location_id: storeValue._id
      }]
    })
  })

  }
fetchData();
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
      >
        <Grid item xs={12} sm={7}>
          <FormControl className={classes.formControl}>
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
                  onChange={handleChangeSn}
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
                >Search</Button>
              </Grid>
            </Fragment>
          </Grid>
        ) : null}
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
          fullWidth
          open={openSearch}
          onClose={() => setOpenSearch(false)}
        >
          <MUIDataTable
            title="Operation"
            data={cabinetsList}
            columns={[
              { name: "sn" },
              { name: "sn2" },
              { name: "type"},
              { name: "client",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => 
                    clientsList.filter(e=> e._id===value)[0] ? clientsList.filter((e) => e._id == value )[0].name : "-"
                }
              },
              { name: "prev_status" },
              { name: "finance" }
            ]}
            options={optionsOfSnTable}
          />
        </Dialog>
      </div>
    </Fragment>
  );
}

export default AddOperationForm;