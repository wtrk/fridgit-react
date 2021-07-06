import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { Close ,Check} from "@material-ui/icons";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import FilterComponent from "./Components/FilterComponent.js";
import SubTables from "./Components/SubTables.js";
import ImportXlsx from "./Components/ImportXlsx.js";
import axios from 'axios';

import AddFormDialog from "components/CustomComponents/AddFormDialog.js";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from "@material-ui/lab";
import {
  Button,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Grid,
} from "@material-ui/core";
import Moment from "react-moment";
import moment from "moment";
import TabsOnTop from "./Components/TabsOnTop.js";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
  },

  root_avatar: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },

  root_modal: {
    margin: 0,
    padding: theme.spacing(2),
  },
}));
const Cabinet = () => {
  const classes = useStyles(); //custom css
  const [isLoading, setIsLoading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [cabinetId, setCabinetId] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [openDialogItem, setOpenDialogItem] = useState(false); //for modal1
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [itemsBackup, setItemsBackup] = useState([]);
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
  const [liveOperationsList, setLiveOperationsList] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({page:0,limit:10,skip:0,count:0}); //Pagination Info
  const [searchEntry, setSearchEntry] = useState([]); //searchEntry
  const [importXlsx, setImportXlsx] = useState(false); //Import Excel
  const [cabinetsSn, setCabinetsSn] = useState();
  const [clientInfo, setClientInfo] = useState();
  const [fridgeInfo, setFridgeInfo] = useState();
  const [preventiveActions, setPreventiveActions] = useState();
  

  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/cities`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/stores`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/warehouses`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/preventiveActions`)
        ]).then(response => {
          setCitiesList(response[0].data)
          setNeighbourhoodsList(response[1].data)
          setClientsList(response[2].data)
          setStoresList(response[3].data)
          setWarehousesList(response[4].data)
          setFridgesTypesList(response[5].data)
          setPreventiveActions(response[6].data)
        })
    };
    fetchData();
  }, [openAddForm]);
  
  useEffect(() => {
    const fetchData = async () => {
      const sn=liveOperationsList.length?liveOperationsList[0].sn:null;
      const clientId=liveOperationsList.length?liveOperationsList[0].client_id:null;
      const findSn=sn?items.find(e=>e._id===sn):null;
      setCabinetsSn(findSn?findSn.sn:"")
      if(clientId){
        await axios(`${process.env.REACT_APP_BASE_URL}/clients/${clientId}`, {
          responseType: "json",
        }).then((response) => {
          setClientInfo(response.data)
        });
      }
      if(findSn){
        await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/bySn/${liveOperationsList[0].sn}`, {
          responseType: "json",
        }).then((response) => {
          setFridgeInfo(response.data)
        });
      }
    };
    fetchData();
  }, [liveOperationsList]);


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets/export`, {responseType: "json"
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
      responseType: "json",
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
}, [openAddForm,pagingInfo.page,pagingInfo.limit,searchEntry]);


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/bySn/${cabinetId}`, {
        responseType: "json",
      }).then((response) => {
        setLiveOperationsList(response.data)
      });
    };
    fetchData();
  }, [cabinetId]);

  const [dialogItemTab, setDialogItemTab] = useState(1);
  const DialogTabsContent = (props) => {
    console.log("1")
    if (props.tab === 1) {
      return (
        <Timeline align="left">
        {liveOperationsList
          ? liveOperationsList.map((e) => (
            <TimelineItem key={e._id} style={{minHeight:50}}>
            <TimelineOppositeContent>
                  <Typography>{e.operation_type} ({e.operation_number})</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                <Moment format="DD MMM YYYY - HH:mm">{e.createdAt}</Moment>
                </TimelineContent>
              </TimelineItem>
            ))
          : null}
      </Timeline>

      );
    } else if (props.tab === 2) {
      return (
        <Grid container className="infoTabContainer" spacing={3}>
          {fridgeInfo?<Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              {fridgeInfo.photo?
              <img src={`${process.env.REACT_APP_BACKEND_FILES}/types/${fridgeInfo.photo}`} alt="" /> 
              :null}
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Fridge</strong></h4>
              <p><strong>Type</strong>: {fridgeInfo.name}</p>
              {liveOperationsList.length?
                <p><strong>Branding</strong>: {liveOperationsList[0].brand}</p>
              :null}
              <p>
                <strong>SN</strong>: {cabinetsSn}
              </p>
              {liveOperationsList.length?
                <p><strong>Status</strong>: {liveOperationsList[0].status}</p>
              :null}
              <p>
                <strong>CBM</strong>: {fridgeInfo.cbm}
              </p>
            </Grid>
          </Grid>:null}

        {clientInfo?<Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              {clientInfo.photo?
              <img src={`${process.env.REACT_APP_BACKEND_FILES}/clients/${clientInfo.photo}`} alt="" />
              :null}
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Client</strong></h4>
              <p>
                <strong>Company</strong>: {clientInfo.name}
              </p>
              <p>
                <strong>Address</strong>:  {clientInfo.address}
              </p>
              <p>
                <strong>Phone</strong>:  {clientInfo.phone}
              </p>
              <p>
                <strong>Email</strong>:  {clientInfo.email}
              </p>
            </Grid>
          </Grid>:null}
          </Grid>
      );
    } else if (props.tab === 3) {
      let preventive=items.find(e=>e._id===cabinetId).preventive
      preventive=preventive?preventive.filter(e=>e.reportable===true):[]
      if(preventive.length){
        const columnsPreventive = [
          {
            name: "_id",
            options: {display: false}
          },
          {
            name: "preventiveActions_id",
            options: {display: false}
          },
          {name: "date",label: "Date"},
          {name: "operation_number",label: "Qperation Number"},
          {name: "preventiveActions_id",label: "Preventive Actions",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                return preventiveActions.find(e=>e._id===tableMeta.rowData[1]).name;
              },
            },
          },
          {name: "rightAnswer_id",label: "Right Answer",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              const preventiveAnswers=preventiveActions.find(e=>e._id===tableMeta.rowData[1]).answers.find(e=>e._id===value)
              console.log("ddddddddddddddd",preventiveAnswers)
              return preventiveAnswers?preventiveAnswers.name:"-";
            },
          },
        },
          {name: "notes",label: "Notes",},
        ];
        return <MUIDataTable
            title=""
            data={preventive}
            columns={columnsPreventive}
          />
      }else{
        return <p>No Data Available</p>
      }
    }
  };
  const handleClickDialogItemTabs = (DialogItemTabSelected) => {
    setDialogItemTab(DialogItemTabSelected);
  };
  const handleClickOnItem = (title,cabinetId) => {
    setDialogItemTab(1);
    setOpenDialogItem(true);
    setCabinetId(cabinetId);
    setFormTitle(title);
  };
  const handleCloseDialogItem = () => {
    setOpenDialogItem(false);
  };

  const handleImportXlsx = () => {
    setImportXlsx(true)
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
              <a onClick={() => handleClickOnItem("Edit Cabinet - "+typeValue,tableMeta.rowData[0])}>
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
            locationValue=storesList.find(e=>e._id===tableMeta.rowData[12]).name
          }else if(value==="warehouse"){
            locationValue=warehousesList.find(e=>e._id===tableMeta.rowData[12]).name
          }
          return `${locationValue} (${value})`
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
          responseType: "json",
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

          {/*below Dialog opens when clicking on item in the list to edit*/}
          <Dialog
            onClose={handleCloseDialogItem}
            maxWidth={"xl"}
            fullWidth
            aria-labelledby="customized-dialog-title"
            open={openDialogItem}
          >
            {liveOperationsList.length?
            <DialogContent dividers className="entryEditHeader">
              <Grid container>
                <Grid item xs={4}>
                  <div className={classes.root_avatar}>
                    <Avatar>JO</Avatar>

                    <div>
                      <strong>Client</strong><br />
                      {clientsList.find(e=>e._id===liveOperationsList[0].client_id).name}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <strong>Sn:</strong> {items.find(e=>e._id===liveOperationsList[0].sn).sn}<br />
                  <strong>Status:</strong> {liveOperationsList[0].status}
                </Grid>

                <Grid item xs={4}>
                  <strong>Branding:</strong> {liveOperationsList[0].brand}<br />
                  <strong>Price Rule:</strong> {liveOperationsList[0].price_rule.name}
                </Grid>
              </Grid>
              <div className="entryEditHeader__tabsCont">
                <Button
                  className={"ceeh__tabsCont--btn " + (dialogItemTab === 1 ? "selected" : "")}
                  onClick={() => {
                    handleClickDialogItemTabs(1);
                  }}
                >
                  History
                </Button>
                <Button
                  className={"ceeh__tabsCont--btn " + (dialogItemTab === 2 ? "selected" : "")}
                  onClick={() => {
                    handleClickDialogItemTabs(2);
                  }}
                >
                  Info
                </Button>
                <Button
                  className={"ceeh__tabsCont--btn " + (dialogItemTab === 3 ? "selected" : "")}
                  onClick={() => {
                    handleClickDialogItemTabs(3);
                  }}
                >
                  Reported Answers
                </Button>
                <Button
                  id="Edit"
                  className="ceeh__tabsCont--btn"
                  onClick={() => {
                    handleAdd(formTitle,cabinetId)
                  }}
                >
                  Edit
                </Button>
              </div> 
            </DialogContent>:null}
            <DialogContent dividers>
              <DialogTabsContent tab={dialogItemTab} />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="btn btn--save"
                onClick={handleCloseDialogItem}
                startIcon={<Close />}
              >
                Close
              </Button>
            </DialogActions>
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