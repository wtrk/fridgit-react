import React, { useState,useEffect } from "react";
import {
  Container,
  Slide,
  Dialog,
  TextField,
  Chip,
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
import FilterComponent from "components/CustomComponents/FilterComponent.js";
import TabsOnTop from "./Components/TabsOnTop.js";
import SnDialog from "./Components/SnDialog.js";
import OperationDialog from "./Components/OperationDialog.js";
import JobDialog from "./Components/JobDialog.js";
import CustomToolbarSelect from "./Components/CustomToolbar/CustomToolbarSelect.js";

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullWidthTabs() {
  let history = useHistory();
const [tabIndex,setTabIndex] = useState(0); //tabs tabIndex
const [isLoading, setIsloading] = useState(true);  
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
const [itemsBackup, setItemsBackup] = useState([]); //Search
const [statusUpdated, setStatusUpdated] = useState([]); //Status Updated

useEffect(() => {
  const fetchData = async () => {
    const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
      responseType: "json",
    }).then((response) => {
      setCitiesList(response.data)
      return response.data
    });
    const neighbourhood = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`, {
      responseType: "json",
    }).then((response) => {
      setNeighbourhoodsList(response.data)
      return response.data
    });
    const client = await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
      responseType: "json",
    }).then((response) => {
      setClientsList(response.data)
      return response.data
    });
    const supplier = await axios(`${process.env.REACT_APP_BASE_URL}/suppliers`, {
      responseType: "json",
    }).then((response) => {
      setSuppliersList(response.data)
      return response.data
    });
    const cabinet = await axios(`${process.env.REACT_APP_BASE_URL}/cabinets`, {
      responseType: "json",
    }).then((response) => {
      setCabinetsList(response.data)
      return response.data
    });
  };
  fetchData();
}, []);
useEffect(() => {
  const fetchData = async () => {
    await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations`, {
      responseType: "json",
    }).then((response) => {
      setItems(response.data)
      setItemsBackup(response.data)
      return setIsloading(false)
    })
    .catch((error) => {
      console.log("error",error);
    });
  };
  fetchData();
}, [statusUpdated]);
  /************************* -Tabledata START- ***************************/
  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      },
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
              <a
                onClick={() =>
                  handleOpenJobDialog(value, supplierName)
                }
              >
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
    { name: "sn",
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
    { name: "promise_date", label: "Promise Date" },
  ];
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar listener={handleOpenAddDialog} handleFilter={handleFilter}/>
      );
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
     return  <CustomToolbarSelect setStatusUpdated={setStatusUpdated} selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} setItems={setItems} items={items}  />
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
    //setOpenAddDialog(true);
    //let path = `/admin/LiveTransportation_1`;
    let path = `/admin/LiveOperationAdd`;
    history.push(path);
  };
  const handleFilter = () => {
    setFilterDialog(true);
  };

    
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(newValue.length===0) setItems(itemsBackup); else{
      let valueToSearch=[]
      newValue.forEach(newValueEntry=>{
        valueToSearch.push(...itemsBackup.filter((e,i) => {
          if(!valueToSearch.map(eSearch=>eSearch._id).includes(e._id)){
            if (e.job_number.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
            if (e.operation_number.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
            if (e.sn.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
          }
        }))
      })
      setItems(valueToSearch)
    }
  }
  //Search component ---------------END--------------


  return (
    <div>
      <TabsOnTop
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
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
        {/*********************** -Job Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openOperationDialog}
          onClose={() => setOpenOperationDialog(false)}
        >
          <OperationDialog setOpenDialog={setOpenOperationDialog} operationId={operationId} supplierName={supplierName} />
        </Dialog>
        {/*********************** -Operation Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openJobDialog}
          onClose={() => setOpenJobDialog(false)}
        >
          <JobDialog setOpenDialog={setOpenJobDialog} jobNumber={jobNumber} supplierName={supplierName} />
        </Dialog>

        {/*********************** -Sn Dialog START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openSnDialog}
          onClose={() => setOpenSnDialog(false)}
        >
          <SnDialog setOpenDialog={setOpenSnDialog} snId={snId} />
        </Dialog>

        {/*********************** -FILTER START- ****************************/}
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={filterDialog}
          onClose={() => setFilterDialog(false)}
        >
          <FilterComponent setOpenDialog={setFilterDialog} />
        </Dialog>
      </div>
    </div>
  );
}
