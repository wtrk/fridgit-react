import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import Typography from "@material-ui/core/Typography";
import {Switch,Box} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import datatableTheme from "assets/css/datatable-theme.js";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Container from "@material-ui/core/Container";

import { Link } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import axios from 'axios';

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
  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await axios(`${process.env.REACT_APP_BASE_URL}/userProfile`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
      });
    };
    fetchData();
  }, []);
  const [openDialog2, setOpenDialog2] = useState(false); //for modal
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleClickOpen("Edit");
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
      name: "id",
      label: "Privilege",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Link to={"/admin/Privilege/"+value}>Privilege</Link>
            </div>
          );
        },
      },
    },
    {
      name: "can_view",
      label: "Can View",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
          );
        },
      },
    },
    {
      name: "can_edit",
      label: "Can Edit",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
          );
        },
      },
    },
    {
      name: "can_delete",
      label: "Can Delete",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <Switch
                checked={value === 1 ? true : false}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
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
            inputs={[
              { labelText: "Description", type: "text" },
              { labelText: "Privilege", type: "text" },
            ]}
          />
        </Dialog>
      </div>
    </Container>
  );
}
