import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import DeleteItems from "./Components/DeleteItems.js";
import axios from 'axios';



// Top 100 films as rated by IMDb preventiveActions. http://www.imdb.com/chart/top
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

const PreventiveAction = () => {
  const classes = useStyles(); //custom css
  const [isLoading, setIsLoading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [preventiveActionId, setPreventiveActionID] = useState(); //modal title
  const [countriesList, setCountriesList] = useState([]);
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [itemsBackup, setItemsBackup] = useState([]);
  const [agreeToDelete, setAgreeToDelete] = useState({
    open:false,
    idToDelete:"",
    confirmDeletion:false
  });

  const [items, setItems] = useState([]); //table items
  useEffect(() => {
    const fetchData = async () => {
      const countries = await axios(`${process.env.REACT_APP_BASE_URL}/countries`, {
        responseType: "json",
      }).then((response) => {
        setCountriesList(response.data)
        return response.data
      });
      await axios(`${process.env.REACT_APP_BASE_URL}/preventiveActions`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false);
      });
    };
    fetchData();
  }, [openAddForm,agreeToDelete]);

  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "name",
      label: "description",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit PreventiveAction - "+tableMeta.rowData[2],tableMeta.rowData[0]);
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
      name: "nameAr",
      label: "arabic description"
    },
    {
      name: "category"
    },
    {
      name: "categoryAr",
      label: "arabic category"
    },
    {
      name: "subCategory"
    },
    {
      name: "subCategoryAr",
      label: "arabic subCategory"
    },
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
            handleAdd("Add New PreventiveAction");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id);
      setAgreeToDelete({
        open:true,
        idToDelete:idsToDelete,
        confirmDeletion:false
      })
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

  const handleAdd = (title, preventiveActionId) => {
    setOpenAddForm(true);
    setPreventiveActionID(preventiveActionId);
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
  
  // const handleConfirmToDelete = () =>{
  //     setAgreeToDelete({
  //       ...agreeToDelete,
  //       confirmDeletion:true
  //     }) 
  // }
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if(agreeToDelete.confirmDeletion===true&&agreeToDelete.open===true){
  //       await axios.delete(`${process.env.REACT_APP_BASE_URL}/preventiveActions/${agreeToDelete.idToDelete}`, {
  //           responseType: "json",
  //         }).then((response) => {
  //           setAgreeToDelete({
  //             ...agreeToDelete,
  //             open:false
  //           }) 
  //         });
  //     }
  //   };
  //   fetchData();
  // }, [agreeToDelete]);
  
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
            preventiveActionId={preventiveActionId}
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
        <Dialog open={agreeToDelete["open"]} onClose={()=>setAgreeToDelete(false)}>
          <DeleteItems setAgreeToDelete={setAgreeToDelete} agreeToDelete={agreeToDelete} table="preventiveActions" />
        </Dialog>
      </div>
    </Container>
  );
}
export default PreventiveAction