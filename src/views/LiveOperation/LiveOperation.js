import React, { useState,useEffect } from "react";
import {
  Container,
  Slide,
  Dialog,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import Moment from "react-moment";
import "react-dropzone-uploader/dist/styles.css";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useHistory } from "react-router-dom";
import "./LiveOperation.css";
import axios from 'axios';
import FilterComponent from "./Components/FilterComponent.js";
import TabsOnTop from "./Components/TabsOnTop.js";
import SnDialog from "./Components/SnDialog.js";
import OperationDialog from "./Components/OperationDialog.js";
import JobDialog from "./Components/JobDialog.js";
import CustomToolbarSelect from "./Components/CustomToolbar/CustomToolbarSelect.js";
import { getCookie } from '../../components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullWidthTabs() {
  const token = getCookie('token');
  let history = useHistory();
const [tabIndex,setTabIndex] = useState(0); //tabs tabIndex
const [isLoading, setIsLoading] = useState(true);  
const [items, setItems] = useState([]); //table items
const [itemsFiltered,setItemsFiltered] = useState(); //table items
const [filterDialog,setFilterDialog] = useState(false);
const [openSnDialog,setOpenSnDialog] = useState(false);
const [snId,setSnId] = useState();
const [citiesList, setCitiesList] = useState([]);
const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
const [clientsList, setClientsList] = useState([]);
const [suppliersList, setSuppliersList] = useState([]);
const [cabinetsList, setCabinetsList] = useState([]);
const [openOperationDialog,setOpenOperationDialog] = useState(false);
const [openJobDialog,setOpenJobDialog] = useState(false);
const [operationId,setOperationId] = useState();
const [jobNumber,setJobNumber] = useState();
const [supplierName,setSupplierName] = useState("");
const [liveOperationsToExport, setLiveOperationsToExport] = useState([]);
const [itemsBackup, setItemsBackup] = useState([]); //Search
const [statusUpdated, setStatusUpdated] = useState([]); //Status Updated
const [pagingInfo, setPagingInfo] = useState({page:0,limit:20,skip:0,count:20}); //Pagination Info
const [searchEntry, setSearchEntry] = useState([]); //searchEntry
const [countLiveOperations, setCountLiveOperations] = useState({}); //countStatus
const [countAll, setCountAll] = useState([]); //countAll



useEffect(() => {
  const fetchData = async () => {
      await axios.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/cabinets`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/suppliers`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/liveOperations/export`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/liveOperations/count`,{headers: {Authorization: `Bearer ${token}`}})
      ])
      .then(response => {
        setCabinetsList(response[0].data.data)
        setClientsList(response[1].data)
        setCitiesList(response[2].data)
        setNeighbourhoodsList(response[3].data)
        setSuppliersList(response[4].data)
        setLiveOperationsToExport(response[5].data)
        setCountLiveOperations(response[6].data)
      })
  };
  fetchData();
}, [statusUpdated]);


