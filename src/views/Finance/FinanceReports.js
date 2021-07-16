import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Dialog,
  CircularProgress,
  Slide,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import axios from 'axios';

import Moment from "react-moment";
import OperationDialog from "./Components/OperationDialog.js";
import SnDialog from "./Components/SnDialog.js";

import CustomToolbar from "../../CustomToolbar";
import TabsOnTop from "./Components/TabsOnTop.js";
import FilterComponent from "./Components/FilterComponent.js";
import { getCookie } from '../../components/auth/Helpers';
import "./FinanceReports.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FinanceReport = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);  
  const [filteredDate,setFilteredDate] = useState({"fromDate":"","toDate":""})
  const [items, setItems] = useState([]); //table items
  const [columns, setColumns] = useState(); //for modal2
  const [itemsBackup, setItemsBackup] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
  const [cabinetsList, setCabinetsList] = useState([]);
  const [fridgesTypesList, setFridgesTypesList] = useState([]);
  const [itemsDaily, setItemsDaily] = useState([]);
  const [itemsDetails, setItemsDetails] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [filterDialog,setFilterDialog] = useState(false)
  const [pagingInfo, setPagingInfo] = useState({page:0,limit:20,skip:0,count:20}); //Pagination Info
  const [searchEntry, setSearchEntry] = useState([]); //searchEntry
  const [openOperationDialog,setOpenOperationDialog] = useState(false);
  const [operationNum,setOperationNum] = useState();
  const [supplierName,setSupplierName] = useState("");
  const [suppliersList,setSuppliersList] = useState("");
  const [openSnDialog,setOpenSnDialog] = useState(false);
  const [snId,setSnId] = useState();

  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/cabinets`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/financial/daily`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/suppliers`,{headers: {Authorization: `Bearer ${token}`}}),
        ])
        .then(response => {
          setCabinetsList(response[0].data.data)
          setClientsList(response[1].data)
          setCitiesList(response[2].data)
          setNeighbourhoodsList(response[3].data)
          setFridgesTypesList(response[4].data)
          setItemsDaily(response[5].data)
          setSuppliersList(response[6].data)
        })
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/financial?limit=${pagingInfo.limit}&skip=${pagingInfo.skip}&searchEntry=${searchEntry}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`}
      }).then((response) => {
        setPagingInfo({...pagingInfo,count:response.data.count});
        setItemsDetails(response.data.data)
        console.log("sssssssssssssssssssssssssssssssssssssssssssss",response.data.data)
        return setIsLoading(false)
      })
      .catch((error) => {
        console.log("error",error);
      });
    };
    fetchData();
  }, [pagingInfo.page,pagingInfo.limit,searchEntry]);



  useEffect(()=>{
    const fetchData = async () => {
    if(tabIndex===1){
        
      setColumns([
        {
          name: "_id",
          options: {
            display: false,
          },
        },
        {
          name: "createdAt",
          label: "Day",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if(value==="Total") return value
              else return <Moment format="DD MMM YYYY">{value}</Moment>
            }
          },
        },
        { label: "Handling IN / OUT", name: "handling_in" },
        { label: "Storage", name: "storage" },
        { label: "In House Preventive", name: "in_house_preventive_maintenance" },
        { label: "In House Corrective", name: "corrective_service_in_house" },
        { label: "Testing", name: "cabinet_testing_fees" },
        { label: "Branding", name: "branding_fees" },
        { label: "Drop", name: "drop" },
        { label: "Transportation", name: "transportation_fees" },
        { label: "Preventive Maintenance", name: "preventive_maintenance" },
        { label: "Exchange Corrective Reaction", name: "exchange_corrective_reaction" },
        { label: "Corrective Reaction", name: "corrective_reaction" },
        { label: "Total", name: "total" },
      ]);
      setItems(itemsDaily)
      setItemsBackup(itemsDaily)
    }else{
      setColumns([
        {
          name: "_id",
          options: {
            display: false,
          },
        },
        {
          name: "createdAt",
          label: "Day",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => (
              <Moment format="DD MMM YYYY">{value}</Moment>
            ),
          },
        },
        {
          name: "location",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if(value){
              let cityValue = "-";
              let neighbourhoodValue = "-";
                if (citiesList.filter((e) => e._id == value.city_id)[0]) {
                  cityValue = citiesList.filter((e) => e._id == value.city_id)[0].name;
                }
                if (neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0]) {
                  neighbourhoodValue = neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0].name;
                }
              return (
                <div style={{ width: 230, display: "flex", alignItems: "center" }}>
                  <div className="avatar_circle">
                    {cityValue.substring(0, 2)}
                  </div>
                  <div>
                    {cityValue}
                    <br />
                    {neighbourhoodValue}
                    <br />
                    <strong>
                      {value ? value.shop_name : "-"} / {value ? value.mobile : "-"}
                    </strong>
                  </div>
                </div>
              );
            }
            },
          },
        },
        {
          name: "operation_number",
          label: "Operation #",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              let supplierName = "";
              if (tableMeta.rowData[10]) {
                let supplierValue = suppliersList.length?suppliersList.find(
                  (e) => e._id == tableMeta.rowData[10]
                ):[];
                supplierName = supplierValue?supplierValue.name:"";
              }
              return (
                <div>
                  <a
                    onClick={() =>
                      handleOpenOperationDialog(value, supplierName)
                    }
                  >
                    {value}
                  </a>
                </div>
              );
            },
          },
        },
        { label: "Fridge", name: "sn",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            if (value) {
              let snValue = cabinetsList.filter((e) => e._id == value);
              return (
                <div>
                  <a onClick={() => handleOpenSnDialog(value)}>{snValue.length ? snValue[0].sn : "-"}</a>
                </div>
              );
            }
          },
        },},
        { label: "Client", name: "sn",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              let client="";
              if(cabinetsList.filter(e=>e._id===value).length){
                let clientId=cabinetsList.filter(e=>e._id===value)[0].client
                client=clientsList.filter(e=>e._id===clientId).length?clientsList.filter(e=>e._id===clientId)[0].name:""
              }
              return client;
            },
          },
        },
        // { label: "Fridge", name: "sn",
        //   options: {
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return cabinetsList.filter(e=>e._id===value).length?cabinetsList.filter(e=>e._id===value)[0].sn:"";
        //     },
        //   },
        // },
        { label: "Type", name: "sn",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              let type="";
              if(cabinetsList.filter(e=>e._id===value).length){
                let typeId=cabinetsList.filter(e=>e._id===value)[0].type
                type=fridgesTypesList.filter(e=>e._id===typeId).length?fridgesTypesList.filter(e=>e._id===typeId)[0].name:""
              }
              return type;
            },
          },
        },
        { label: "Handling IN / OUT", name: "handling_in" },
        { label: "Storage", name: "storage" },
        { label: "In House Prev", name: "in_house_preventive_maintenance" },
        { label: "In House Corrective", name: "corrective_service_in_house" },
        { label: "Testing", name: "cabinet_testing_fees" },
        { label: "Branding", name: "branding_fees" },
        { label: "Transportation", name: "transportation_fees" },
        { label: "Preventive", name: "preventive_maintenance" },
        { label: "Corrective", name: "exchange_corrective_reaction" },
        { label: "Total", name: "total" },
      ]);
      setItems(itemsDetails)
      setItemsBackup(itemsDetails)
    }
  };
  fetchData();
  },[tabIndex,itemsDetails,itemsDaily])

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: pagingInfo.limit,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar 
          handleFilter={handleFilter}
        />
      );
    },
    serverSide: true,
    count:pagingInfo.count, // Use total number of items
    page: pagingInfo.page,
    onTableChange: (action, tableState) => {
      if (action === "changePage") {
        setPagingInfo({...pagingInfo,page:tableState.page,skip:tableState.page*pagingInfo.limit});
      }else if(action === "changeRowsPerPage"){
        setPagingInfo({...pagingInfo,limit:tableState.rowsPerPage});
      }
    }
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };
  
  const handleOpenOperationDialog = (operationNum,supplierName)=>{
    setOpenOperationDialog(true)
    setOperationNum(operationNum)
    setSupplierName(supplierName)
  }
  
  const handleOpenSnDialog = (id)=>{
    setOpenSnDialog(true)
    setSnId(id)
  }
  //Search component ---------------START--------------
  
    
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    setSearchEntry(newValue)

  }
  //Search component ---------------END--------------
  return (
    <>
      <TabsOnTop
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        setIsLoading={setIsLoading}
      />
      <Container maxWidth="xl" style={{ paddingTop: "4rem" }}>
        <Autocomplete
          multiple
          freeSolo
          limitTags={3}
          id="tags-standard"
          options={[]}
          getOptionLabel={(option) => option}
          onChange={handleChangeSearch}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Search Data"
              label="Filter by Job #, Operation # and Serial #"
            />
          )}
        />
        {!isLoading ? (
          <MuiThemeProvider theme={datatableThemeInTabsPage}>
            <MUIDataTable
              title=""
              data={items}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        ) : (
          <CircularProgress size={30} className="pageLoader" />
        )}
      </Container>
      
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openOperationDialog}
          onClose={() => setOpenOperationDialog(false)}
        >
          <OperationDialog setOpenDialog={setOpenOperationDialog} operationNum={operationNum} supplierName={supplierName} cabinetsList={cabinetsList} />
        </Dialog>
        
        {/*********************** -Sn Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openSnDialog}
          onClose={() => setOpenSnDialog(false)}
        >
          <SnDialog setOpenDialog={setOpenSnDialog} snId={snId} cabinetsList={cabinetsList} />
        </Dialog>
        {/*********************** FILTER start ****************************/}
        <Dialog
          onClose={() => setFilterDialog(false)}
          maxWidth={"xl"}
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} setItems={setItems} setPagingInfo={setPagingInfo} pagingInfo={pagingInfo} />
        </Dialog>
    </>
  );
}
export default FinanceReport