import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import datatableTheme from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import axios from 'axios';



// Top 100 films as rated by IMDb tiers. http://www.imdb.com/chart/top
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

const Tier = () => {
  const classes = useStyles(); //custom css
  const [isLoading, setIsloading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [tierId, setTierId] = useState(); //modal title
  const [RowID, setRowID] = useState(0); //current row
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/tiers`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        return setIsloading(false)
      });
    };
    fetchData();
  }, [openAddForm]);




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
                  handleAdd("Edit Tier - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
    filter: false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New Tier");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/tiers/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    },
    textLabels: {
        body: {
            noMatch: isLoading ? <CircularProgress disableShrink /> : 'Sorry, there is no matching data to display'
        },
    },
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, tierId) => {
    setOpenAddForm(true);
    setTierId(tierId);
    setFormTitle(title);
  };
  const handleCloseAddForm = () => setOpenAddForm(false)

  //Search component ---------------START--------------
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const handleChangeSearch = (e, newValue) => {
    if(itemsBackup.length===0) setItemsBackup(items)
    setSearchValue(newValue)
    if(newValue===null) setItems(itemsBackup); else setItems([newValue])
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
    <Autocomplete
      id="tags-filled"
      options={items || {}}
      value={searchValue || {}}
      getOptionLabel={(option) => option.name || ""}
      onChange={handleChangeSearch}
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
          placeholder="Search by Name"
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
          open={openAddForm}
          onClose={handleCloseAddForm}
          TransitionComponent={Transition}
        >
          <SubTables
            title={formTitle}
            handleClose={handleCloseAddForm}
            tierId={tierId}
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
export default Tier