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
import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
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
import TabsOnTopFromStatus from "components/CustomComponents/TabsOnTopFromStatus.js";
import "./Cabinets.css";


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
  const [isLoading, setIsloading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [cabinetsId, setCabinetID] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [openDialogItem, setOpenDialogItem] = useState(false); //for modal1
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [citiesList, setCitiesList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [fridgesTypesList, setFridgesTypesList] = useState([]);
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [itemsFiltered, setItemsFiltered] = useState(); //tabs items
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json",
      }).then((response) => {
        setCitiesList(response.data)
        return response.data
      });
      const clients = await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
        responseType: "json",
      }).then((response) => {
        setClientsList(response.data)
        return response.data
      });
      const fridgesTypesList = await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`, {
        responseType: "json",
      }).then((response) => {
        setFridgesTypesList(response.data)
        return response.data
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/cabinets`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        return setIsloading(false)
      });
    };
    fetchData();
  }, [openAddForm]);

  /**************** -OnClickItemDialog START- **************/
  const [dialogItemTab, setDialogItemTab] = useState(1);
  const DialogTabsContent = (props) => {
    if (props.tab === 1) {
      return (
        <Timeline align="alternate">
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>External Receipt</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="textSecondary">01/01/2020 09:30 am</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">10/08/2020 10:00 am</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Deployment</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>Retrieval</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="textSecondary">01/10/2020 12:00 am</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">10/10/2020 9:00 am</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Deployment</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      );
    } else if (props.tab === 2) {
      return (
        <Grid container className="infoTabContainer" spacing={3}>
          <Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              <img src={require("assets/img/fridge-1.jpg")} alt="" />
            </Grid>
            <Grid item xs={8}>
              <h3>Fridge</h3>
              <p>
                <strong>Type</strong>: EPTA 482L EIS (Ver-6S18B)
              </p>
              <p>
                <strong>Branding</strong>: Walls
              </p>
              <p>
                <strong>SN</strong>: 18GE43245
              </p>
              <p>
                <strong>Status</strong>: Needs Repair
              </p>
              <p>
                <strong>Location</strong>: Bekaa - CHAFIC JAMIL FOR GENERAL
                TRADING
              </p>
            </Grid>
          </Grid>

          <Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              <img src={require("assets/img/clientDummy.png")} alt="" />
            </Grid>
            <Grid item xs={8}>
              <h3>Client</h3>
              <p>
                <strong>Company</strong>: Unilever Levant S.A.R.L.
              </p>
              <p>
                <strong>Address</strong>: 3rd Floor, Dolphin Building, Fouad
                Ammoun Street-Jisr El Wati, Sin El Fil PO Box 90-908 Beirut/
                Lebanon
              </p>
              <p>
                <strong>Phone</strong>: +961 1 497630
              </p>
              <p>
                <strong>Email</strong>: Baker.Sibai@unilever.com
              </p>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };
  const handleClickDialogItemTabs = (DialogItemTabSelected) => {
    setDialogItemTab(DialogItemTabSelected);
  };
  const handleClickOnItem = () => {
    setDialogItemTab(1);
    setOpenDialogItem(true);
  };
  const handleCloseDialogItem = () => {
    setOpenDialogItem(false);
  };
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
          return (
            <div>
              <a onClick={handleClickOnItem}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "type",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let typeValue = "-"
          if(fridgesTypesList.filter(e=> e._id===value)[0]){
            typeValue = fridgesTypesList.filter((e) => e._id == value )[0].refrigerant_type;
          }
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit Cabinet - "+tableMeta.rowData[2],tableMeta.rowData[0]);
                }}
              >
                {typeValue}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "Manufacturer",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let typeValue = "-"
          if(fridgesTypesList.filter(e=> e._id===tableMeta.rowData[2])[0]){
            typeValue = fridgesTypesList.filter((e) => e._id == tableMeta.rowData[2] )[0].name;
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
    },
    {
      name: "prev_status",
      label: "Prev Status",
    },
    {
      name: "finance",
      label: "Finance $"
    },
    {
      name: "location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-"
          if(citiesList.filter(e=> e._id==value.city_id)[0]){
            cityValue = citiesList.filter(e=> e._id==value.city_id)[0].name;
          }

          return <div style={{ width: 200 }}>
            <strong>City</strong>: {cityValue}
            <br />
            <strong>Area</strong>: {value ? value.area : "-"}
            <br />
            <strong>Mobile</strong>: {value ? value.mobile : "-"}
            <br />
          </div>
        }
      },
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
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
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
      data.map(rowData=>{
        const city = citiesList.filter(e=> e._id==rowData.data[8].city_id)[0].name
        const area = rowData.data[8].area
        const mobile =rowData.data[8].mobile
        rowData.data[8] = "City: "+city+"\nArea: "+area+"\nMobile: "+mobile
        return rowData
      })
      return buildHead(columns) + buildBody(data);
    }
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, cabinetsId) => {
    setOpenAddForm(true);
    setCabinetID(cabinetsId);
    setFormTitle(title);
  };
  const handleCloseAddForm = () => setOpenAddForm(false)



  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  // const handleAdd = () => {
  //   setOpenDialog2(true);
  //   setmodal_Title("Add");
  // };
  const handleClickOpenDialog2 = (rowID, modal_Title) => {
    setOpenDialog2(true);
    setmodal_Title(modal_Title);
  };
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(itemsBackup.length===0) setItemsBackup(items)
    setSearchValue(newValue)
    if(newValue===null) setItems(itemsBackup); else setItems([newValue])
  }
  //Search component ---------------END--------------
  return (
    <>
      <TabsOnTopFromStatus
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
      <Container maxWidth="xl" style={{ paddingTop: "4rem" }}>
        <Autocomplete
          id="tags-filled"
          options={items || {}}
          value={searchValue || {}}
          getOptionLabel={(option) => option.sn || ""}
          onChange={handleChangeSearch}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="Search by Sn"
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
            fullWidth={true}
            aria-labelledby="customized-dialog-title"
            open={openDialogItem}
          >
            <DialogContent dividers className="entryEditHeader">
              <Grid container>
                <Grid item xs={4}>
                  <div className={classes.root_avatar}>
                    <Avatar>JO</Avatar>

                    <div>
                      <strong>Customer</strong>
                      <br />
                      Jollychic
                    </div>
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <strong>Sn:</strong> 18GE43250
                  <br />
                  <strong>Status:</strong> Operational
                </Grid>

                <Grid item xs={4}>
                  <strong>Branding:</strong> Walls
                  <br />
                  <strong>Type:</strong> Walls
                </Grid>
              </Grid>
              <div className="entryEditHeader__tabsCont">
                <Button
                  className={
                    "ceeh__tabsCont--btn " +
                    (dialogItemTab === 1 ? "selected" : "")
                  }
                  onClick={() => {
                    handleClickDialogItemTabs(1);
                  }}
                >
                  History
                </Button>
                <Button
                  className={
                    "ceeh__tabsCont--btn " +
                    (dialogItemTab === 2 ? "selected" : "")
                  }
                  onClick={() => {
                    handleClickDialogItemTabs(2);
                  }}
                >
                  Info
                </Button>
                <Button
                  id="Edit"
                  className="ceeh__tabsCont--btn"
                  onClick={() => {
                    handleClickOpenDialog2("1", "Edit");
                  }}
                >
                  Edit
                </Button>
              </div>
            </DialogContent>
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
              cabinetId={cabinetsId}
              citiesList={citiesList}
              clientsList={clientsList}
              fridgesTypesList={fridgesTypesList}
            />
          </Dialog>
          {/*********************** FILTER start ****************************/}
          <Dialog
            onClose={() => setFilterDialog(false)}
            maxWidth={"xl"}
            fullWidth={true}
            aria-labelledby="customized-dialog-title"
            open={filterDialog}
          >
            <FilterComponent setOpenDialog={setFilterDialog} />
          </Dialog>
        </div>
      </Container>
    </>
  );
}
export default Cabinet