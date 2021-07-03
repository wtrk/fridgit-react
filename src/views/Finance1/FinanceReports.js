import React, { Fragment, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import dataJson from "./data-reports.json";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Chip from "@material-ui/core/Chip";
import Slide from "@material-ui/core/Slide";
import { Close, SwapHoriz, LastPage } from "@material-ui/icons";
import CustomToolbar from "../../CustomToolbar";
import Avatar from "@material-ui/core/Avatar";
import fridgeDummy from "../../assets/img/fridge-1.jpg";
import clientDummy from "../../assets/img/clientDummy.png";
import "./FinanceJobs.css";
import AddFormDialog from "components/CustomComponents/AddFormDialog.js";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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
const ClientsList = () => {
  const classes = useStyles(); //custom css

  const [value, setValue] = useState(0);
  const [itemsFiltered, setItemsFiltered] = useState(); //table items
  const [openDialogItem, setOpenDialogItem] = useState(false); //for modal1
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title

  /************ -Datatable START- **************/
  const [items, setItems] = useState(dataJson); //table items
  const columns = [
    {
      name: "Day",
      label: "Day",
    },
    {
      name: "Handling",
      label: "Handling IN / OUT",
    },
    {
      name: "Storage",
      label: "Storage",
    },
    {
      name: "InHousePrev",
      label: "In House Prev",
    },
    {
      name: "InHouseCorrective",
      label: "In House Corrective",
    },
    {
      name: "Testing",
      label: "Testing",
    },
    {
      name: "Branding",
      label: "Branding",
    },
    {
      name: "Transportation",
      label: "Transportation",
    },
    {
      name: "Preventive",
      label: "Preventive",
    },
    {
      name: "Corrective",
      label: "Corrective",
    },
  ];

  const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <div>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className="btn btn--save"
          onClick=""
          startIcon={<SwapHoriz />}
        >
          Update status
        </Button>
        &nbsp;
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className="btn btn--save"
          onClick=""
          startIcon={<LastPage />}
        >
          Assign to supplier
        </Button>
        &nbsp; &nbsp; &nbsp; &nbsp;
      </div>
    ),
    customToolbar: () => {
      return <CustomToolbar />;
    },
    //this.deleteRows
  };
  /************ -Datatable END- **************/
  const top100Films = [];

  /************ -Tabs START- **************/
  const dataLength = (status) => {
    switch (status) {
      case "Handling IN / OUT":
        return 22000;
      case "Storage":
        return 32000;
      case "In House Prev":
        return 8000;
      case "In House Corrective":
        return 12000;
      case "Testing":
        return 15000;
      case "Branding":
        return 22000;
      case "Transportation":
        return 32000;
      case "Preventive":
        return 3000;
      case "Corrective":
        return 2000;
    }
  };
  const tabsTitle = [
    "Handling IN / OUT",
    "Storage",
    "In House Prev",
    "In House Corrective",
    "Testing",
    "Branding",
    "Transportation",
    "Preventive",
    "Corrective",
  ];
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

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  const DialogContent = withStyles((theme) => ({
    root_modal: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles((theme) => ({
    root_modal: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const handleClickOpenDialog2 = (rowID, modal_Title) => {
    setOpenDialog2(true);
    setmodal_Title(modal_Title);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          className="TabsOnTopFromStatus"
          value={value}
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabsTitle.map((e, i) => (
            <Tab
              id={`full-width-tab-${i + 1}`}
              aria-controls={`full-width-tabpanel-${i + 1}`}
              key={i + 1}
              className="tabs-text-color"
              label={
                <Fragment>
                  <span>{e}</span>
                  <div className="table-length-cont">{dataLength(e)}</div>
                </Fragment>
              }
            />
          ))}
        </Tabs>
      </AppBar>
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
              { labelText: "Recieved new", type: "checkbox" },
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
          <DialogContent dividers className="entryEditHeader">
            <Grid container>
              <Grid item xs={4}>
                <div className={classes.root_avatar}>
                  <Avatar>JO</Avatar>

                  <div>
                    <strong>Client</strong>
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

export default ClientsList;