useEffect(() => {
  const fetchData = async () => {
    await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations?limit=${pagingInfo.limit}&skip=${pagingInfo.skip}&searchEntry=${searchEntry}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      setPagingInfo({...pagingInfo,count:response.data.count});
      setItems(response.data.data)
      setItemsBackup(response.data.data)
      return setIsLoading(false)
    })
    .catch((error) => {
      console.log("error",error);
    });
  };
  fetchData();
}, [statusUpdated,pagingInfo.page,pagingInfo.limit,searchEntry]);


  /************************* -Tabledata START- ***************************/
  const columns = [
    {
      name: "_id",
      options: { display: false },
    },
    {
      name: "sn",
      options: { display: false },
    },
    {
      name: "job_number",
      label: "Job #",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let supplierName = "";
          if (tableMeta.rowData[10]) {
            let supplierValue = suppliersList.filter(
              (e) => e._id == tableMeta.rowData[10]
            );
            if (supplierValue.length) supplierName = supplierValue[0].name;
          }
          return (
            <div>
              <a onClick={() => handleOpenJobDialog(value, supplierName)}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "createdAt",
      label: "Creation Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <Moment format="DD MMM YYYY - HH:mm">{value}</Moment>;
        },
      },
    },
    {
      name: "promise_date",
      label: "Promise Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <Moment format="DD MMM YYYY - HH:mm">{value}</Moment>;
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
            let supplierValue = suppliersList.filter(
              (e) => e._id == tableMeta.rowData[10]
            );
            if (supplierValue.length) supplierName = supplierValue[0].name;
          }
          return (
            <div>
              <a
                onClick={() =>
                  handleOpenOperationDialog(tableMeta.rowData[0], supplierName)
                }
              >
                {value}
              </a>
            </div>
          );
        },
      },
    },
    { name: "operation_type", label: "Operation Type" },
    {
      name: "sn",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let snValue = cabinetsList.filter((e) => e._id == value);
            return (
              <div>
                <a onClick={() => handleOpenSnDialog(value)}>
                  {snValue.length ? snValue[0].sn : "-"}
                </a>
              </div>
            );
          }
        },
      },
    },
    {
      name: "brand",
      options: {
        customBodyRender: (value, tableMeta, updateValue) =>
          value ? (
            <div className="d-flex">
              <div className="avatar_circle">{value.substring(0, 2)}</div>
              {value}
            </div>
          ) : null,
      },
    },
    {
      name: "client_id",
      label: "Client Name",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let clientValue = clientsList.filter((e) => e._id == value);
            return clientValue.length ? clientValue[0].name : "-";
          }
        },
      },
    },
    {
      name: "initiation_address",
      label: "Initiation Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let cityValue = "-";
            let neighbourhoodValue = "-";
            if (citiesList.filter((e) => e._id == value.city_id)[0]) {
              cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
                .name;
            }
            if (
              neighbourhoodsList.filter(
                (e) => e._id == value.neighbourhood_id
              )[0]
            ) {
              neighbourhoodValue = neighbourhoodsList.filter(
                (e) => e._id == value.neighbourhood_id
              )[0].name;
            }
            return (
              <div
                style={{ width: 230, display: "flex", alignItems: "center" }}
              >
                {cityValue != "-" ? (
                  <div className="avatar_circle">
                    {cityValue.substring(0, 2)}
                  </div>
                ) : null}
                <div>
                  {cityValue}
                  <br />
                  {neighbourhoodValue}
                  <br />
                  <strong>
                    {value ? value.shop_name : "-"} /{" "}
                    {value ? value.mobile : "-"}
                  </strong>
                </div>
              </div>
            );
          }
        },
      },
    },
    {
      name: "execution_address",
      label: "Execution Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let cityValue = "-";
            let neighbourhoodValue = "-";
            if (citiesList.filter((e) => e._id == value.city_id)[0]) {
              cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
                .name;
            }
            if (
              neighbourhoodsList.filter(
                (e) => e._id == value.neighbourhood_id
              )[0]
            ) {
              neighbourhoodValue = neighbourhoodsList.filter(
                (e) => e._id == value.neighbourhood_id
              )[0].name;
            }
            return (
              <div
                style={{ width: 230, display: "flex", alignItems: "center" }}
              >
                {cityValue != "-" ? (
                  <div className="avatar_circle">
                    {cityValue.substring(0, 2)}
                  </div>
                ) : null}
                <div>
                  {cityValue}
                  <br />
                  {neighbourhoodValue}
                  <br />
                  <strong>
                    {value ? value.shop_name : "-"} /{" "}
                    {value ? value.mobile : "-"}
                  </strong>
                </div>
              </div>
            );
          }
        },
      },
    },
    {
      name: "supplier_id",
      label: "supplier",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let supplierValue = suppliersList.filter((e) => e._id == value);
            return supplierValue.length ? supplierValue[0].name : "-";
          }
        },
      },
    },
    { name: "client_approval", label: "Client Approval" },
    { name: "status" },
    { name: "last_status_user", label: "Last Status User" },
    {
      name: "last_status_update",
      label: "Last Status Update",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            return <Moment format="DD MMM YYYY - HH:mm">{value}</Moment>;
          }
        },
      },
    },
  ];
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: pagingInfo.limit,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar listener={handleOpenAddDialog} handleFilter={handleFilter}/>
      );
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      const snSelected=displayData[selectedRows.data[0].dataIndex]?displayData[selectedRows.data[0].dataIndex].data[1]:null;
      const fridgeType=cabinetsList.find(e=>e._id===snSelected)?cabinetsList.find(e=>e._id===snSelected).type:null;
     return  <CustomToolbarSelect fridgeType={fridgeType} setStatusUpdated={setStatusUpdated} selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} setItems={setItems} items={items} cabinetsList={cabinetsList}  />
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      let tableOptions=[
        { name: "job_number",download:true},
        { name: "operation_number",download:true},
        { name: "operation_type",download:true},
        { name: "brand",download:true},
        { name: "city",download:true},
        { name: "neighbourhood",download:true},
        { name: "shop_name",download:true},
        { name: "mobile",download:true},
        { name: "status",download:true},
        { name: "allocation_rule",download:true},
        { name: "price_rule",download:true},
        { name: "last_status_user",download:true},
        { name: "last_status_update",download:true},
        { name: "supplier",download:true},
        { name: "sn",download:true},
        { name: "client",download:true},
      ]
      let tableData=liveOperationsToExport.data.map((e,i)=>({index:i,data:Object.values(e)}))
      return buildHead(tableOptions) + buildBody(tableData);
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
  const handleOpenOperationDialog = (id,supplierName)=>{
    setOpenOperationDialog(true)
    setOperationId(id)
    setSupplierName(supplierName)
  }
  const handleOpenJobDialog = (id,supplierName)=>{
    setOpenJobDialog(true)
    setJobNumber(id)
    setSupplierName(supplierName)
  }
  const handleOpenSnDialog = (id)=>{
    setOpenSnDialog(true)
    setSnId(id)
  }
  const handleOpenAddDialog = () => {
    let path = `/admin/LiveOperationAdd`;
    history.push(path);
  };
  const handleFilter = () => {
    setFilterDialog(true);
  };

    
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    setSearchEntry(newValue)
  }
  //Search component ---------------END--------------


  return (
    <div>
      {countLiveOperations.total?<TabsOnTop
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        countLiveOperations={countLiveOperations}
      />:null}
      <Container maxWidth="xl" style={{paddingTop:"4rem"}}>
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
            data={itemsFiltered ? itemsFiltered : items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
        ) : (
          <CircularProgress size={30} className="pageLoader" />
        )}


      </Container>
      <div>
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openOperationDialog}
          onClose={() => setOpenOperationDialog(false)}
        >
          <OperationDialog setOpenDialog={setOpenOperationDialog} operationId={operationId} supplierName={supplierName} cabinetsList={cabinetsList} />
        </Dialog>
        {/*********************** -Job Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openJobDialog}
          onClose={() => setOpenJobDialog(false)}
        >
          <JobDialog setOpenDialog={setOpenJobDialog} jobNumber={jobNumber} supplierName={supplierName} cabinetsList={cabinetsList} />
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
          TransitionComponent={Transition}
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} setItems={setItems} setPagingInfo={setPagingInfo} pagingInfo={pagingInfo} />
        </Dialog>

      </div>
    </div>
  );
}
