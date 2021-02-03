import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Box,
  Dialog,
  Slide,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function FullWidthTabs() {

  const [openSubTable, setOpenSubTable] = useState(false); //for modal
  const [RowID, setRowID] = useState(0); //current row
  const [subTablesTitle, setSubTablesTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)

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
              className="table-link"
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
  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
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
