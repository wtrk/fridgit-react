import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import CustomToolbarSelect from "../../CustomToolbarSelect";
import CustomToolbar from "../../CustomToolbar";

import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Check from "@material-ui/icons/Check";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FormControl from "@material-ui/core/FormControl";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Chip from "@material-ui/core/Chip";

import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import { ListItemSecondaryAction } from "@material-ui/core";
import "./Typography.css";
import TabsJson from "./TabsJson.json";

const useStyles_theme = makeStyles(styles);
const top100Films = [];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
  formControl: {
    minWidth: "100%",
  },

  root_avatar: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },

  root_modal: {
    margin: 0,
    padding: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function FullWidthTabs() {
  const classes = useStyles(); //custom css
  const classes_theme = useStyles_theme(); //theme css

  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]); //table items
  const [clients, setClients] = useState([]); //Clients Dropdown
  const [fridgestype, setFridgestype] = useState([]); //fridgestype Dropdown
  const [openDialog1, setOpenDialog1] = useState(false); //for modal1
  const [openDialog2, setOpenDialog2] = useState(false); //for modal2
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title

  var selected_rows = null;
  var setSelectedRows_function = null;

  const MySwal = withReactContent(Swal); //swal

  function handlechange_modal(event) {
    const { id, value, checked, type } = event.target;

    var row_json = { row: value };

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(row_json),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}ws_fridgetype.php`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const listclients = data.map((data) => (
          <MenuItem value={data.serial}>{data.description}</MenuItem>
        ));
        setFridgestype(listclients);
      })
      .catch((error) => {
        alert(error.toString());
      });
  }

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

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle
        disableTypography
        className={classes.root_modal}
        {...other}
      >
        <Typography variant="h6">{children}</Typography>
      </MuiDialogTitle>
    );
  });

  const columns = [
    {
      name: "sn",
      label: "Sn",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={handleClickOpenDialog1}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "type_id",
      label: "Type",
    },
    {
      name: "branding_type",
      label: "Branding",
    },
    {
      name: "CUSTT",
      label: "Client",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => (
          <div>
            <div className={classes.root_avatar}>
              <Avatar className={classes.purple}>
                {value.substring(0, 2)}
              </Avatar>
              <span style={{ paddingTop: "8px" }}>{value}</span>
            </div>
          </div>
        ),
      },
    },
    {
      name: "preventive_count",
      label: "Days To Prev",
    },
    {
      name: "position",
      label: "Prev Status",
    },
    {
      name: "position",
      label: "Finance $",
    },
    {
      name: "position",
      label: "Location",
    },
    {
      name: "position",
      label: "Status",
    },
    {
      name: "isnew",
      label: "Is New",
    },
    {
      name: "inoperation",
      label: "In Operation",
    },
  ];

  const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      selected_rows = selectedRows;
      setSelectedRows_function = setSelectedRows;

      return <CustomToolbarSelect delete_listener={delete_listener} />;
    },
    customToolbar: () => {
      return <CustomToolbar listener={handleAdd} />;
    },
    //this.deleteRows
  };

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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}ws_fridges.php?filter=${value}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        alert(error.toString());
      });
  }, [value]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/ws_clients.php`)
      .then((response) => response.json())
      .then((data) => {
        const listclients = data.map((data, index) => (
          <MenuItem key={index} value={data.serial}>
            {data.company}
          </MenuItem>
        ));
        setClients(listclients);
      })
      .catch((error) => {
        alert(error.toString());
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClickOpenDialog2 = (rowID, modal_Title) => {
    setOpenDialog2(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);
  };

  const handleAdd = () => {
    setOpenDialog2(true);
    setRowID(0);
    setmodal_Title("Add");
  };

  const delete_listener = () => {
    let myItems = [];

    selected_rows.data.map((anObjectMapped, index) => {
      myItems.push({ serial: items[anObjectMapped.dataIndex].serial });
    });

    console.log(myItems);

    deleterows(myItems);
  };

  const handleClickOpenDialog1 = () => {
    setOpenDialog1(true);
  };

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  return (
    <div className={classes.root + " body-container"}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          className="tabs-container"
        >
          {TabsJson.map((e) => (
            <Tab
              id={`full-width-tab-${e.id}`}
              aria-controls={`full-width-tabpanel-${e.id}`}
              key={e.id}
              className="text-white"
              label={
                <Fragment>
                  {e.name}
                  <div className="table-length-cont">{e.count}</div>
                </Fragment>
              }
            />
          ))}
        </Tabs>
      </AppBar>
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
      {console.log("items", items)}
      <MuiThemeProvider>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
      </MuiThemeProvider>
      <div>
        {/*below Dialog opens when clicking on edit*/}
        <Dialog
          fullScreen
          open={openDialog2}
          onClose={handleCloseDialog2}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog2}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {modal_Title + " Fridge"}
              </Typography>
              <Button autoFocus color="inherit" onClick={handleCloseDialog2}>
                save
              </Button>
            </Toolbar>
          </AppBar>

          <div style={{ padding: "50px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Client
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    onChange={handlechange_modal}
                    autoWidth
                  >
                    {clients}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-autowidth-label1">
                    Client
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label1"
                    id="demo-simple-select-autowidth1"
                    autoWidth
                  >
                    {fridgestype}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Sn"
                  id="dob"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Sn2"
                  id="position"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Note"
                  id="username"
                  type="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Branding"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Preventive/Year"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                Received New
                <Checkbox
                  checked="1"
                  tabIndex={-1}
                  checkedIcon={<Check className={classes_theme.checkedIcon} />}
                  icon={<Check className={classes_theme.uncheckedIcon} />}
                  classes={{
                    checked: classes_theme.checked,
                    root: classes_theme.root,
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>
        {/*below Dialog opens when clicking on item to edit*/}
        <Dialog
          onClose={handleCloseDialog1}
          maxWidth={"xl"}
          fullWidth={true}
          aria-labelledby="customized-dialog-title"
          open={openDialog1}
        >
          <DialogContent
            dividers
            style={{ background: "#FFCC00", color: "white" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <div className={classes.root_avatar}>
                  <Avatar>JO</Avatar>

                  <ul style={{ listStyleType: "none" }}>
                    <li style={{ color: "grey" }}>Customer</li>
                    <li>Jollychic</li>
                  </ul>
                </div>
              </Grid>

              <Grid item xs={4}>
                Sn: 18GE43250
                <br />
                Status: Operational
              </Grid>

              <Grid item xs={4}>
                Branding:Walls
                <br />
                Type:
              </Grid>
            </Grid>
            <br />
            <div>
              <Button className="text-white">History</Button>
              <Button className="text-white">Customer</Button>
              <Button
                onClick={() => {
                  handleClickOpenDialog2("1", "Edit");
                }} //}
                className="text-white"
                className={classes.button}
              >
                Edit
              </Button>
            </div>
          </DialogContent>
          <DialogContent dividers>
            <Fragment>
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
                    <Typography color="textSecondary">
                      01/01/2020 09:30 am
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography color="textSecondary">
                      10/08/2020 10:00 am
                    </Typography>
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
                    <Typography color="textSecondary">
                      01/10/2020 12:00 am
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography color="textSecondary">
                      10/10/2020 9:00 am
                    </Typography>
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
            </Fragment>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseDialog1} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
