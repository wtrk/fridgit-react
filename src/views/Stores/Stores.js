import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import axios from 'axios';
import { getCookie } from 'components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Store = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [storesId, setStoreID] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [citiesList, setCitiesList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setCitiesList(response.data)
        return response.data
      });
      const neighbourhoods = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setNeighbourhoodsList(response.data)
        return response.data
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/stores`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false)
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
                  handleAdd("Edit Store - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "branch"
    },
    {
      name: "branch_number",
      label: "Branch Number",
    },
    {
      name: "location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div style={{ width: 200 }}>
          <strong>City</strong>: {value ? citiesList.filter(e=> e._id==value.city_id)[0].name : "-"}
          <br />
            <strong>Neighbourhood</strong>: {value ? neighbourhoodsList.filter(e=> e._id==value.neighbourhood_id)[0].name : "-"}
            <br />
            <strong>Area</strong>: {value ? value.area : "-"}
            <br />
            <strong>Mobile</strong>: {value ? value.mobile : "-"}
            <br />
          </div>
        ),
      },
    },
    {
      name: "finance"
    },
    {
      name: "status"
    },
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New Store");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/stores/${idsToDelete}`, {
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
    onDownload: (buildHead, buildBody, columns, data) => {
      data.map(rowData=>{
        const city = citiesList.filter(e=> e._id==rowData.data[5].city_id)[0].name
        const neighbourhood = neighbourhoodsList.filter(e=> e._id==rowData.data[5].neighbourhood_id)[0].name
        const mobile =rowData.data[5].mobile
        rowData.data[5] = "City: "+city+"\nNeighbourhood: "+neighbourhood+"\nMobile: "+mobile
        return rowData
      })
      return buildHead(columns) + buildBody(data);
    }
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, storesId) => {
    setOpenAddForm(true);
    setStoreID(storesId);
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
            storeId={storesId}
            citiesList={citiesList}
            neighbourhoodsList={neighbourhoodsList}
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
export default Store