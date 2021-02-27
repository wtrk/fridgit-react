import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import {datatableTheme} from "assets/css/datatable-theme.js";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import dataJson from "./data.json";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Chip from "@material-ui/core/Chip";
import Slide from "@material-ui/core/Slide";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Moment from "react-moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import CustomToolbarSelect from "../../CustomToolbarSelect";
import CustomToolbar from "../../CustomToolbar";
import "./LiveTransportation.css";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import { Add } from "@material-ui/icons";

import DateFnsUtils from "@date-io/date-fns";
const useStyles_theme = makeStyles(styles);

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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ClientsList = () => {
  const classes = useStyles(); //custom css
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOperation, setSelectedOperation] = useState("");
  const [submittedCreateJob, setSubmittedCreateJob] = useState(0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [itemsFiltered, setItemsFiltered] = useState(); //table items
  const [clients, setClients] = useState([]); //Clients Dropdown
  const [fridgestype, setFridgestype] = useState([]); //fridgestype Dropdown
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title

  var selected_rows = null;
  var setSelectedRows_function = null;
  const MySwal = withReactContent(Swal); //swal

  /************ -Datatable START- **************/
  const [items, setItems] = useState(dataJson); //table items
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
      return <CustomToolbar />;
    },
    //this.deleteRows
  };
  const columns = [
    {
      name: "sn",
      label: "Sn",
    },
    {
      name: "ref",
      label: "Ref",
    },
    {
      name: "type",
      label: "Type",
    },
    {
      name: "brand",
      label: "Brand",
    },
    {
      name: "client",
      label: "Client",
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
      name: "shop",
      label: "Shop",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              autoWidth
            >
              <MenuItem value="Shop1">Shop 1</MenuItem>
              <MenuItem value="Shop2">Shop 2</MenuItem>
            </Select>
          );
        },
      },
    },
    {
      name: "supplier",
      label: "Supplier",
    },
    {
      name: "warehouse",
      label: "Warehouse",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              autoWidth
            >
              <MenuItem value="warehouse1">Warehouse 1</MenuItem>
              <MenuItem value="warehouse2">Warehouse 2</MenuItem>
            </Select>
          );
        },
      },
    },
    {
      name: "operation",
      label: "Operation",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              autoWidth
            >
              <MenuItem value="Deployment">Deployment</MenuItem>
              <MenuItem value="Retrieval">Retrieval</MenuItem>
            </Select>
          );
        },
      },
    },
  ];
  /************ -Datatable END- **************/
  const top100Films = [];

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

  const delete_listener = () => {
    let myItems = [];

    selected_rows.data.map((anObjectMapped, index) => {
      myItems.push({ serial: items[anObjectMapped.dataIndex].serial });
    });

    console.log(myItems);

    deleterows(myItems);
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

  const [operation, setOperation] = React.useState("");

  const handleChange = (event) => {
    setOperation(event.target.value);
  };
  const handleCreateJob = () => {
    setSelectedOperation(
      document.getElementById("demo-simple-select").textContent
    );
    setSubmittedCreateJob(1);
  };
  return (
    <div>
      <Container maxWidth="xl" className="visitFormOnTop">
        <Grid container>
          {submittedCreateJob === 0 ? (
            <Grid item container xs={6} spacing={2}>
              <Grid item xs={4}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Default Operation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={operation}
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Deployment</MenuItem>
                    <MenuItem value={20}>Retrieval</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="btn btn--save"
                  startIcon={<Add />}
                  onClick={handleCreateJob}
                >
                  Create Job
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid item container xs={6} spacing={2}>
              <Grid item xs={3}>
                <div style={{ lineHeight: "3rem" }}>
                  <strong>Job Number: </strong>1
                </div>
              </Grid>
              <Grid item xs={5}>
                <div style={{ lineHeight: "3rem" }}>
                  <strong>Default Operation: </strong>
                  {selectedOperation}
                </div>
              </Grid>
              <Grid item xs={4}>
                <div style={{ lineHeight: "3rem" }}>
                  <strong>Date: </strong>
                  <Moment  format="DD MMM YYYY">{selectedDate}</Moment>
                </div>
              </Grid>
            </Grid>
          )}
          {submittedCreateJob === 1 ? (
            <Grid item container xs={6} spacing={2}>
              <Grid item xs={6}>
                <TextField label="Sn" />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="btn btn--save"
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Container>
      <Container maxWidth="xl">
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
            data={itemsFiltered ? itemsFiltered : items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </Container>
    </div>
  );
};

export default ClientsList;
