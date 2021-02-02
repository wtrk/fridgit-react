import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Switch,
  Box,
  Typography,
  Dialog,
  Slide,
  Container,
  Chip,
  TextField,CircularProgress,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { datatableTheme } from "assets/css/datatable-theme.js";

import { Link } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await axios(`${process.env.REACT_APP_BASE_URL}/userProfile`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        return setIsloading(false)
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
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 100, 50],
    selectToolbarPlacement: "replace",
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
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
          title={isLoading && <CircularProgress  size={30} style={{position:"absolute",top:130,zIndex:100}} />}
          data={items}
          columns={columns}
          options={options}
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
