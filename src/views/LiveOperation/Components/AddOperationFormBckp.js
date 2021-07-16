import React, { useState, Fragment,useEffect,useRef } from "react";
import Moment from "react-moment";
import CustomToolbar from "../../../CustomToolbar";
import FilterComponent from "./FilterCabinetComponent.js";
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
import { getCookie } from '../../../components/auth/Helpers';

import "react-dropzone-uploader/dist/styles.css";
import "../LiveOperation.css";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    appBar: {position: "relative",marginBottom:20},
    title: {marginLeft: theme.spacing(2),flex: 1,},
  formControl: {minWidth: "100%",}
}));

const AddOperationForm = (props) => {
  const token = getCookie('token');
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
  const [filterDialog,setFilterDialog] = useState(false)
  const [fridgesTypesList, setFridgesTypesList] = useState({});
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

  const [cabinetsPagingInfo, setCabinetsPagingInfo] = useState({page:0,limit:20,skip:0,count:0}); //Pagination Info
  const [currentDate,setCurrentDate] = useState(new Date()); //table items
  const [snFilled, setSnFilled] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  const [columnsForPrices, setColumnsForPrices] = useState(false);
  //After Save
  const [selectedSn, setSelectedSn] = useState([]);
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
   
  useEffect(() => {
    const fetchData = async () => {
      await axios.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/tiers`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/warehouses`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/stores`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/serviceTypes`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/countries`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/operations`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
      ]).then(response => {
        setTiersList(response[0].data)
        setCitiesList(response[1].data)
        setWarehousesList(response[2].data)
        setStoresList(response[3].data)
        setFridgesTypesList(response[4].data)
        setServiceTypeList(response[5].data.data)
        setClientsList(response[6].data)
        setCountriesList(response[7].data)
        setOperationsList(response[8].data)
        setNeighbourhoodsList(response[9].data)
      })
    };
    fetchData();
  }, []);


const handleChangeTextfield = (e,n) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};

const handleChangeAutoComplete = (e, newValue,name) =>{
  switch (name) {
    case "warehouse": setWarehouseValue(newValue);break;
    case "store": setStoreValue(newValue);break;
    //case "fridgeType": setFridgeTypeValue(newValue);break;
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
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          setCountry(countriesList.filter(e=>e._id===response.data.country)[0].name)
          setCityOut(response.data)
          return response.data
        })
        let neighbourhoodQuery = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${neighbourhoodInId}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          setNeighbourhoodOut(response.data)
          return response.data
        })
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
    const fetchData = async () => {
      let cityOutId=storeValue.location.city_id
      let neighbourhoodOutId=storeValue.location.neighbourhood_id
      let cityQuery = await axios(`${process.env.REACT_APP_BASE_URL}/cities/${cityOutId}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setCountry(countriesList.filter(e=>e._id===response.data.country)[0].name)
        setCityOut(response.data)
        return response.data
      })
      let neighbourhoodQuery = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${neighbourhoodOutId}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setNeighbourhoodOut(response.data)
        return response.data
      })
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
  setCabinetsList(
    cabinetsList.filter((e) => {
      let showRow = true;
      if(e.booked) return false
      snFilled.forEach((sn) => {
        //change Sn
        if (sn == e.sn) showRow = false;
      });
      return showRow;
    })
  );
}
const handleFilter = () => {
  setFilterDialog(true)
};
const optionsForSn = {
  filter:false,
  selectToolbarPlacement: "replace",
  customToolbar: () => {
    return (
      <CustomToolbar
        handleFilter={handleFilter}
      />
    );
  },
  customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
    return <IconButton
        onClick={() => {
          const selectedRowsTotal=selectedRows.data.map(e=>e.index)
          selectedRowsTotal.forEach(e=>{
            //change Sn
            setSnFilled(prevSN =>[...prevSN,cabinetsList[e].sn])
            setSelectedSn(prevSelectedSn =>[...prevSelectedSn,...cabinetsList.filter((eSub) => cabinetsList[e]._id.includes(eSub._id))]);
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
  },
  serverSide: true,
  count:cabinetsPagingInfo.count, // Use total number of items
  page: cabinetsPagingInfo.page,
  onTableChange: (action, tableState) => {
    if (action === "changePage") {
      setCabinetsPagingInfo({...cabinetsPagingInfo,page:tableState.page,skip:tableState.page*cabinetsPagingInfo.limit});
    }else if(action === "changeRowsPerPage"){
      setCabinetsPagingInfo({...cabinetsPagingInfo,limit:tableState.rowsPerPage});
    }
  }
};
const handleChangeSn = (event, newValue) => {
  //change Sn
  setSnFilled(newValue);
  setSelectedSn(cabinetsList.filter((e) => newValue.includes(e.id)));
}
const cabinetFilterFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  if (cabinetFilterFirstRun.current) {
    cabinetFilterFirstRun.current = false;
  }else{
  const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets?operationType=${formValues.operationType}`, {responseType: "json", headers: {Authorization: `Bearer ${token}`}})
      .then((response) => {
        console.log(formValues.operationType)
        console.log(response.data.data)
        setCabinetsList(response.data.data)
      })
    }
  fetchData();
  }
},[formValues.operationType])




