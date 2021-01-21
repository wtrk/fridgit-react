import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {
  Autocomplete,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@material-ui/lab";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  AppBar,
  Typography,
  Box,
  DialogContent,
  Grid,
  DialogActions,
  IconButton,
  TextField,
  Chip,
  Button,
  Dialog,
  Toolbar,
  Slide,Avatar
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import datatableTheme from "assets/css/datatable-theme.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import {Close} from "@material-ui/icons";
import axios from 'axios';

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

export default function FullWidthTabs() {
  const classes = useStyles(); //custom css

  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
        await axios(`${process.env.REACT_APP_BASE_URL}/warehouse`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data[0].data)
      });
    };
    fetchData();
  }, []);
  const [open, setOpen] = useState(false); //for modal
  const [open2, setOpen2] = useState(false); //for modal2
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title


  const columns = [
    {
      name: "code",
      label: "Code",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={() => {handleClickOpen({value}, "Edit")}}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "name",
      label: "Name",
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

  const handleClickOpen = (rowID, modal_Title) => {
    setOpen(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);
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

      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
      </MuiThemeProvider>

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
                <Close />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {modal_Title + " Warehouse"}
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
                  labelText="Code"
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
                  labelText="Name"
                  id="position"
                  // handler={this.handlechange}
                  // value={this.state.single_user[0].position}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    City
                  </InputLabel>
                  <Select
                    style={{ width: "100%" }}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    autoWidth
                  >
                    <MenuItem value="City1">City1</MenuItem>
                    <MenuItem value="City2">City2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Neighbourhood
                  </InputLabel>
                  <Select
                    style={{ width: "100%" }}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    autoWidth
                  >
                    <MenuItem value="Neighbourhood1">Neighbourhood1</MenuItem>
                    <MenuItem value="Neighberhood2">Neighberhood2</MenuItem>
                  </Select>
                </FormControl>
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
