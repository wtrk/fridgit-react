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
import { MuiThemeProvider } from "@material-ui/core/styles";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close, Save, Search, Check} from "@material-ui/icons";
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
  const [tiersList, setTiersList] = useState({});
  const [cityOut, setCityOut] = useState({});
  const [neighbourhoodOut, setNeighbourhoodOut] = useState({});
  const [country, setCountry] = useState({});
  const [tierOut, setTierOut] = useState({});
  const [storeValue, setStoreValue] = useState([]);
  const [storesList, setStoresList] = useState({});
  const [fridgeTypeValue, setFridgeTypeValue] = useState({});
  const [fridgeTypesList, setFridgeTypesList] = useState({});
  const [cabinetsList, setCabinetsList] = useState({});
  const [clientsList, setClientsList] = useState({});
  const [countriesList, setCountriesList] = useState({});
  const [serviceTypeValue, setServiceTypeValue] = useState({});
  const [serviceTypeList, setServiceTypeList] = useState({});
  const [prices, setPrices] = useState([]);
  const [allocationRulesList, setAllocationRulesList] = useState({});
  const [operationsList, setOperationsList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
  const [loadingResult, setLoadingResult] = useState(true);

  const [currentDate,setCurrentDate] = useState(new Date()); //table items
  const [operationType, setOperationType] = useState("");
  const [snFilled, setSnFilled] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  const [columnsForPrices, setColumnsForPrices] = useState(false);
  //After Save
  const [selectedSn, setSelectedSn] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState();
  const [saveClicked, setSaveClicked] = useState(1)

  const optionsForPrices = {
    filter:false,
    selectableRows: false,
    rowsPerPage: 100,
    customFooter: () => ""
  };
  const handleCloseOpenPrices = () => {
    setSaveClicked(1)
    setOpenPrices(false)
  }
    
  useEffect(()=>{
      const fetchData = async () => {
        await axios(
          `${process.env.REACT_APP_BASE_URL}/tiers`,
          {responseType: "json"}
        ).then((response) => {
          setTiersList(response.data)
        })
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
          `${process.env.REACT_APP_BASE_URL}/operations`,
          {responseType: "json"}
        ).then((response) => {
          setOperationsList(response.data)
        })
        await axios(
          `${process.env.REACT_APP_BASE_URL}/neighbourhoods`,
          {responseType: "json"}
        ).then((response) => {
          setNeighbourhoodsList(response.data)
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
const warehouseValueFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  if (warehouseValueFirstRun.current) {
    warehouseValueFirstRun.current = false;
  }else{
    let cityInId=warehouseValue.location.city_id
    let neighbourhoodInId=warehouseValue.location.neighbourhood_id
    if(formValues.operationType === "External Receipt" || formValues.operationType === "Retrieval"){
      const fetchData = async () => {
        let cityQuery = await axios(`${process.env.REACT_APP_BASE_URL}/cities/${cityInId}`, {
          responseType: "json",
        }).then((response) => {
          setCountry(countriesList.filter(e=>e._id===response.data.country)[0].name)
          setCityOut(response.data)
          return response.data
        })
        let neighbourhoodQuery = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${neighbourhoodInId}`, {
          responseType: "json",
        }).then((response) => {
          setNeighbourhoodOut(response.data)
          return response.data
        })

        // console.log("allocationRulesList",allocationRulesList)
        // setAllocationRulesList(allocationRulesList.filter(e=>{
        //   return e.cities.filter((c) => c.name === cityQuery.name).length || e.neighbourhoods.filter((c) => c.name === neighbourhoodQuery.name).length
        // }))
        //setSelectedSupplierId(allocationRulesFiltered ? allocationRulesFiltered[0].supplier_id:"")
      }
      fetchData();
    }
  }
},[warehouseValue])


const storeValueFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  if (storeValueFirstRun.current) {
    storeValueFirstRun.current = false;
  }else{
    let cityOutId=storeValue.location.city_id
    let neighbourhoodOutId=storeValue.location.neighbourhood_id
    const fetchData = async () => {
      let cityQuery = await axios(`${process.env.REACT_APP_BASE_URL}/cities/${cityOutId}`, {
        responseType: "json",
      }).then((response) => {
        setCountry(countriesList.filter(e=>e._id===response.data.country)[0].name)
        setCityOut(response.data)
        return response.data
      })
      let neighbourhoodQuery = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${neighbourhoodOutId}`, {
        responseType: "json",
      }).then((response) => {
        setNeighbourhoodOut(response.data)
        return response.data
      })

      // let allocationRulesFiltered=allocationRulesList.filter(e=>{
      //   return e.cities.filter((c) => c.name === cityQuery.name).length || e.neighbourhoods.filter((c) => c.name === neighbourhoodQuery.name).length
      // })
      // setSelectedSupplierId(allocationRulesFiltered ? allocationRulesFiltered[0].supplier_id:"")
    }
    fetchData();
  }
},[storeValue])

const cityValueFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  if (cityValueFirstRun.current) {
    cityValueFirstRun.current = false;
  }else{
    const tierObj=tiersList.filter(e=>{
      let returnBolean=false
      e.cities.forEach(e=>{
        if(e.name===cityOut.name) returnBolean=true
      })
      return returnBolean
    })
    setTierOut(tierObj.length?tierObj[0].name:"")
  }
},[cityOut])

const handleOpenSearch = () => {
  setOpenSearch(true)
  console.log("cabinetsList",cabinetsList)
  setCabinetsList(
    cabinetsList.filter((e) => {
      let showRow = true;
      if(e.booked) return false
      snFilled.forEach((sn) => {
        if (sn == e.sn) showRow = false;
      });
      return showRow;
    })
  );
}
const optionsForSn = {
  filter:false,
  customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
    return <IconButton
        onClick={() => {
          const selectedRowsTotal=selectedRows.data.map(e=>e.index)
          selectedRowsTotal.forEach(e=>{
            setSnFilled(prevSN =>[...prevSN,cabinetsList[e].sn])
            setSelectedSn(prevSelectedSn =>[...prevSelectedSn,...cabinetsList.filter((eSub) => cabinetsList[e].sn.includes(eSub.sn))]);
          })
          setOpenSearch(false)
        }}
        style={{marginRight: "24px",height: "48px",display: "block",}}
      >
        <Save />
      </IconButton>
  },
  textLabels: {
      body: {
          noMatch: 'Sorry, there is either no matching fridges to display or the items may already be booked.'
      },
  }
};
const handleChangeSn = (event, newValue) => {
  setSnFilled(newValue);
  setSelectedSn(cabinetsList.filter((e) => newValue.includes(e.sn)));
}

