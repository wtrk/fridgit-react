import React, { useState, useEffect,useRef } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
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
import Preventive from "./Components/Preventive.js";
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FridgesType = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [openAddPreventive, setOpenAddPreventive] = useState(false); //for modal
  const [fridgesTypeId, setFridgesTypeID] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [itemsBackup, setItemsBackup] = useState([]);
  const [preventivesChosen, setPreventivesChosen] = useState({});
  const [refreshData, setRefreshData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false)
      });
    };
    fetchData();
  }, [refreshData]);


  const preventivesChosenFirstRun = useRef(true);
  useEffect(() => {
    const fetchData = async () => {
      if (preventivesChosenFirstRun.current) {
        preventivesChosenFirstRun.current = false;
      }else{
        await axios({
          method: "put",
          url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${fridgesTypeId}`,
          data: [{
            preventive: preventivesChosen,
          }]
        }).then((response)=>{
          setIsLoading(true)
          setRefreshData(response.data)
          
        })
      }
    };
    fetchData();
  }, [preventivesChosen]);



  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "refrigerant_type",
      label: "Refrigerant Type",
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
                  handleAdd("Edit FridgesType - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "length"
    },
    {
      name: "width"
    },
    {
      name: "height"
    },
    {
      name: "cbm",
      label: "CBM",
    },
    {
      name: "preventive_count_year",
      label: "Preventive count/year",
    },
    {
      name: "preventive",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleOpenPreventive(tableMeta.rowData[2],tableMeta.rowData[0],value);
                }}
              >
                {value.length}
              </a>
            </div>
          );
        },
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
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New FridgesType");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/${idsToDelete}`, {
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

  const handleAdd = (title, fridgesTypeId) => {
    setOpenAddForm(true);
    setFridgesTypeID(fridgesTypeId);
    setFormTitle(title);
  };
  const handleOpenPreventive = (title, fridgesTypeId,value) => {
    setOpenAddPreventive(true);
    setFridgesTypeID(fridgesTypeId);
    setFormTitle(title);
    setPreventivesChosen(value);
  }
  const handleCloseAddPreventive = () => setOpenAddPreventive(false)

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
          label="Filter by Company Name"
        />
      )}
    />
    {!isLoading ?
      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    :<CircularProgress  size={30} className="pageLoader" />
    }
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
            fridgesTypeId={fridgesTypeId}
            setIsLoading={setIsLoading}
            setRefreshData={setRefreshData}
          />
        </Dialog>
        <Dialog
          fullScreen
          open={openAddPreventive}
          onClose={handleCloseAddPreventive}
          TransitionComponent={Transition}
        >
          <Preventive
            title={formTitle}
            handleClose={handleCloseAddPreventive}
            fridgesTypeId={fridgesTypeId}
            preventivesChosen={preventivesChosen}
            setPreventivesChosen={setPreventivesChosen}
            setIsLoading={setIsLoading}
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
export default FridgesType