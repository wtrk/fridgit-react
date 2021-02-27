import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import axios from 'axios';



// Top 100 films as rated by IMDb citys. http://www.imdb.com/chart/top
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

const City = () => {
  const classes = useStyles(); //custom css
  const [isLoading, setIsloading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [cityId, setCityID] = useState(); //modal title
  const [countriesList, setCountriesList] = useState([]);
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});

  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      const countries = await axios(`${process.env.REACT_APP_BASE_URL}/countries`, {
        responseType: "json",
      }).then((response) => {
        setCountriesList(response.data)
        return response.data
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsloading(false);
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
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit City - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "name"
    },
    {
      name: "country",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let countryValue
          if(countriesList.filter(e=> e._id===value)[0]){
            countryValue = countriesList.filter((e) => e._id == value )[0];
          }
          return !countryValue ? "-" : <div className="d-flex">
                  <img src={`https://www.countryflags.io/${countryValue.code}/flat/32.png`}/> &nbsp; 
                  {countryValue.name}
                </div>
        },
      },
    }
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New City");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex].id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/cities/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
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

  const handleAdd = (title, cityId) => {
    setOpenAddForm(true);
    setCityID(cityId);
    setFormTitle(title);
  };


  const handleCloseAddForm = () => setOpenAddForm(false)

  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(newValue.length===0) setItems(itemsBackup); else{
      let valueToSearch=[]
      newValue.forEach(newValueEntry=>{
        valueToSearch.push(...itemsBackup.filter((e,i) => {
          if(!valueToSearch.map(eSearch=>eSearch._id).includes(e._id)){
            if (e.name.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
          }
        }))
      })
      setItems(valueToSearch)
    }
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
    <Autocomplete
      multiple
      freeSolo
      limitTags={3}
      id="tags-standard"
      options={[]}
      getOptionLabel={(option) => option}
      onChange={handleChangeSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder="Search Data"
          label="Filter by Name"
        />
      )}
    />

      {!isLoading ? (
        <MuiThemeProvider theme={datatableTheme}>
          <MUIDataTable
            title=""
            data={items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      ) : (
        <CircularProgress size={30} className="pageLoader" />
      )}

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
            cityId={cityId}
            countriesList={countriesList}
          />
        </Dialog>
        {/*********************** FILTER start ****************************/}
        <Dialog
          onClose={() => setFilterDialog(false)}
          maxWidth={"xl"}
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} />
        </Dialog>
      </div>
    </Container>
  );
}
export default City