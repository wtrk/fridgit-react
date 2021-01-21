import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import datatableTheme from "assets/css/datatable-theme.js";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Container from "@material-ui/core/Container";

import Switch from "@material-ui/core/Switch";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";

import AddFormDialog from "components/CustomComponents/AddFormDialog.js";

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
  const [items, setItems] = useState([
    {
      description: "Super Administrator",
      canView: 1,
      canEdit: 1,
      canDelete: 1,
    },
    { description: "Client Profile", canView: 1, canEdit: 0, canDelete: 0 },
    { description: "Operator", canView: 1, canEdit: 1, canDelete: 0 },
    { description: "Administrator", canView: 1, canEdit: 1, canDelete: 0 },
    { description: "Viewer", canView: 1, canEdit: 0, canDelete: 0 },
  ]); //table items
  const [openDialog2, setOpenDialog2] = useState(false); //for modal
  const [modal_Title, setmodal_Title] = useState("Rename"); //modal title

  const columns = [
    {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleClickOpen("Rename");
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
      name: "canView",
      label: "Can View",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "canEdit",
      label: "Can Edit",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "canDelete",
      label: "Can Delete",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
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

  const handleClickOpen = (modal_Title) => {
    setOpenDialog2(true);
    setmodal_Title(modal_Title);
  };

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
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
          open={openDialog2}
          onClose={handleCloseDialog2}
          TransitionComponent={Transition}
        >
          <AddFormDialog
            title={modal_Title + " User Roles"}
            handleClose={handleCloseDialog2}
            inputs={[{ labelText: "Description", type: "text" }]}
          />
        </Dialog>
      </div>
    </Container>
  );
}
