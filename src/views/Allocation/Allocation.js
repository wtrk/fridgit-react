import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Typography,
  Box,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import dataJson from "./data.json";



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
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState(dataJson); //table items
  const [open, setOpen] = useState(false); //for modal
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)




  const columns = [
    {
      name: "code",
      label: "Code",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={() => handleClickOpen("1", "Edit")}>
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
    {
      name: "supplier",
      label: "Supplier",
    },
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 100, 50],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar listener={handleClickOpen} handleFilter={handleFilter} />
      );
    },
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleClickOpen = (rowID, modal_Title) => {
    setOpen(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);
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
          title={isLoading && <CircularProgress  size={30} style={{position:"absolute",top:130,zIndex:100}} />}
          data={items}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>

      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={() => setOpen(false)}
          TransitionComponent={Transition}
        >
          <SubTables setOpenDialog={() => setOpen(false)} />
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
