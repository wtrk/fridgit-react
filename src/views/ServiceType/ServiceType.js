import React, { useState,useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import datatableTheme from "assets/css/datatable-theme.js";
import AddFormDialog from "./Components/AddFormDialog.js";
import axios from 'axios';

const top100Films = [];


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

const ServiceType = () => {
  const classes = useStyles(); //custom css

  const [open, setOpen] = useState(false); //for modal
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [formTitle, setFormTitle] = useState("Add Service Type");
  const [userId, setUserID] = useState(); //modal title
  const [filterDialog,setFilterDialog] = useState(false)

  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/serviceTypes`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
      });
    };
    fetchData();
  }, []);
  
  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "code",
      label: "Code",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit Service Type - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "name",
      label: "Name",
    }
  ];

  const options = {
    filter:false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar listener={() => {
        handleAdd("Add Service Type");
      }} handleFilter={handleFilter} />;
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/serviceTypes/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    }
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleClickOpen = (rowID=1, modal_Title="Add") => {
    setOpen(true);
    setRowID(rowID);
    setmodal_Title(modal_Title);
  };
  

  const handleAdd = (title, userId) => {
    setFormTitle(title)
    setOpen(true);
    setUserID(userId);
  };

  const handleClose = () => {
    setOpen(false);
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
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
        <AddFormDialog
          title={formTitle}
          handleClose={handleClose}
          userId={userId}
        />
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
export default ServiceType