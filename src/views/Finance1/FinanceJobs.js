import React, { Fragment, useState } from "react";
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

import {
  TextField,
  Container,
  AppBar,
  Tabs,
  Tab,
  Typography,
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
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {datatableThemeInTabsPage} from "assets/css/datatable-theme.js";
import dataJson from "./data.json";
import { Close, SwapHoriz, LastPage } from "@material-ui/icons";
import CustomToolbar from "../../CustomToolbar";
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
      name: "job_number",
      label: "Job Number",
    },
    {
      name: "creation_date",
      label: "Creation Date",
    },
    {
      name: "operation_number",
      label: "Operation Number",
    },
    {
      name: "sn",
      label: "SN",
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
      name: "branding_type",
      label: "Branding Type",
    },
    {
      name: "client_name",
      label: "Client Name",
    },
    {
      name: "country",
      label: "Country",
    },
    {
      name: "city",
      label: "City",
    },
    {
      name: "neighbourhood",
      label: "Neighbourhood",
    },
    {
      name: "supplier",
      label: "Supplier",
    },
    {
      name: "client_approval",
      label: "Client Approval",
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "last_status_update",
      label: "Last Status Update",
    },
    {
      name: "amount",
      label: "Amount",
    },
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
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
      case "All":
        return 122000;
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
    "All",
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
  const handleChangeTabs = (event, newIndex) => {
    let status = document.querySelector(`#full-width-tab-${newIndex + 1}`)
      .firstChild.firstChild.textContent;

    switch (status) {
      case "All":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 22100,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 8000,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 50000,
          },
        ]);
        break;
      case "Handling IN / OUT":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 2200,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 100,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 120,
          },
        ]);
        break;
      case "Storage":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 1200,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 100,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 100,
          },
        ]);
        break;
      case "In House Prev":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 900,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 230,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 600,
          },
        ]);
        break;
      case "In House Corrective":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 600,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 860,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 200,
          },
        ]);
        break;
      case "Testing":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 300,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 320,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 400,
          },
        ]);
        break;
      case "Branding":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 400,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 240,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 200,
          },
        ]);
        break;
      case "Transportation":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 100,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 180,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 500,
          },
        ]);
        break;
      case "Preventive":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 500,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 850,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 100,
          },
        ]);
        break;
      case "Corrective":
        setItemsFiltered([
          {
            key: "1",
            job_number: "TT345678",
            creation_date: "27 Apr 2020",
            operation_number: "183333250",
            sn: "18GE43250",
            branding_type: "Walls",
            client_name: "Dany Sabir",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "need approval",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 200,
          },
          {
            key: "2",
            job_number: "TT345678",
            creation_date: "30 Jun 2020",
            operation_number: "183333252",
            sn: "18GE43252",
            branding_type: "Walls",
            client_name: "Rany Said",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "approved",
            status: "in progress",
            last_status_update: "10 Dec 2020",
            amount: 80,
          },
          {
            key: "3",
            job_number: "TT345678",
            creation_date: "21 Feb 2020",
            operation_number: "183333253",
            sn: "18GE43253",
            branding_type: "Walls",
            client_name: "Walid Waked",
            country: "ksa",
            city: "jeddah",
            neighbourhood: "street1",
            supplier: "Store",
            client_approval: "N/A",
            status: "in progress",
            last_status_update: "15 Dec 2020",
            amount: 100,
          },
        ]);
        break;
    }
    setValue(newIndex);
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

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

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
          onChange={handleChangeTabs}
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
