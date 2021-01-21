import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
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
import FormHelperText from "@material-ui/core/FormHelperText";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

import { Create, Delete, Add } from "@material-ui/icons";
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

const useStyles_theme = makeStyles(styles);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
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
  closeButton_modal: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const classes = useStyles(); //custom css
  const classes_theme = useStyles_theme(); //theme css

  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]); //table items
  const [clients, setclients] = useState([]); //Clients Dropdown
  const [fridgestype, setfridgestype] = useState([]); //fridgestype Dropdown
  const [open, setOpen] = useState(false); //for modal
  const [open2, setOpen2] = useState(false); //for modal2
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const MySwal = withReactContent(Swal); //swal

  function handlechange_modal(event) {
    const { id, value, checked, type } = event.target;

    //  // 1. Make a shallow copy of the items
    //  let items = [...this.state.single_user];
    //  // 2. Make a shallow copy of the item you want to mutate
    //  let item = {...items[0]};
    //  // 3. Replace the property you're intested in
    //  item[[id]] = value;
    //  // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    //  items[0] = item;
    //  console.log(items);
    //  // 5. Set the state to our new copy
    //  this.setState({single_user:items});

    var row_json = { row: value };

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(row_json),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/ws_country.php`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const listclients = data.map((data) => (
          <MenuItem value={data.serial}>{data.description}</MenuItem>
        ));
        setfridgestype(listclients);
      })
      .catch((error) => {
        alert(error.toString());

        //  this.showNotification("Error!!","danger")
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

  function getMuiTheme() {
    return createMuiTheme({
      overrides: {
        MUIDataTable: {
          root: {},
          paper: {
            //  height: 'inherit',
            boxShadow: "none",
          },
          responsiveBase: {
            height: "350px!important",
          },
          responsiveScroll: {
            //  maxHeight: 'none',
            //  height: 'calc(100% - 128px)'
          },
        },
        MUIDataTableBodyRow: {
          root: {
            "&:nth-child(odd)": {
              backgroundColor: "#ebebeb",
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            padding: "0px",
          },
        },
      },
    });
  }

  const columns = [
    {
      name: "code",
      label: "Page",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleClickOpen("1", "Edit");
                }}
              >
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "code",
      label: "Can view",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Checkbox
                checked="1"
                tabIndex={-1}
                // onClick={() => handleToggle(value)}
                checkedIcon={<Check className={classes_theme.checkedIcon} />}
                icon={<Check className={classes_theme.uncheckedIcon} />}
                classes={{
                  checked: classes_theme.checked,
                  root: classes_theme.root,
                }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "code",
      label: "Can Edit",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Checkbox
                checked="1"
                tabIndex={-1}
                // onClick={() => handleToggle(value)}
                checkedIcon={<Check className={classes_theme.checkedIcon} />}
                icon={<Check className={classes_theme.uncheckedIcon} />}
                classes={{
                  checked: classes_theme.checked,
                  root: classes_theme.root,
                }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "code",
      label: "Can Delete",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Checkbox
                checked="1"
                tabIndex={-1}
                // onClick={() => handleToggle(value)}
                checkedIcon={<Check className={classes_theme.checkedIcon} />}
                icon={<Check className={classes_theme.uncheckedIcon} />}
                classes={{
                  checked: classes_theme.checked,
                  root: classes_theme.root,
                }}
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar />;
    },
  };

  function deleterow(row) {
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
            const data1 = items.filter((user) => user.serial !== row["row"]);

            setItems(data1);
          })
          .catch((error) => {
            alert("error");
            console("There was an error!", error);
          });

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(row),
    };
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/ws_neighbourhood.php`)
      .then((response) => response.json())
      .then((data) => {
        //  alert("use");
        setItems(data);
        // this.setState({
        //     loading:false,
        //     user:data
        // })
      })
      .catch((error) => {
        alert(error.toString());

        //  this.showNotification("Error!!","danger")
      });
  }, [value]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/ws_clients.php`)
      .then((response) => response.json())
      .then((data) => {
        const listclients = data.map((data) => (
          <MenuItem value={data.serial}>{data.company}</MenuItem>
        ));
        setclients(listclients);
      })
      .catch((error) => {
        alert(error.toString());

        //  this.showNotification("Error!!","danger")
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClickOpen = (rowID, modal_Title) => {
    setOpen(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);

    // alert(123);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <div className={classes.root}>
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

      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title=""
          data={items}
          //{this.state.user}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      {/* <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
       
        <MUIDataTable
  title={"Users"}
  data={items}
  //{this.state.user}
  columns={columns}
  options={options}
  
/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
 
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
       
        </TabPanel>
      </SwipeableViews> */}

      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {modal_Title + " User Roles"}
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>

          <div style={{ padding: "50px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Description"
                  id="dob"
                  // handler={this.handlechange}
                  // value={this.state.single_user[0].dob}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomInput
                  labelText="Privilege"
                  id="position"
                  // handler={this.handlechange}
                  // value={this.state.single_user[0].position}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>

        <Dialog
          onClose={handleClose2}
          maxWidth={"xl"}
          fullWidth={"true"}
          aria-labelledby="customized-dialog-title"
          open={open2}
        >
          {/* <DialogTitle style={{background:"red",color:"white"}} id="customized-dialog-title" onClose={handleClose2}>
          
 
           <div>
           
          </div>
         
        <div  >
      <Button color="primary">History</Button>
      <Button color="primary">Customer</Button>
      <Button
        //onClick={alert()}//("1","Edit")}
        color="primary"
        className={classes.button}
      >
        Edit
      </Button>
    
    </div>
        </DialogTitle> */}
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
                Sn:18GE43250
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
              <Button style={{ color: "white" }}>History</Button>
              <Button style={{ color: "white" }}>Customer</Button>
              <Button
                onClick={() => {
                  handleClickOpen("1", "Edit");
                }} //}
                style={{ color: "white" }}
                className={classes.button}
              >
                Edit
              </Button>
            </div>
          </DialogContent>
          <DialogContent dividers>
            {/* <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </Typography> */}

            <React.Fragment>
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
            </React.Fragment>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose2} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
