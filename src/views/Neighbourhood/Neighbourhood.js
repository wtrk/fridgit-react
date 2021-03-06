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
import { getCookie } from 'components/auth/Helpers';

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import axios from 'axios';



// Top 100 films as rated by IMDb neighbourhoods. http://www.imdb.com/chart/top
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

const Neighbourhood = () => {
  const token = getCookie('token');
  const classes = useStyles(); //custom css
  const [isLoading, setIsLoading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [neighbourhoodId, setNeighbourhoodID] = useState(); //modal title
  const [citiesList, setCitiesList] = useState([]);
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [itemsBackup, setItemsBackup] = useState([]);
  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setCitiesList(response.data)
        return response.data
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false);
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
                  handleAdd("Edit Neighbourhood - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "city_id",
      label: "City",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-"
          if(citiesList.filter(e=> e._id==value)[0]){
            cityValue = citiesList.filter(e=> e._id==value)[0].name;
          }

          return cityValue
        }
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
            handleAdd("Add New Neighbourhood");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/neighbourhoods/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
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

  const handleAdd = (title, neighbourhoodId) => {
    setOpenAddForm(true);
    setNeighbourhoodID(neighbourhoodId);
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
            neighbourhoodId={neighbourhoodId}
            citiesList={citiesList}
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
export default Neighbourhood