useEffect(()=>{
  setSaveClicked(1)
  const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets`, {responseType: "json"})
      .then((response) => {
        if(formValues.operationType === "Retrieval"){
          return response.data.filter(e=>e.location==="store")
        }
        if(formValues.operationType === "External Receipt"){
          return response.data.filter(e=>e.location==="NA")
        }
        if(formValues.operationType === "Deployment"){
          return response.data.filter(e=>e.location==="warehouse")
        }
      })
      .then((response)=>{
        setCabinetsList(response);
      });
    }
  fetchData();
},[formValues.operationType])


const cabinetsFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  const fetchData = async () => {
    if (cabinetsFirstRun.current) {
      cabinetsFirstRun.current = false;
    }else{
      if(formValues.operationType === "Deployment"){
        setCabinetsList(cabinetsList
          .filter((e) => e.type === fridgeTypeValue._id)
          .map((e) => {
            return { ...e, type: fridgeTypeValue.refrigerant_type };
          }));
    }
    }
  };
  fetchData();
},[fridgeTypeValue])



useEffect(()=>{
  setSaveClicked(1)
  const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/priceRules`, {
        responseType: "json",
      }).then((response) => {
        let priceFromOperation=response.data.filter(e=>e.operations.length ? e.operations.map(eSub=>eSub.name).includes(formValues.operationType):true)
        let priceFromCountry=priceFromOperation.filter(e=>e.countries.length ? e.countries.map(eSub=>eSub.name).includes(country):true)
        let priceFromTierOut=priceFromCountry.filter(e=>e.tiersOut.length ? e.tiersOut.map(eSub=>eSub.name).includes(tierOut):true)
        let priceFromCityOut=priceFromTierOut.filter(e=>e.citiesOut.length ? e.citiesOut.map(eSub=>eSub.name).includes(cityOut.name):true)
        let priceFromNeighbourhoodsOut=priceFromCityOut.filter(e=>e.neighbourhoodsOut.length ? e.neighbourhoodsOut.map(eSub=>eSub.name).includes(neighbourhoodOut.name):true)

        return priceFromNeighbourhoodsOut.filter(e => e.service===serviceTypeValue._id)
      }).then((response) => {
        setPrices(response)
        setLoadingResult(false)
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/allocationRules`,
        {responseType: "json"
      }).then((response) => {
        let allocationFromOperation=response.data.filter(e=>e.operations.length ? e.operations.map(eSub=>eSub.name).includes(formValues.operationType):true)
        let allocationFromTier=allocationFromOperation.filter(e=>e.tiers.length ? e.tiers.map(eSub=>eSub.name).includes(tierOut):true)
        let allocationFromCity=allocationFromTier.filter(e=>e.cities.length ? e.cities.map(eSub=>eSub.name).includes(cityOut.name):true)
        let allocationFromNeighbourhoods=allocationFromCity.filter(e=>e.neighbourhoods.length ? e.neighbourhoods.map(eSub=>eSub.name).includes(neighbourhoodOut.name):true)
        setAllocationRulesList(allocationFromNeighbourhoods)
      })


    }
  fetchData();
},[serviceTypeValue])



const pricesFirstRun = useRef(true);
useEffect(()=>{
  if (pricesFirstRun.current) {
    pricesFirstRun.current = false;
  }else{
      setColumnsForPrices([
        {
          name: "validPrice",
          label: "Valid Price Rule",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if(tableMeta.rowData[15]==="Total"){
                return ""
              }
              return value != 0 ? (
                <Check className="text-success" />
              ) : (
                <Close className="text-danger" />
              );
            },
          },
        },
        { name: "sn" },
        { name: "client_name", label: "Client Name" },
        { name: "handling_in", label: "Handling In" },
        { name: "storage", label: "Storage" },
        {
          name: "in_house_preventive_maintenance",
          label: "Inhouse Preventive Maintena",
        },
        {
          name: "corrective_service_in_house",
          label: "Corrective Service Inhouse",
        },
        { name: "cabinet_testing_fees", label: "Cabinet Testing Fees" },
        { name: "branding_fees", label: "Branding Fees" },
        { name: "drop", label: "drop" },
        { name: "transp_cbm", label: "Transp Cbm" },
        { name: "transp_for_1_unit", label: "Transp For 1 Unit" },
        { name: "min_charge", label: "Min Charge" },
        { name: "preventive_maintenance", label: "Preventive Maintenance" },
        {
          name: "exchange_corrective_reaction",
          label: "Exchange Corrective Reaction",
        },
        { name: "corrective_reaction", label: "Corrective Reaction",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            if(value==="Total") return <strong>Total</strong>
            return value
          },
        },
      },
        {
          name: "total",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if(tableMeta.rowData[15]==="Total"){
                let allNumbers = tableMeta.tableData.map(e=>e[16]).filter(e => typeof e === "number")
                console.log("allNumbers",allNumbers)
                let sumOfAll = allNumbers.length ? allNumbers.reduce((a,b)=>a+b):0;
                return sumOfAll
              }
              return value
            },
          },
        },
      ]);
    setOpenPrices(true)
  }
},[prices])

const handleSaveForm = async () => {
  //let priceFromNeighbourhoodsOut=prices.filter(e=>e.clients.length ? e.clients.map(eSub=>eSub.name).includes(neighbourhoodOut):true)
  let addresses={}
  if(formValues.operationType != "External Receipt" && formValues.operationType != "Retrieval"){
    addresses={initiation_address: {
      city_id: warehouseValue.location.city_id,
      neighbourhood_id: warehouseValue.location.neighbourhood_id,
      shop_name: warehouseValue.name,
      mobile: warehouseValue.location.mobile,
    },
    execution_address: {
      city_id: storeValue.location.city_id,
      neighbourhood_id: storeValue.location.neighbourhood_id,
      shop_name: storeValue.name,
      mobile: storeValue.location.mobile,
    }}
  }else{
    addresses={execution_address: {
      city_id: warehouseValue.location.city_id,
      neighbourhood_id: warehouseValue.location.neighbourhood_id,
      shop_name: warehouseValue.name,
      mobile: warehouseValue.location.mobile,
    }}
  }
  let formValuesToSave = selectedSn.map((e) => {
    const clientName=clientsList.filter((eSub) => eSub._id == e.client )?clientsList.filter((eSub) => eSub._id == e.client )[0].name:null
    const allocationRulesFromClients=allocationRulesList.filter(e=>e.clients.length ? e.clients.map(eSub=>eSub.name).includes(clientName):true);
    return {
    job_number: props.jobNumber,
    operation_number: "ON" + Math.floor(Math.random() * 100000000) + 1,
    operation_type: formValues.operationType,
    sn: e.sn,
    brand: e.brand,
    client_id: e.client,
    client_name: clientName,
    ...addresses,
    supplier_id: allocationRulesFromClients[0] ? allocationRulesFromClients[0].supplier_id : "",
    status: allocationRulesFromClients[0] ? "Assigned" : "Unassigned",
    last_status_user: "-",
    last_status_update: currentDate,
  }
});
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
  console.log("formValuesToSave",statusHistory)

  if(saveClicked===1){
  

    let finalPrices=selectedSn.map((e) => {
      const clientName=clientsList.filter((eSub) => eSub._id == e.client )?clientsList.filter((eSub) => eSub._id == e.client )[0].name:null
      const pricesFromClients=prices.filter(e=>e.clients.length ? e.clients.map(eSub=>eSub.name).includes(clientName):true);

      const sumOfValues = Object.values(pricesFromClients[0])
        .filter((e, i) => i > 3 && typeof e === "number")
        .reduce((a, b) => a + b, 0);
      return {
        validPrice: pricesFromClients.length,
        sn: e.sn,
        client_id: e.client,
        client_name: clientName,
        ...pricesFromClients[0],
        total:sumOfValues
      }
    })
    // console.log("finalPrices","finalPrices",finalPrices)
    finalPrices.push({corrective_reaction:"Total"})
    console.log("finalPrices",finalPrices)
    setPrices(finalPrices)
    setSaveClicked(2)
  }else{
    
    const fetchData = async () => {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/liveOperations`,
        data: formValuesToSave,
      })
      .then(function (response) {
        props.setItemsUpdated(formValuesToSave);
        props.setOpenDialog(false);
        handleCloseOpenPrices()
      })
      .catch((error) => {
        console.log(error);
      });
      


      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
        data: statusHistory,
      })
      
    selectedSn.forEach((e) => {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/cabinets/${e._id}`,
        data: [{
          location: formValues.operationType=="Deployment" ? "store" : "warehouse",
          location_id: formValues.operationType=="Deployment" ? storeValue._id : warehouseValue._id,
          booked:true
        }]
      })
    })
  
   }
    fetchData();
  }
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
          <div><strong>Date: </strong> <Moment format="DD MMM YYYY - HH:mm">{currentDate}</Moment></div>
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
              {operationsList.map(e=>
              <MenuItem value={e.name} key={e._id}>{e.name}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {formValues.operationType &&
        formValues.operationType != "External" &&
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

        {formValues.warehouse && formValues.operationType != "External Receipt" && formValues.operationType != "Retrieval" ||
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

        {formValues.store && formValues.operationType != "External Receipt" && formValues.operationType != "Retrieval" ? (
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
        {formValues.fridgeType ||
        formValues.warehouse && formValues.operationType === "External Receipt" ||
        formValues.warehouse && formValues.operationType === "Retrieval" ? (
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
        {formValues.fridgeType ||
        formValues.warehouse && formValues.operationType === "External Receipt" ||
        formValues.warehouse && formValues.operationType === "Retrieval" ? (
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
        {/*saveClicked===2*/}

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
              Submit
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
              {
                name: "_id",
                options: {
                  display: false,
                }
              },
              { name: "sn" },
              { name: "sn2" },
              { name: "type",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    let typeValue = "-"
                    if(fridgeTypesList.filter(e=> e._id===value)[0]){
                      typeValue = fridgeTypesList.filter((e) => e._id == value )[0].refrigerant_type;
                    }
                    return typeValue;
                  },
                },
              },
              { name: "client",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => 
                    clientsList.filter(e=> e._id===value)[0] ? clientsList.filter((e) => e._id == value )[0].name : "-"
                }
              },
              { name: "prev_status" },
              { name: "finance" },
              {
                name: "location"
              },
              {
                name: "location_id",
                label: "location",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    let cityValue = "-"
                    let neighbourhoodValue = "-"
                    let mobileValue = "-"
                    if(tableMeta.rowData[8]==="store"){
                      if(storesList.filter(e=> e._id==value)[0]){
                        let locationValue = storesList.filter(e=> e._id==value)[0].location;
                        if(citiesList.filter(e=> e._id==locationValue.city_id)[0]){
                          cityValue = citiesList.filter(e=> e._id==locationValue.city_id)[0].name;
                        }
                        if(neighbourhoodsList.filter(e=> e._id==locationValue.neighbourhood_id)[0]){
                          neighbourhoodValue = neighbourhoodsList.filter(e=> e._id==locationValue.neighbourhood_id)[0].name;
                        }
                        mobileValue=locationValue.mobile
                      }
                    }else if(tableMeta.rowData[8]==="warehouse"){
                      if(warehousesList.filter(e=> e._id==value)[0]){
                        let locationValue = warehousesList.filter(e=> e._id==value)[0].location;
                        if(citiesList.filter(e=> e._id==locationValue.city_id)[0]){
                          cityValue = citiesList.filter(e=> e._id==locationValue.city_id)[0].name;
                        }
                        if(neighbourhoodsList.filter(e=> e._id==locationValue.neighbourhood_id)[0]){
                          neighbourhoodValue = neighbourhoodsList.filter(e=> e._id==locationValue.neighbourhood_id)[0].name;
                        }
                        mobileValue=locationValue.mobile
                      }
                    }
                    return <div style={{ width: 200 }}>
                      <strong>City</strong>: {cityValue}
                      <br />
                      <strong>Neighbourhood</strong>: {neighbourhoodValue}
                      <br />
                      <strong>Mobile</strong>: {mobileValue}
                      <br />
                    </div>
                  }
                }
              },
            ]}
            options={optionsForSn}
          />
        </Dialog>
        {saveClicked===2?
        <Dialog
          maxWidth={"xl"}
          fullWidth
          open={openPrices}
          onClose={handleCloseOpenPrices}
        >
        <MuiThemeProvider theme={pricesDataTableTheme}>
          <MUIDataTable
          className="pricesDataTable"
            title="Prices"
            data={prices}
            columns={columnsForPrices}
            options={optionsForPrices}
          />
          </MuiThemeProvider>
          <div className="clientTables mx-5 my-3">
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
              onClick={handleCloseOpenPrices}
              startIcon={<Close />}
            >
              Close
            </Button>
          </div>
        </Dialog>
        :null}
      </div>
    </Fragment>
  );
}

export default AddOperationForm;