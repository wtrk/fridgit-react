import React, { useState,useEffect } from "react";
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
import {datatableTheme} from "assets/css/datatable-theme.js";
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
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); //for modal
  const [RowID, setRowID] = useState(0); //current row
  const [modal_Title, setmodal_Title] = useState("Add"); //modal title
  const [formTitle, setFormTitle] = useState("Add Service Type");
  const [userId, setUserID] = useState(); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [itemsBackup, setItemsBackup] = useState([]);
  const [items, setItems] = useState([]); //table items
  const [pagingInfo, setPagingInfo] = useState({page:0,limit:20,skip:0,count:20}); //Pagination Info
  const [searchEntry, setSearchEntry] = useState([]); //searchEntry

  useEffect(() => {
    const fetchData = async () => {
      console.log(searchEntry)
      await axios(`${process.env.REACT_APP_BASE_URL}/serviceTypes?limit=${pagingInfo.limit}&skip=${pagingInfo.skip}&searchEntry=${searchEntry}`, {
        responseType: "json",
      }).then((response) => {
        setPagingInfo({...pagingInfo,count:response.data.count});
        setItems(response.data.data)
        setItemsBackup(response.data.data)
        return setIsLoading(false)
      });
    };
    fetchData();
  }, [open,pagingInfo.page,pagingInfo.limit,searchEntry]);
  
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
      name: "name"
    }
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: pagingInfo.limit,
    rowsPerPageOptions: [20, 50, 100],
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
    },
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
    serverSide: true,
    count:pagingInfo.count, // Use total number of items
    page: pagingInfo.page,
    onTableChange: (action, tableState) => {
      if (action === "changePage") {
        setPagingInfo({...pagingInfo,page:tableState.page,skip:tableState.page*pagingInfo.limit});
      }else if(action === "changeRowsPerPage"){
        setPagingInfo({...pagingInfo,limit:tableState.rowsPerPage});
      }
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


  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    setSearchEntry(newValue)
    // if(newValue.length===0) setItems(itemsBackup); else{
    //   let valueToSearch=[]
    //   newValue.forEach(newValueEntry=>{
    //     valueToSearch.push(...itemsBackup.filter((e,i) => {
    //       if(!valueToSearch.map(eSearch=>eSearch._id).includes(e._id)){
    //         if (e.name.toLowerCase().includes(newValueEntry.toLowerCase())){
    //           return true;
    //         }
    //       }
    //     }))
    //   })
    //   setItems(valueToSearch)
    // }
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
export default ServiceType