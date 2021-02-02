import React, { useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Autocomplete,
} from "@material-ui/lab";

import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  Slide,
  Avatar,
} from "@material-ui/core";


import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import { Close ,Check} from "@material-ui/icons";
import CustomToolbar from "../../CustomToolbar";
import Swal from "sweetalert2";
import dataJson from "./data.json";
import withReactContent from "sweetalert2-react-content";
import fridgeDummy from "../../assets/img/fridge-1.jpg";
import clientDummy from "../../assets/img/clientDummy.png";
import "./Typography.css";
import AddFormDialog from "components/CustomComponents/AddFormDialog.js";
import TabsOnTopFromStatus from "components/CustomComponents/TabsOnTopFromStatus.js";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Cabinets = () => {
  const classes = useStyles(); //custom css

  const [tabIndex, setTabIndex] = useState(0);
  const [itemsFiltered, setItemsFiltered] = useState(); //table items
  const [openDialogItem, setOpenDialogItem] = useState(false); //for modal1
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title

  var selected_rows = null;
  var setSelectedRows_function = null;
  const MySwal = withReactContent(Swal); //swal

  /************ -Datatable START- **************/
  const [items, setItems] = useState(dataJson); //table items
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar listener={handleAdd} />;
    },
  };
  const columns = [
    {
      name: "sn",
      label: "Sn",
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
      label: "Type",
    },
    {
      name: "manufacture",
      label: "Manufacture",
    },
    {
      name: "client",
      label: "Client",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="d-flex">
            <div className="avatar_circle">{value.substring(0, 2)}</div>
            {value}
          </div>
        ),
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
      label: "Finance $",
    },
    {
      name: "location",
      label: "Location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div style={{ width: 200 }}>
            <strong>City</strong>: {value ? value.City : "-"}
            <br />
            <strong>Area</strong>: {value ? value.Area : "-"}
            <br />
            <strong>Mobile</strong>: {value ? value.Mobile : "-"}
            <br />
          </div>
        ),
      },
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "is_new",
      label: "Is New",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          (value!=0) ? <Check /> : <Close /> 
        ),
      },
    },
    {
      name: "booked",
      label: "Booked",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          (value!=0) ? <Check /> : <Close /> 
        ),
      },
    },
  ];
  /************ -Datatable END- **************/
  const top100Films = [];

  /************ -Tabs START- **************/
  const dataLength = (status) => {
    const filteredObj =
      status.toUpperCase() === "ALL"
        ? items
        : items.filter((e) => {
            return e.status.toUpperCase() == status.toUpperCase();
          });
    return filteredObj.length;
  };
  const tabsTitle = [
    /***** get unique status *****/
    ...new Set(
      dataJson.map((e) => {
        return e.status;
      })
    ),
  ];
  const handleChangeTabs = (event, newIndex) => {
    let status = document.querySelector(`#full-width-tab-${newIndex}`)
      .firstChild.firstChild.textContent;
    setItemsFiltered(
      status.toUpperCase() === "ALL"
        ? items
        : items.filter((e) => {
            return e.status.toUpperCase() == status.toUpperCase();
          })
    );
    setTabIndex(newIndex);
  };
  /************ -Tabs END- **************/

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
              <img src={fridgeDummy} alt="" />
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
              <img src={clientDummy} alt="" />
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

  function deleterows(row) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(row),
    };

    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}ws_tfridges.php?action=2`,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            var data1 = items;

            setSelectedRows_function([]);
            row.map((row) => {
              data1 = data1.filter((user) => user.serial !== row.serial);
            });

            console.log(data1);

            setItems(data1);
          })
          .catch((error) => {
            alert("error");
            console.log("There was an error!", error);
          });

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  const delete_listener = () => {
    let myItems = [];

    selected_rows.data.map((anObjectMapped, index) => {
      myItems.push({ serial: items[anObjectMapped.dataIndex].serial });
    });

    deleterows(myItems);
  };

  const handleAdd = () => {
    setOpenDialog2(true);
    setmodal_Title("Add");
  };

  const handleClickOpenDialog2 = (rowID, modal_Title) => {
    setOpenDialog2(true);
    setmodal_Title(modal_Title);
  };

  return (
    <div>
      <TabsOnTopFromStatus
        items={items}
        setItemsFiltered={setItemsFiltered}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
      <Container maxWidth="xl" style={{paddingTop:"4rem"}}>
        <Autocomplete
          multiple
          id="tags-filled"
          options={top100Films.map((option) => option.title)}
          defaultValue={[]}
          freeSolo
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
              placeholder="Search Data"
            />
          )}
        />
        <MuiThemeProvider theme={datatableThemeInTabsPage}>
        <MUIDataTable
          title=""
          data={itemsFiltered ? itemsFiltered : items}
          columns={columns}
          options={options}
        />
        </MuiThemeProvider>
      </Container>

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
      </div>
    </div>
  );
};

export default Cabinets;
