import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import AppBar from "@material-ui/core/AppBar";
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

import { useDropzone } from "react-dropzone";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Chip from "@material-ui/core/Chip";

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

export default function FullWidthTabs() {
  const classes = useStyles(); //custom css
  const classes_theme = useStyles_theme(); //theme css

  const theme = useTheme();

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]); //table items
  const [clients, setclients] = useState([]); //Clients Dropdown
  const [fridgestype, setfridgestype] = useState([]); //fridgestype Dropdown
  const [open, setOpen] = useState(false); //for modal
  const [open2, setOpen2] = useState(false); //for modal2
  const [open3, setOpen3] = useState(false); //for modal3
  const [open4, setOpen4] = useState(false); //for modal4
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const MySwal = withReactContent(Swal); //swal

  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2020-08-18T21:11:54")
  );

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

    fetch(`${process.env.REACT_APP_BASE_URL}ws_country`, requestOptions)
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

  const columns = [
    {
      name: "code",
      label: "Sn",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "name",
      label: "Ref",
    },
    {
      name: "name",
      label: "Type",
    },
    {
      name: "name",
      label: "Brand",
    },
    {
      name: "name",
      label: "Customer",
    },
    {
      name: "name",
      label: "City",
    },
    {
      name: "name",
      label: "Neighbourhood",
    },
    {
      name: "code",
      label: "Shop",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              // value={age}
              //  onChange={handlechange_modal}
              autoWidth
            >
              <MenuItem value="Shop1">Shop1</MenuItem>
              <MenuItem value="Shop2">Shop2</MenuItem>
              {/* {clients} */}
            </Select>
          );
        },
      },
    },
    {
      name: "name",
      label: "Supplier",
    },
    {
      name: "code",
      label: "Warehouse",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              // value={age}
              //  onChange={handlechange_modal}
              autoWidth
            >
              <MenuItem value="warehouse1">warehouse1</MenuItem>
              <MenuItem value="warehouse2">warehouse2</MenuItem>
              {/* {clients} */}
            </Select>
          );
        },
      },
    },
    {
      name: "code",
      label: "Operation",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Select
              style={{ width: "120px" }}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              // value={age}
              //  onChange={handlechange_modal}
              autoWidth
            >
              <MenuItem value="Deployment">Deployment</MenuItem>
              <MenuItem value="Retrieval">Retrieval</MenuItem>
              {/* {clients} */}
            </Select>
          );
        },
      },
    },
    {
      name: "code",
      label: "approve 1",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleClickOpen3("1", "Edit");
                }}
              >
                approve 1
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "code",
      label: "approve 2",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleClickOpen4("1", "Edit");
                }}
              >
                approve 2
              </a>
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
    fetch(`${process.env.REACT_APP_BASE_URL}/ws_city.php`)
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid style={{ paddingTop: "29px" }} item xs={12} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Operation
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              // value={age}
              //  onChange={handlechange_modal}
              autoWidth
            >
              {/* {clients} */}
              <MenuItem value="Deployment">Deployment</MenuItem>
              <MenuItem value="Retrieval">Retrieval</MenuItem>
            </Select>
          </FormControl>
          {/* <CustomInput
                     labelText="Client"
                     id="Firstname"
                      // handler={this.handlechange}
                      // value={this.state.single_user[0].Firstname}
                     formControlProps={{
                       fullWidth: true
                     }}
                   />  */}
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
            style={{ marginTop: "30px" }}
            variant="contained"
            //onClick={alert()}//("1","Edit")}
            color="primary"
            className={classes.button}
          >
            Add Operation
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid style={{ paddingLeft: "50px" }} item xs={12} sm={3}>
          <CustomInput
            labelText="Sn"
            id="dob"
            // handler={this.handlechange}
            // value={this.state.single_user[0].dob}
            formControlProps={{
              fullWidth: false,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            style={{ marginTop: "40px" }}
            variant="contained"
            onClick={() => {
              handleClickOpen2("1", "Edit");
            }}
            color="primary"
            className={classes.button}
          >
            Add
          </Button>
        </Grid>
      </Grid>

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

      <MuiThemeProvider>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
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
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {modal_Title + " City"}
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

              <Grid item xs={12} sm={12}>
                <MUIDataTable
                  title="Alias"
                  data={[{ name: "Jedda" }, { name: "Jeddah" }]}
                  //{this.state.user}
                  columns={[
                    {
                      name: "name",
                      label: "Name",
                    },
                  ]}
                  options={options}
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>

        <Dialog
          onClose={handleClose2}
          maxWidth={"xs"}
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
            12345
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
            12345 12345
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose2} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          onClose={handleClose3}
          maxWidth={"xs"}
          fullWidth={"true"}
          aria-labelledby="customized-dialog-title"
          open={open3}
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
            12345 444
          </DialogContent>
          <DialogContent dividers></DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose3} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog
        onClose={handleClose2}
        maxWidth={"xs"}
        fullWidth={"true"}
        aria-labelledby="customized-dialog-title"
        open={open4}
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
          12345
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
          12345 12345
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose2} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </section>
    </div>
  );
}
