import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { Close ,Check} from "@material-ui/icons";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import FilterComponent from "./Components/FilterComponent.js";
import SubTables from "./Components/SubTables.js";
import ImportXlsx from "./Components/ImportXlsx.js";
import axios from 'axios';
import { getCookie } from 'components/auth/Helpers';
import SnDialog from "./Components/SnDialog.js";

import AddFormDialog from "components/CustomComponents/AddFormDialog.js";
import Moment from "react-moment";
import moment from "moment";
import TabsOnTop from "./Components/TabsOnTop.js";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Cabinet = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [cabinetId, setCabinetId] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [cabinetsToExport, setCabinetsToExport] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [fridgesTypesList, setFridgesTypesList] = useState([]);
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [itemsFiltered, setItemsFiltered] = useState(); //tabs items
  const [tabIndex, setTabIndex] = useState(0);
  const [pagingInfo, setPagingInfo] = useState({page:0,limit:10,skip:0,count:0}); //Pagination Info
  const [searchEntry, setSearchEntry] = useState([]); //searchEntry
  const [importXlsx, setImportXlsx] = useState(false); //Import Excel
  const [cabinetsList, setCabinetsList] = useState([]);
  const [openSnDialog,setOpenSnDialog] = useState(false);
  const [snId,setSnId] = useState();
  

  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/cities`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/stores`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/warehouses`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`,{headers: {Authorization: `Bearer ${token}`}}),
          // axios.get(`${process.env.REACT_APP_BASE_URL}/preventiveActions`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/cabinets`,{headers: {Authorization: `Bearer ${token}`}}),
        ]).then(response => {
          setCitiesList(response[0].data)
          setNeighbourhoodsList(response[1].data)
          setClientsList(response[2].data)
          setStoresList(response[3].data)
          setWarehousesList(response[4].data)
          setFridgesTypesList(response[5].data)
          setCabinetsList(response[6].data.data)
        })
    };
    fetchData();
  }, [openAddForm]);


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets/export`, {responseType: "json", headers: {Authorization: `Bearer ${token}`}
      }).then((response) => {
        setCabinetsToExport(response.data)
      });
    };
    fetchData();
  }, []);
  /**************** -OnClickItemDialog START- **************/
    
useEffect(() => {
  const fetchData = async () => {
    await axios(`${process.env.REACT_APP_BASE_URL}/cabinets?limit=${pagingInfo.limit}&skip=${pagingInfo.skip}&searchEntry=${searchEntry}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`}
    }).then((response) => {
      setPagingInfo({...pagingInfo,count:response.data.count});
      setItems(response.data.data)
      return setIsLoading(false)
    })
    .catch((error) => {
      console.log("error",error);
    });
  };
  fetchData();
}, [openAddForm,pagingInfo.page,pagingInfo.limit,searchEntry]);


  const handleImportXlsx = () => {
    setImportXlsx(true)
  }
  
  const handleOpenSnDialog = (id)=>{
    setOpenSnDialog(true)
    setSnId(id)
  }
  /**************** -OnClickItemDialog END- **************/
  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "sn",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          let typeValue = "-"
          if(fridgesTypesList.filter(e=> e._id===value)[0]){
            typeValue = fridgesTypesList.filter((e) => e._id == value )[0].refrigerant_type;
          }
          return (
            <div>
              <a onClick={() => handleOpenSnDialog(tableMeta.rowData[0])}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "sn2"
    },
    {
      name: "type",
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
    {
      name: "brand"
    },
    {
      name: "manufacturer",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let typeValue = "-"
          if(fridgesTypesList.filter(e=> e._id===tableMeta.rowData[3])[0]){
            typeValue = fridgesTypesList.filter((e) => e._id == tableMeta.rowData[3] )[0].name;
          }
          return typeValue;
        },
      },
    },
    {
      name: "client",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let companyValue = "-"
          let avatarValue = ""
          if(clientsList.filter(e=> e._id===value)[0]){
            companyValue = clientsList.filter((e) => e._id == value )[0].name;
            let valueArray=companyValue.split(" ")
            avatarValue = (valueArray.length>1)? valueArray[0].charAt(0) + valueArray[1].charAt(0): valueArray[0].substring(0,2);
          }
          return <div className="d-flex">
                  <div className="avatar_circle">{avatarValue}</div>
                  {companyValue}
                </div>
        },
      },
    },
    {
      name: "days_to_prev",
      label: "Days To Prev",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let currentRowInFridgeType=fridgesTypesList.filter(e=>e._id===tableMeta.rowData[3])[0]
          let prevCountPerYear=currentRowInFridgeType?currentRowInFridgeType.preventive_count_year:1
          let daysFromLastPrev=Math.round((moment().unix()-moment(tableMeta.rowData[8]).unix())/12/30/24/24)
          return tableMeta.rowData[8]?Math.round((365/prevCountPerYear)-daysFromLastPrev):"NA"
        },
      },
    },
    {
      name: "last_prev_date",
      label: "Last Preventive Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value?<Moment format="DD MMM YYYY">{value}</Moment>:"NA"
        },
      },
    },
    {
      name: "prev_status",
      label: "Preventive Status",
    },
    {
      name: "finance",
      label: "Finance $"
    },
    {
      name: "location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let locationValue
          if(value==="store"){
            locationValue=storesList.find(e=>e._id===tableMeta.rowData[12])
          }else if(value==="warehouse"){
            locationValue=warehousesList.find(e=>e._id===tableMeta.rowData[12])
          }
          return `${locationValue?locationValue.name:null} (${value})`
        }
      }
    },
    {
      name: "location_id",
      label: "location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-"
          let neighbourhoodValue = "-"
          let mobileValue = "-"
          if(tableMeta.rowData[11]==="store"){
            if(storesList.find(e=> e._id==value)){
              let locationValue = storesList.find(e=> e._id==value).location;
              if(citiesList.find(e=> e._id==locationValue.city_id)){
                cityValue = citiesList.find(e=> e._id==locationValue.city_id).name;
              }
              if(neighbourhoodsList.find(e=> e._id==locationValue.neighbourhood_id)){
                neighbourhoodValue = neighbourhoodsList.find(e=> e._id==locationValue.neighbourhood_id).name;
              }
              mobileValue=locationValue.mobile
            }
          }else if(tableMeta.rowData[11]==="warehouse"){
            if(warehousesList.find(e=> e._id==value)){
              let locationValue = warehousesList.find(e=> e._id==value).location;
              if(citiesList.find(e=> e._id==locationValue.city_id)){
                cityValue = citiesList.find(e=> e._id==locationValue.city_id).name;
              }
              if(neighbourhoodsList.find(e=> e._id==locationValue.neighbourhood_id)){
                neighbourhoodValue = neighbourhoodsList.find(e=> e._id==locationValue.neighbourhood_id).name;
              }
              mobileValue=locationValue.mobile
            }
          }
          return <div style={{ width: 200 }}>
            <strong>City</strong>: {cityValue?cityValue:"-"}
            <br />
            <strong>Neighbourhood</strong>: {neighbourhoodValue?neighbourhoodValue:"-"}
            <br />
            <strong>Mobile</strong>: {mobileValue?mobileValue:"-"}
            <br />
          </div>
        }
      }
    },
    {
      name: "status"
    },
    {
      name: "is_new",
      label: "Is New",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          (value!=0) ? <Check className="text-success" /> : <Close className="text-danger" /> 
        ),
      },
    },
    {
      name: "booked",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          (value!=0) ? <Check className="text-success" /> : <Close className="text-danger" /> 
        ),
      },
    },
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: pagingInfo.limit,
    rowsPerPageOptions: [10, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          importXlsx={handleImportXlsx}
          listener={() => {
            handleAdd("Add New Cabinet");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/cabinets/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`}
        }).then((response) => {
          console.log("deleted")
        });
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      let tableOptions=[
        { name: "sn",download:true},
        { name: "sn2",download:true},
        { name: "type",download:true},
        { name: "client",download:true},
        { name: "mobile",download:true},
        { name: "city",download:true},
        { name: "neighbourhood",download:true},
        { name: "brand",download:true},
        { name: "status",download:true},
        { name: "prev_status",download:true},
        { name: "is_new",download:true},
        { name: "booked",download:true},
      ]
      let tableData=cabinetsToExport.data.map((e,i)=>({index:i,data:Object.values(e)}))
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
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, cabinetId) => {
    setOpenAddForm(true);
    setCabinetId(cabinetId);
    setFormTitle(title);
    setOpenSnDialog(false)
  };
  const handleCloseAddForm = () => setOpenAddForm(false)



  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    setSearchEntry(newValue)
  }
  //Search component ---------------END--------------

  return (
    <>
      <TabsOnTop
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
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
            label="Filter by SN"
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

        <div>
        <Dialog
          maxWidth={"xl"}
          fullWidth
          TransitionComponent={Transition}
          open={openSnDialog}
          onClose={() => setOpenSnDialog(false)}
        >
          <SnDialog setOpenDialog={setOpenSnDialog} snId={snId} cabinetsList={cabinetsList} handleAdd={handleAdd} />
        </Dialog>
          {/*below Dialog opens when clicking on edit*/}
          <Dialog
            fullScreen
            open={openDialog2}
            onClose={handleCloseDialog2}
            TransitionComponent={Transition}
          >
            <AddFormDialog
              title={modal_Title + " Fridge"}
              handleClose={handleCloseDialog2}
              inputs={[
                {
                  labelText: "Client",
                  type: "select",
                  value: ["option 1", "option 2"],
                },
                {
                  labelText: "Client",
                  type: "select",
                  value: ["option 1", "option 2", "option 3"],
                },
                { labelText: "Sn", type: "text" },
                { labelText: "Sn2", type: "text" },
                { labelText: "Note", type: "text" },
                { labelText: "Branding", type: "text" },
                { labelText: "Preventive/Year", type: "text" },
              ]}
            />
          </Dialog>

          <Dialog
            fullScreen
            open={openAddForm}
            onClose={handleCloseAddForm}
            TransitionComponent={Transition}
          >
            <SubTables
              title={formTitle}
              handleClose={handleCloseAddForm}
              cabinetId={cabinetId}
              fridgesTypesList={fridgesTypesList}
              clientsList={clientsList}
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
            <FilterComponent setOpenDialog={setFilterDialog} setItems={setItems} setPagingInfo={setPagingInfo} pagingInfo={pagingInfo} />
          </Dialog>

          {/*********************** IMPORT EXCEL start ****************************/}
          <Dialog
            onClose={() => setImportXlsx(false)}
            maxWidth={"md"} fullWidth
            aria-labelledby="customized-dialog-title"
            open={importXlsx}
          > 
            <ImportXlsx setOpenDialog={setImportXlsx} clientsList={clientsList}  />
          </Dialog>
        </div>
      </Container>
    </>
  );
}
export default Cabinet