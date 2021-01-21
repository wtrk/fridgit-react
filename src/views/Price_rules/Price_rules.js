import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import datatableTheme from "assets/css/datatable-theme.js";
import { Close, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Container,
  AppBar,
  Typography,
  Box,
  Button,
  Dialog,
  Toolbar,
  Slide,
  IconButton,
  TextField,
  Chip,
} from "@material-ui/core";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import "./Price_rules.css";
import items from "./items.json";
import SubTables from "./Components/SubTables.js";

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

  const [open, setOpen] = useState(false); //for modal
  const [openSubTable, setOpenSubTable] = useState(false); //for modal
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [subTablesTitle, setSubTablesTitle] = useState("Add"); //modal title


  const handleClickOpen = (rowID, modal_Title) => {
    setOpen(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSubTable = () => setOpenSubTable(false);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div
              onClick={() => {
                handleClickOpenSubTable("1", "Edit");
              }}
              class="table-link"
            >
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "service",
      label: "Service",
      options: {
        filter: false,
      },
    }
  ];
  const [filterDialog,setFilterDialog] = useState(false)
  const options = {
    filter:false,
    customToolbar: () => {
      return <CustomToolbar listener={handleClickOpenSubTable} handleFilter={handleFilter} />;
    },
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };
  const handleClickOpenSubTable = (rowID = 1, subTablesTitle = "Add") => {
    setOpenSubTable(true);
    setRowID(rowID);
    setSubTablesTitle(subTablesTitle);
  };

  return (
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
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
      </MuiThemeProvider>
      <div>
        <Dialog
          fullScreen
          open={openSubTable}
          onClose={() => setOpenSubTable(false)}
          TransitionComponent={Transition}
        >
          <SubTables setOpenDialog={setOpenSubTable} modalTitle={subTablesTitle} />
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
  );
}