const serviceTypeFirstRun = useRef(true);
useEffect(()=>{
  setSaveClicked(1)
  const fetchData = async () => {
    if (serviceTypeFirstRun.current) {
      serviceTypeFirstRun.current = false;
    }else{
      await axios(`${process.env.REACT_APP_BASE_URL}/priceRules`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        //console.log("response",response.data)
        let priceFromOperation=response.data.filter(e=>e.operations.length ? e.operations.map(eSub=>eSub.name).includes(formValues.operationType):true)
        //console.log("priceFromOperation",priceFromOperation)
        let priceFromCountry=priceFromOperation.filter(e=>e.countries.length ? e.countries.map(eSub=>eSub.name).includes(country):true)
        //console.log("priceFromCountry",priceFromCountry)
        let priceFromTierOut=priceFromCountry.filter(e=>e.tiersOut.length ? e.tiersOut.map(eSub=>eSub.name).includes(tierOut):true)
        //console.log("priceFromTierOut",priceFromTierOut)
        let priceFromCityOut=priceFromTierOut.filter(e=>e.citiesOut.length ? e.citiesOut.map(eSub=>eSub.name).includes(cityOut.name):true)
        //console.log("priceFromCityOut",priceFromCityOut)
        let priceFromNeighbourhoodsOut=priceFromCityOut.filter(e=>e.neighbourhoodsOut.length ? e.neighbourhoodsOut.map(eSub=>eSub.name).includes(neighbourhoodOut.name):true)
        
        //console.log("priceFromNeighbourhoodsOut",priceFromNeighbourhoodsOut)
        
        return priceFromNeighbourhoodsOut.filter(e => e.service===serviceTypeValue._id)
      }).then((response) => {
        //console.log("response",response)
        setPrices(response)
        setLoadingResult(false)
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/allocationRules`,
        {responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        let allocationFromOperation=response.data.filter(e=>e.operations.length ? e.operations.map(eSub=>eSub.name).includes(formValues.operationType):true)
        let allocationFromTier=allocationFromOperation.filter(e=>e.tiers.length ? e.tiers.map(eSub=>eSub.name).includes(tierOut):true)
        let allocationFromCity=allocationFromTier.filter(e=>e.cities.length ? e.cities.map(eSub=>eSub.name).includes(cityOut.name):true)
        let allocationFromNeighbourhoods=allocationFromCity.filter(e=>e.neighbourhoods.length ? e.neighbourhoods.map(eSub=>eSub.name).includes(neighbourhoodOut.name):true)
        setAllocationRulesList(allocationFromNeighbourhoods)
      })

    }
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
              if (tableMeta.rowData[13] === "Total") {
                return "";
              }
              return value != 0 ? (
                <Check className="text-success" />
              ) : (
                <Close className="text-danger" />
              );
            },
          },
        },
        {
          name: "sn",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if (value) {
                let snValue = cabinetsList.filter((e) => e._id == value);
                return snValue.length ? snValue[0].sn : "-"
              }
            },
          },
        },
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
        { name: "transportation_fees", label: "Transportation Fees" },
        { name: "preventive_maintenance", label: "Preventive Maintenance" },
        {
          name: "exchange_corrective_reaction",
          label: "Exchange Corrective Reaction",
        },
        {
          name: "corrective_reaction",
          label: "Corrective Reaction",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if (value === "Total") return <strong>Total</strong>;
              return value;
            },
          },
        },
        {
          name: "total",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if (tableMeta.rowData[13] === "Total") {
                let allNumbers = tableMeta.tableData
                  .map((e) => e[16])
                  .filter((e) => typeof e === "number");
                let sumOfAll = allNumbers.length
                  ? allNumbers.reduce((a, b) => a + b)
                  : 0;
                return sumOfAll;
              }
              return value;
            },
          },
        },
      ]);
    setOpenPrices(true)

    props.setPricesToUse(prices) 
  }
},[prices])

const handleSaveForm = async () => {
  //let priceFromNeighbourhoodsOut=prices.filter(e=>e.clients.length ? e.clients.map(eSub=>eSub.name).includes(neighbourhoodOut):true)
  let addresses={}
  if(formValues.operationType === "External Receipt" || formValues.operationType === "Retrieval"){
    addresses={execution_address: {
      city_id: warehouseValue.location.city_id,
      neighbourhood_id: warehouseValue.location.neighbourhood_id,
      shop_name: warehouseValue.name,
      mobile: warehouseValue.location.mobile,
    }}
  }else if(formValues.operationType === "Transfer" || formValues.operationType === "Deployment" || formValues.operationType === "Exchange"){
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
  }
  //check here
  let formValuesToSave = selectedSn.map((e) => {
    if(formValues.operationType === "Preventive Maintenance" || formValues.operationType === "Corrective Maintenance" || formValues.operationType === "Testing"){
      let getShop=(e.location==="warehouse")?warehousesList.filter(eSub=> eSub._id===e.location_id)[0]:storesList.filter(eSub=> eSub._id===e.location_id)[0]

        addresses = {
          initiation_address: {
            city_id: getShop.location.city_id,
            neighbourhood_id: getShop.location.neighbourhood_id,
            shop_name: getShop.name,
            mobile: getShop.location.mobile,
          },
        };
    }
    const clientName=clientsList.filter((eSub) => eSub._id == e.client )?clientsList.filter((eSub) => eSub._id == e.client )[0].name:null
    const allocationRulesFromClients=allocationRulesList.filter(e=>e.clients&&e.clients.length ? e.clients.map(eSub=>eSub.name).includes(clientName):true);
    const pricesFromClients=prices.filter(e=>e.clients&&e.clients.length ? e.clients.map(eSub=>eSub.name).includes(clientName):true);
    let price_rule = {}
    if(pricesFromClients.length){
      price_rule = {
        price_id:pricesFromClients[0]._id,
        name:pricesFromClients[0].name,
      }
    }
    return {
    job_number: props.jobNumber,
    operation_number: "ON" + Math.floor(Math.random() * 100000000) + 1,
    operation_type: formValues.operationType,
    sn: e._id,
    brand: e.brand,
    client_id: e.client,
    client_name: clientName,
    ...addresses,
    allocation_rule: {
      allocation_id:allocationRulesFromClients[0]._id,
      name:allocationRulesFromClients[0].name,
    },
    price_rule,
    supplier_id: allocationRulesFromClients[0] ? allocationRulesFromClients[0].supplier_id : "",
    status: allocationRulesFromClients[0] ? "Assigned" : "Unassigned",
    last_status_user: "-",
    last_status_update: currentDate,
  }
});


  if(saveClicked===1){
    
    let pricesForFinance=selectedSn.map((e) => {
      const clientName=clientsList.filter((eSub) => eSub._id == e.client )?clientsList.filter((eSub) => eSub._id == e.client )[0].name:null
      const pricesFromClients=prices.filter(e=>e.clients.length ? e.clients.map(eSub=>eSub.name).includes(clientName):true);
      const cbm=fridgesTypesList.filter(eSub=>eSub._id==e.type)[0].cbm
      let transportationFeez=0
      let pricesToSave={
        branding_fees: 0,
        cabinet_testing_fees: 0,
        corrective_reaction: 0,
        corrective_service_in_house: 0,
        drop: 0,
        exchange_corrective_reaction: 0,
        handling_in: 0,
        in_house_preventive_maintenance: 0,
        min_charge: 0,
        name: 0,
        preventive_maintenance: 0,
        priority: 0,
        storage: 0,
        transp_cbm: 0,
        transp_for_1_unit: 0}
      if(pricesFromClients.length){
        pricesToSave={
          branding_fees: pricesFromClients[0].branding_fees,
          cabinet_testing_fees: pricesFromClients[0].cabinet_testing_fees,
          corrective_reaction: pricesFromClients[0].corrective_reaction,
          corrective_service_in_house: pricesFromClients[0].corrective_service_in_house,
          drop: pricesFromClients[0].drop,
          exchange_corrective_reaction: pricesFromClients[0].exchange_corrective_reaction,
          handling_in: pricesFromClients[0].handling_in,
          in_house_preventive_maintenance: pricesFromClients[0].in_house_preventive_maintenance,
          min_charge: pricesFromClients[0].min_charge,
          name: pricesFromClients[0].name,
          preventive_maintenance: pricesFromClients[0].preventive_maintenance,
          priority: pricesFromClients[0].priority,
          storage: pricesFromClients[0].storage,
          transp_cbm: pricesFromClients[0].transp_cbm,
          transp_for_1_unit: pricesFromClients[0].transp_for_1_unit,

        }
        transportationFeez=(selectedSn.length===1)?pricesFromClients[0].transp_for_1_unit:cbm*pricesFromClients[0].transp_cbm
      }else{

      }
      return {
        validPrice: pricesFromClients.length,
        sn: e._id,
        client_id: e.client,
        client_name: clientName,
        ...pricesToSave,
        cbm:cbm,
        transportation_fees:transportationFeez,
        //total:sumOfValues
      }
    })


    if(pricesForFinance.length>1){
      let totalFeez=pricesForFinance.reduce((a,b)=> a.transportation_fees + b.transportation_fees)
      let totalCBM=pricesForFinance.reduce((a,b)=> a.cbm + b.cbm)
      let minCharge=pricesForFinance[0].min_charge
      if(totalFeez<minCharge){
        pricesForFinance=pricesForFinance.map(e=>{
          e.transportation_fees=e.cbm*minCharge/totalCBM
          return e
        })
      }
    }
    pricesForFinance=pricesForFinance.map(e=>{
      return {
        validPrice: e.validPrice,
        sn: e.sn,
        client_id: e.client_id,
        client_name: e.client_name,
        branding_fees: e.branding_fees,
        cabinet_testing_fees: e.cabinet_testing_fees,
        corrective_reaction: e.corrective_reaction,
        corrective_service_in_house: e.corrective_service_in_house,
        drop: e.drop,
        exchange_corrective_reaction: e.exchange_corrective_reaction,
        handling_in: e.handling_in,
        in_house_preventive_maintenance: e.in_house_preventive_maintenance,
        name: e.name,
        preventive_maintenance: e.preventive_maintenance,
        priority: e.priority,
        storage: e.storage,
        transportation_fees:e.transportation_fees,
        total: e.transportation_fees + e.branding_fees + e.cabinet_testing_fees + e.corrective_reaction + e.corrective_service_in_house + e.drop +e.exchange_corrective_reaction + e.handling_in + e.in_house_preventive_maintenance + e.preventive_maintenance + e.storage
      }
    })
    pricesForFinance.push({corrective_reaction:"Total"})
    setPrices(pricesForFinance)
    setSaveClicked(2)
  }else{
    const fetchData = async () => {
      console.log("formValuesToSave",formValuesToSave)
    //   await axios({
    //     method: "POST",
    //     url: `${process.env.REACT_APP_BASE_URL}/liveOperations`,
    //     data: formValuesToSave,
    //   })
    //   .then(function (response) {
    //     props.setItemsUpdated(formValuesToSave);
    //     props.setOpenDialog(false);
    //     handleCloseOpenPrices()
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    //   let locationToDb=""
    //   let locationIdToDb=""
    //   let locationForHistory=""
    //   if(formValues.operationType=="Deployment"){
    //     locationToDb="store"
    //     locationIdToDb=storeValue._id
    //     locationForHistory=storeValue.location
    //   }else if(formValues.operationType === "External Receipt" || formValues.operationType === "Retrieval"){
    //     locationToDb="warehouse"
    //     locationIdToDb=warehouseValue._id
    //     locationForHistory=warehouseValue.location
    //   }

    //   const statusHistoryUnassigned = formValuesToSave.map((e) => ({
    //     "status":"Unassigned",
    //     "user":"User 1",
    //     "notes":"",
    //     "operation_number":e.operation_number,
    //     "location":locationForHistory
    //   }));
    //   const statusHistoryAssigned = formValuesToSave.map((e) => {
    //     if(e.status==="Assigned"){
    //       return {
    //         status: "Assigned",
    //         user: "User 1",
    //         notes: "",
    //         operation_number: e.operation_number,
    //         location:locationForHistory
    //       };
    //     }
    //   });
    //   let statusHistory=[...statusHistoryUnassigned, ...statusHistoryAssigned]

    //   await axios({
    //     method: "POST",
    //     url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
    //     data: statusHistory,
    //   })
      
    // selectedSn.forEach((e) => {
    //   axios({
    //     method: "PUT",
    //     url: `${process.env.REACT_APP_BASE_URL}/cabinets/${e._id}`,
    //     data: [{
    //       location: locationToDb===""?e.location:locationToDb,
    //       location_id: locationIdToDb===""?e.location_id:locationIdToDb,
    //       booked:true
    //     }]
    //   })
    // })
  
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
        <Grid item xs={11}>
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
        formValues.operationType != "Preventive Maintenance" &&
        formValues.operationType != "Corrective Maintenance" &&
        formValues.operationType != "Testing" ? (
          <Grid item xs={11}>
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

        {formValues.warehouse && 
        formValues.operationType != "External Receipt" && formValues.operationType != "Retrieval" ? (
          <Grid item xs={11}>
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

        {/* {formValues.store ? (
          <Grid item xs={11}>
            <Autocomplete
              id="fridgeTypeInput"
              options={fridgesTypesList || {}}
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
        ) : null} */}
        {formValues.store ||
        formValues.warehouse && formValues.operationType === "External Receipt" ||
        formValues.warehouse && formValues.operationType === "Retrieval" ||
        formValues.operationType === "Preventive Maintenance" ||
        formValues.operationType === "Corrective Maintenance" ||
        formValues.operationType === "Testing" ? (
          <Grid item xs={11} container>
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
        {formValues.store ||
         selectedSn.length && formValues.operationType === "Preventive Maintenance" ||
         selectedSn.length && formValues.operationType === "Corrective Maintenance" ||
         selectedSn.length && formValues.operationType === "Testing" ||
        formValues.warehouse && formValues.operationType === "External Receipt" ||
        formValues.warehouse && formValues.operationType === "Retrieval" ? (
          <Grid item xs={11}>
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
          <Grid item xs={11} className="clientTables">
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
                    if(fridgesTypesList.filter(e=> e._id===value)[0]){
                      typeValue = fridgesTypesList.filter((e) => e._id == value )[0].refrigerant_type;
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
                label: "address",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    let cityValue = "-"
                    let neighbourhoodValue = "-"
                    let mobileValue = "-"
                    if(tableMeta.rowData[7]==="store"){
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
                    }else if(tableMeta.rowData[7]==="warehouse"){
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
        {/*********************** FILTER start ****************************/}
          <Dialog
            onClose={() => setFilterDialog(false)}
            maxWidth={"xl"}
            fullWidth
            aria-labelledby="customized-dialog-title"
            open={filterDialog}
          >
            <FilterComponent setOpenDialog={setFilterDialog} setItems={setCabinetsList} operationType={formValues.operationType} setPagingInfo={setCabinetsPagingInfo} pagingInfo={cabinetsPagingInfo} />
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